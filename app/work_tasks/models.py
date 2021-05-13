from django.core.validators import RegexValidator
from django.db import models
from django.conf import settings

from accounts.models import Employee, EmployeeGroup
from customers.models import Site

from work_tasks.tasks import async_send_mail


class Direction(models.Model):
    """
    Направления работ.
    """

    class Meta:
        verbose_name = 'Направление'
        verbose_name_plural = 'Направления'

    name = models.CharField(
        'Наименование',
        max_length=10,
        unique=True,
        blank=False,
        null=False,
    )
    description = models.TextField(
        'Описание',
        blank=True,
        null=True,
    )
    support_mailing_list = models.EmailField(
        'Гпупповой список рассылки группы ТП по направлению',
        blank=False,
        null=False,
    )

    def __str__(self):
        return f'{self.name} ({self.support_mailing_list})'


class ExecutionVariant(models.Model):
    """
    Особенности исполнения.
    """

    class Meta:
        verbose_name = 'Особенности исполнения'
        verbose_name_plural = 'Особенности исполнения'

    name = models.CharField(
        'Вариант',
        max_length=50,
        unique=True,
        blank=False,
        null=False,
    )
    description = models.TextField(
        'Описание',
        blank=False,
        null=False,
    )
    need_engineer = models.BooleanField(
        'Требуется выделение инженера',
        default=True,
        blank=False,
        null=False,
    )

    def __str__(self):
        return self.name


class WorkTask(models.Model):
    """
    Рабочие задачи.
    """

    class Meta:
        verbose_name = 'Рабочая задача'
        verbose_name_plural = 'Рабочие задачи'

    STATUS_CHOICES = [
        ('O', 'Open'),
        ('A', 'Accepted'),
        ('R', 'Rejected'),
        ('D', 'Done'),
    ]

    site = models.ForeignKey(
        Site,
        verbose_name='Площадка',
        on_delete=models.PROTECT,
        related_name='work_tasks',
        blank=False,
        null=False,
    )
    directions = models.ManyToManyField(
        Direction,
        verbose_name='Направления',
        related_name='work_tasks',
        blank=False,
    )
    due_date = models.DateField(
        'Due date',
        blank=False,
        null=False,
    )
    iso_week = models.CharField(
        'Рабочая неделя',
        max_length=7,
        blank=True,
        null=True,
    )
    srv_title = models.CharField(
        'Название запроса',
        max_length=200,
        blank=False,
        null=False,
    )
    description = models.TextField(
        'Состав работ',
        blank=False,
        null=False,
    )
    estimated_time = models.FloatField(
        'Ожидаемые трудозатраты',
        blank=True,
        null=True,
    )
    srv_regex = RegexValidator(
        regex=r'^SRV\d{6}',
        message='Номер должен быть введён в формате SRV123456.',
    )
    srv_number = models.CharField(
        'Номер запроса',
        max_length=9,
        validators=[srv_regex],
        blank=True,
        null=True,
    )
    engineer = models.ForeignKey(
        Employee,
        verbose_name='Назначенный инженер',
        related_name='task_performers',
        on_delete=models.PROTECT,
        blank=True,
        null=True,
    )
    actual_time = models.FloatField(
        'Фактическое время выполнения',
        blank=True,
        null=True,
    )
    comment = models.TextField(
        'Комментарий',
        blank=True,
        null=True,
    )
    status = models.CharField(
        'Статус',
        max_length=1,
        choices=STATUS_CHOICES,
        blank=False,
        null=False,
        default='O',
    )
    originator = models.ForeignKey(
        Employee,
        verbose_name='Оригинатор',
        related_name='task_originators',
        on_delete=models.PROTECT,
        blank=False,
        null=False,
    )
    execution_variant = models.ForeignKey(
        ExecutionVariant,
        verbose_name='Особенности исполнения',
        related_name='work_tasks',
        on_delete=models.PROTECT,
        blank=True,
        null=True,
    )
    post_time = models.DateTimeField(
        'Время добавления запроса в БД',
        auto_now_add=True,
    )

    def assign_srv_number(self):
        """
        Для совместимости с имеющейся системой.
        """
        num = 200000 + self.id
        self.srv_number = f'SRV{num}'
        self.save()

    @property
    def city(self):
        return self.site.city.alternate_names

    @property
    def customer(self):
        return self.site.customer.official_name

    @property
    def engineer_full_name(self):
        engineer = self.engineer
        ev = self.execution_variant
        if engineer:
            full_name = f'{engineer.first_name} {engineer.last_name}'
        elif ev and ev.need_engineer:
            full_name = 'Не назначен'
        else:
            full_name = 'Не требуется'
        return full_name

    @property
    def have_report(self):
        if self.reports.all():
            return True
        return False

    @property
    def report_id(self):
        if self.reports.first():
            return self.reports.first().id
        return None

    def make_iso_week(self):
        iso_date = self.due_date.isocalendar()
        return f'{iso_date.year}W{iso_date.week}'

    def send_email(self, action_type):
        details = f'Детали по ссылке: {settings.FRONTEND_URL}/task/{self.id}/'
        try:
            teamlead_group = EmployeeGroup.objects.get(name='teamlead')
            teamlead_email = teamlead_group.common_email
        except EmployeeGroup.DoesNotExist as e:
            teamlead_email = settings.ADMIN_EMAIL
        actions = {
            'create': {
                'subject':  f'Создана новая задача f{self.srv_number}.',
                'text': f'''{self.originator.full_name} добавил/а новую задачу. {details}.''',
                'default_rcpt_to': [teamlead_email],
            },
            'assign_engineer': {
                'subject': f'На задачу f{self.srv_number} назначен исполнитель.',
                'text': f'''На задачу {self.srv_number} назначен {self.engineer_full_name}. {details}.''',
                'default_rcpt_to': [self.originator.email],
            },
            'change_status': {
                'subject': f'У задачи f{self.srv_number} изменился статус.',
                'text': f'''Новый статус задачи {self.srv_number}: {self.get_status_display()}. {details}.''',
                'default_rcpt_to': [teamlead_email, self.originator.email],
            },
            'change_due_date': {
                'subject': f'У задачи f{self.srv_number} изменился плановый срок начала работ.',
                'text': f'''Новый Due date задачи {self.srv_number}: {self.due_date}. {details}.''',
                'default_rcpt_to': [teamlead_email, self.originator.email],
            },
            'change_execution_variant': {
                'subject': f'Выбран вариант исполнения задачи f{self.srv_number}.',
                'text': f'''Вариант выполнения задачи {self.srv_number}: {self.execution_variant}. {details}.''',
                'default_rcpt_to': [teamlead_email, self.originator.email],
            },
            'full_update': {
                'subject': f'Задача f{self.srv_number} была обновлена.',
                'text': f'''Внесены изменения в задачу {self.srv_number}. {details}.''',
                'default_rcpt_to': [teamlead_email, self.originator.email],
            },
        }
        recipients_list = actions[action_type]['default_rcpt_to']
        if self.engineer:
            recipients_list.append(self.engineer.email)
        async_send_mail.delay(
            actions[action_type]['subject'],
            actions[action_type]['text'],
            settings.ADMIN_EMAIL,
            recipients_list,
            fail_silently=False,
        )

    def save(self, *args, **kwargs):
        iso_week = self.make_iso_week()
        if self.iso_week != iso_week:
            self.iso_week = iso_week
        return super().save(*args, **kwargs)

    def __str__(self):
        return f'{self.srv_number} {self.srv_title}'
