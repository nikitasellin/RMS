from django.core.management import BaseCommand
from factory import django, Faker, PostGenerationMethodCall

from accounts.models import Employee, EmployeeGroup


class EmployeeFactory(django.DjangoModelFactory):
    class Meta:
        model = Employee

    first_name = Faker('first_name')
    middle_name = Faker('middle_name')
    last_name = Faker('last_name')
    email = Faker('email')
    password = PostGenerationMethodCall('set_password', 'password')
    phone_number = Faker('msisdn')


def create_accounts(group, count, can_be_performer=False):
    with Faker.override_default_locale('ru_RU'):
        for i in range(count):
            factory = EmployeeFactory
            employee = factory.create()
            employee.group = group
            if can_be_performer:
                employee.can_be_performer = True
            employee.save()
    print(f'Учетные записи роли "{group}" успешно добавлены')


class Command(BaseCommand):
    def handle(self, *args, **options):
        try:
            teamlead = EmployeeGroup.objects.get(name='teamlead')
            manager = EmployeeGroup.objects.get(name='manager')
            engineer = EmployeeGroup.objects.get(name='engineer')
        except EmployeeGroup.DoesNotExist:
            print('Сначала создайте группы!')
            return
        create_accounts(
            group=teamlead,
            count=1,
        )
        create_accounts(
            group=manager,
            count=10,
        )
        create_accounts(
            group=engineer,
            count=10,
            can_be_performer=True
        )
