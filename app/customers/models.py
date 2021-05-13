from django.db import models


class Customer(models.Model):
    """
    Заказчики.
    """

    class Meta:
        verbose_name = 'Заказчик'
        verbose_name_plural = 'Заказчики'

    official_name = models.CharField(
        'Официальное название организации',
        max_length=100,
        unique=True,
        blank=False,
        null=False,
    )
    alternative_name = models.CharField(
        'Альтернативное название / торговая марка',
        max_length=100,
        blank=True,
        null=True,
    )
    is_vip = models.BooleanField(
        'VIP-статус',
        default=False,
        blank=False,
        null=False,
    )

    def __str__(self):
        return f'{self.official_name} ({self.alternative_name})'


class Site(models.Model):
    """
    Площадка для проведения работ.
    """

    class Meta:
        verbose_name = 'Площадка'
        verbose_name_plural = 'Площадки'

    name = models.CharField(
        'Название',
        max_length=100,
        blank=False,
        null=False,
    )
    customer = models.ForeignKey(
        Customer,
        verbose_name='Заказчик',
        on_delete=models.PROTECT,
        related_name='sites',
        blank=False,
        null=False,
    )
    city = models.ForeignKey(
        'cities_light.City',
        verbose_name='Город',
        on_delete=models.PROTECT,
        related_name='sites',
        blank=False,
        null=False,
    )
    address = models.TextField(
        'Фактический адрес',
        blank=False,
        null=False,
    )

    def __str__(self):
        return f'{self.customer.official_name}: {self.city.name}, {self.name}'
