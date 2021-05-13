from django.core.management import BaseCommand

from accounts.models import EmployeeGroup

GROUPS = [
    {
        'name': 'engineer',
        'description': 'Отдел внедрения',
        'common_email': 'install@selin.com.ru',
    },
    {
        'name': 'manager',
        'description': 'Отдел управления проектами',
        'common_email': 'pm@selin.com.ru',
    },
    {
        'name': 'teamlead',
        'description': 'Руководители групп',
        'common_email': 'teamlead@selin.com.ru',
    },
]


class Command(BaseCommand):
    def handle(self, *args, **options):
        for group in GROUPS:
            EmployeeGroup.objects.get_or_create(
                name=group['name'],
                description=group['description'],
                common_email=group['common_email'],
            )
            print(f'Группа {group["name"]} успешно добавлена')
