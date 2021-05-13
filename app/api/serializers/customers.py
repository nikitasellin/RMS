from rest_framework import serializers

from api.serializers.search import CityShortSerializer
from customers.models import Customer, Site


class CustomerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Customer
        fields = '__all__'


class CustomerShortSerializer(serializers.ModelSerializer):
    class Meta:
        model = Customer
        fields = 'id', 'official_name',


class SiteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Site
        fields = '__all__'

    city = CityShortSerializer()
    customer = CustomerShortSerializer()
