from datetime import datetime

from django.db import models
from django.contrib.auth.models import AbstractUser, Group
from django.core.validators import RegexValidator
from django.db.models import Q
from django.urls import reverse

from .managers import EmployeeManager


class EmployeeGroup(Group):
    """
    Группа сотрудников.
    """

    class Meta:
        verbose_name = 'Группа'
        verbose_name_plural = 'Группы'

    description = models.CharField(
        'Описание',
        max_length=100,
        blank=False,
        null=False
    )
    common_email = models.EmailField(
        'Групповой список рассылки',
        unique=True,
        blank=False,
        null=False,
    )

    @property
    def acronym(self):
        acronym = ''
        for word in self.description.split():
            acronym += word[:1].upper()
        return acronym

    def __str__(self):
        return f'{self.name} ({self.acronym})'


class Employee(AbstractUser):
    """
    Реквизиты сотрудников.
    """

    class Meta:
        verbose_name = 'Сотрудник'
        verbose_name_plural = 'Сотрудники'

    username = None
    first_name = models.CharField(
        'Имя',
        max_length=50,
        blank=False,
        null=False,
    )
    middle_name = models.CharField(
        'Отчество',
        max_length=50,
        blank=False,
        null=False,
    )
    last_name = models.CharField(
        'Фамилия',
        max_length=50,
        blank=False,
        null=False,
    )
    email = models.EmailField(
        'E-mail',
        unique=True,
        blank=False,
        null=False,
    )
    phone_regex = RegexValidator(
        regex=r'^\+?1?\d{9,15}$',
        message='Номер телефона должен быть введён в формате Е.164.',
    )
    phone_number = models.CharField(
        'Номер телефона',
        validators=[phone_regex],
        max_length=17,
        blank=True,
        null=True,
    )
    city = models.ForeignKey(
        'cities_light.City',
        verbose_name='Город',
        on_delete=models.SET_NULL,
        related_name='employee',
        blank=True,
        null=True,
    )
    group = models.ForeignKey(
        EmployeeGroup,
        verbose_name='Группа',
        on_delete=models.PROTECT,
        related_name='employee',
        null=True,
        blank=True,
        default=None,
    )
    can_be_performer = models.BooleanField(
        'Может быть исполнителем',
        default=False,
        blank=False,
        null=False,
    )

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    objects = EmployeeManager()

    def get_absolute_url(self):
        return reverse('settings', kwargs={'pk': self.pk})

    @property
    def role(self):
        if self.is_superuser:
            return 'admin'
        if self.group:
            return self.group.name
        return None

    @property
    def full_name(self):
        return f'{self.first_name} {self.last_name}'

    def __str__(self):
        try:
            group_short_name = self.group.short_name
        except AttributeError:
            group_short_name = '-'
        return f'{self.last_name} {self.first_name} ({group_short_name})'

    def check_is_on_vacation(self, due_date):
        vacations = self.vacations.all()
        for vacation in vacations:
            if vacation.start_date <= due_date <= vacation.end_date:
                return True
        return False


class Vacation(models.Model):
    """
    Отпуска инженеров.
    """

    class Meta:
        verbose_name = 'Отпуск'
        verbose_name_plural = 'Отпуска'

    employee = models.ForeignKey(
        Employee, on_delete=models.CASCADE, related_name='vacations')
    start_date = models.DateField(
        'Дата начала', null=False, blank=False)
    end_date = models.DateField(
        'Дата окончания', null=False, blank=False)

    def __str__(self):
        str_start = datetime.strftime(self.start_date, '%Y.%m.%d')
        str_end = datetime.strftime(self.end_date, '%Y.%m.%d')
        days = (self.end_date - self.start_date).days + 1
        return f'{self.employee.full_name}: {str_start} - {str_end} ({days} дней).'

    @classmethod
    def get_vacation_on_week(cls, first_day, last_day):
        vacation_on_week = cls.objects.filter((Q(
            start_date__gte=first_day) & Q(
            end_date__lte=last_day)) | (Q(
            start_date__lte=first_day) & Q(
            end_date__gte=last_day)) | (Q(
            start_date__gte=first_day) & Q(
            start_date__lte=last_day) & Q(
            end_date__gte=last_day)) | (Q(
            start_date__lte=first_day) & Q(
            end_date__gte=first_day) & Q(
            end_date__lte=last_day))
        )
        return vacation_on_week
