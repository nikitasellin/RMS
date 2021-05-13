from django.core.management import BaseCommand

from work_tasks.models import ExecutionVariant

VARIANTS = [
    {
        'name': 'Выезд',
        'description': 'Выполнение инженером с выездом за пределы домашнего региона',
        'need_engineer': True,
    },
    {
        'name': 'Локально',
        'description': 'Выполнение инженером с выездом в пределах домашнего региона',
        'need_engineer': True,
    },
    {
        'name': 'Удалённо',
        'description': 'Выполнение инженером из офиса через УД',
        'need_engineer': True,
    },
    {
        'name': 'Подрядчик',
        'description': 'Выполнение силами подрядной организации без поддержки инженера',
        'need_engineer': False,
    },
]


class Command(BaseCommand):
    def handle(self, *args, **options):
        for variant in VARIANTS:
            ExecutionVariant.objects.get_or_create(
                name=variant['name'],
                description=variant['description'],
                need_engineer=variant['need_engineer'],
            )
            print(f'Вариант {variant["name"]} успешно добавлен')
