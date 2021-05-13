from django.apps import apps
from rest_framework import serializers

City = apps.get_model('cities_light.City')


class CitySerializer(serializers.ModelSerializer):
    class Meta:
        model = City
        fields = '__all__'


class CityShortSerializer(serializers.ModelSerializer):
    class Meta:
        model = City
        fields = 'id', 'alternate_names',
