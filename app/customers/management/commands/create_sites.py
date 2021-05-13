from django.apps import apps
from django.core.management import BaseCommand

from customers.models import Customer, Site


City = apps.get_model('cities_light.City')
SITES = [
    {
        'name': 'Технополис',
        'customer': 'VIP заказчик #1',
        'city': 'Москва',
        'address': 'Промзона, линия 2, стр. 1',
    },
    {
        'name': 'Другойполис',
        'customer': 'VIP заказчик #1',
        'city': 'Москва',
        'address': 'пр-т. Кораблестроителей, д. 13',
    },
    {
        'name': 'Иннополис',
        'customer': 'VIP заказчик #1',
        'city': 'Казань',
        'address': 'ул. Науки, д. 1',
    },
    {
        'name': 'Заводская',
        'customer': 'Простой смертный #1',
        'city': 'Краснодар',
        'address': 'ул. Заводская, д. 10',
    },
]


class Command(BaseCommand):
    def handle(self, *args, **options):
        customers = Customer.objects.all()
        if not customers:
            print('Сначала добавьте заказчиков!')
        for site in SITES:
            try:
                city = City.objects.get(alternate_names__icontains=site['city'])
            except City.DoesNotExist:
                print(f'Город {site["city"]} не найден в БД!')
                continue
            customer = customers.get(official_name__icontains=site['customer'])
            Site.objects.get_or_create(
                name=site['name'],
                customer=customer,
                city=city,
                address=site['address'],
            )
            print(f'Площадка {site["name"]} успешно добавлена')
