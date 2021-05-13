from django.core.management import BaseCommand

from work_tasks.models import Direction

DIRECTIONS = [
    {
        'name': 'С2',
        'description': 'Направление #2',
        'support_mailing_list': 'dir2@selin.com.ru',
    },
    {
        'name': 'C3',
        'description': 'Направление #3',
        'support_mailing_list': 'dir3@selin.com.ru',
    },
    {
        'name': 'C4',
        'description': 'Направление #4',
        'support_mailing_list': 'dir4@selin.com.ru',
    },
]


class Command(BaseCommand):
    def handle(self, *args, **options):
        for direction in DIRECTIONS:
            Direction.objects.get_or_create(
                name=direction['name'],
                description=direction['description'],
                support_mailing_list=direction['support_mailing_list'],
            )
            print(f'Направление {direction["name"]} успешно добавлено')
