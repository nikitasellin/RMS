import datetime
import random

from django.core.management import BaseCommand
from factory import django, Faker

from accounts.models import EmployeeGroup, Employee
from customers.models import Site
from work_tasks.models import WorkTask, Direction, ExecutionVariant


TASKS_COUNT = 29


class WorkTaskFactory(django.DjangoModelFactory):
    class Meta:
        model = WorkTask

    due_date = Faker(
        'date_between_dates',
        date_start=datetime.date(2021, 4, 1),
        date_end=datetime.date(2021, 5, 1),
    )
    srv_title = Faker('bs')
    description = Faker(
        'text',
        max_nb_chars=1000,
        ext_word_list=None,
    )
    estimated_time = Faker(
        'random_int',
        min=4,
        max=24,
    )


class Command(BaseCommand):
    def handle(self, *args, **options):
        manager = EmployeeGroup.objects.get(name='manager')
        engineer = EmployeeGroup.objects.get(name='engineer')
        sites = Site.objects.all()
        site_list = [item for item in sites]
        directions = Direction.objects.all()
        directions_list = [item.pk for item in directions]
        evs = ExecutionVariant.objects.all()
        evs_list = [item for item in evs]
        managers = Employee.objects.filter(group=manager)
        managers_list = [item for item in managers]
        engineers = Employee.objects.filter(group=engineer)
        engineers_list = [item for item in engineers]

        with Faker.override_default_locale('ru_RU'):
            for i in range(TASKS_COUNT):
                factory = WorkTaskFactory
                wt = factory.build()
                wt.site = random.choice(site_list)
                ev = random.choice(evs_list)
                wt.execution_variant = ev
                if ev.need_engineer:
                    wt.engineer = random.choice(engineers_list)
                wt.originator = random.choice(managers_list)
                wt.save()
                wt.directions.set([random.choice(directions_list)])
                wt.assign_srv_number()
            print(f'{TASKS_COUNT} задач успешно добавлены')
