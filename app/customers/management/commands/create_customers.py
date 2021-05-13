from django.core.management import BaseCommand

from customers.models import Customer

VIP_CUSTOMER_PREFIX = 'VIP заказчик'
REGULAR_CUSTOMER_PREFIX = 'Простой смертный'
ALTERNATIVE_NAME_PREFIX = 'Торговая марка'
COUNT = 3


def create_vip_customers():
    for num in range(COUNT):
        Customer.objects.get_or_create(
            official_name=f'{VIP_CUSTOMER_PREFIX} #{num+1}',
            alternative_name=f'{VIP_CUSTOMER_PREFIX}, {ALTERNATIVE_NAME_PREFIX} #{num+1}',
            is_vip=True,
        )
    print('VIP-заказчики успешно созданы')


def create_regular_customers():
    for num in range(COUNT):
        Customer.objects.get_or_create(
            official_name=f'{REGULAR_CUSTOMER_PREFIX} #{num+1}',
            alternative_name=f'{REGULAR_CUSTOMER_PREFIX}, {ALTERNATIVE_NAME_PREFIX} #{num+1}',
            is_vip=False,
        )
    print('Простые смертные заказчики успешно созданы')


class Command(BaseCommand):
    def handle(self, *args, **options):
        create_vip_customers()
        create_regular_customers()

