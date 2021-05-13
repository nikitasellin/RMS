from django.core.mail import send_mail
from django.db import models
from django.conf import settings

from accounts.models import Employee
from work_tasks.models import WorkTask


class Report(models.Model):
    """
    Отчёт инженера
    """

    class Meta:
        verbose_name = 'Отчёт о работах'
        verbose_name_plural = 'Отчёты о работах'

    author = models.ForeignKey(
        Employee,
        verbose_name='Автор',
        on_delete=models.PROTECT,
        related_name='reports',
        blank=False,
        null=False,
    )
    tasks = models.ManyToManyField(
        WorkTask,
        verbose_name='Запросы',
        related_name='reports',
        blank=False,
    )
    start_date = models.DateField(
        'Дата выезда/начала работ',
        blank=False,
        null=False,
    )
    completion_date = models.DateField(
        'Дата возвращения/окончания работ',
        blank=False,
        null=False,
    )
    title = models.CharField(
        'Тема',
        max_length=200,
        blank=False,
        null=False,
    )
    body = models.TextField(
        'Описание хода работ',
        blank=False,
        null=False,
    )
    results = models.TextField(
        'Итоги работ',
        blank=False,
        null=False,
    )
    files = models.TextField(
        'Ссылки на документацию',
        blank=True,
        null=True,
    )
    post_date = models.DateTimeField(
        'Дата написания отчёта',
        auto_now_add=True,
    )
    edit_date = models.DateTimeField(
        'Дата последней правки отчёта',
        auto_now=True,
    )

    def update_related_tasks(self, task_update_params):
        for item in task_update_params:
            wt = self.tasks.get(id=item['task_id'])
            wt.actual_time = item['hours']
            wt.comment = item['comment']
            wt.status = 'D'
            wt.save()
            wt.send_email('change_status')

    def send_email(self):
        tasks = []
        recipients = []
        for task in self.tasks.all():
            tasks.append(task.srv_number)
            recipients.extend([item.support_mailing_list for item in task.directions.all()])
            recipients.append(task.originator.email)
        recipients.append(self.author.group.common_email)
        recipients_list = set(recipients)
        task_list = ', '.join(tasks)
        url = f'{settings.FRONTEND_URL}/report/{self.id}/'
        text = f'''Инженер {self.author.full_name} написал отчёт по задачам {task_list}. Доступен по ссылке: {url}.'''
        send_mail(
            f'Создан новый отчёт по задачам {task_list}.',
            text,
            settings.ADMIN_EMAIL,
            list(recipients_list),
            fail_silently=False,
        )

    def __str__(self):
        return f'{self.title} | {self.author.full_name}'
