from django.core.management import BaseCommand

from accounts.models import Employee


class Command(BaseCommand):
    def add_arguments(self, parser):
        parser.add_argument('--email')
        parser.add_argument('--password')
        parser.add_argument('--first_name')
        parser.add_argument('--last_name')
        parser.add_argument('--middle_name')

    def handle(self, *args, **kwargs):
        email = kwargs['email']
        password = kwargs['password']
        first_name = kwargs['first_name']
        last_name = kwargs['last_name']
        middle_name = kwargs['middle_name']
        admin = Employee.objects.create_superuser(email, password)
        admin.first_name = first_name
        admin.last_name = last_name
        admin.middle_name = middle_name
        admin.save()
        self.stdout.write(self.style.SUCCESS(
                f'Создан аккаунт администратора: {admin}'
            )
        )
