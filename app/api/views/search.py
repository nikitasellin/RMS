from django.apps import apps
from rest_framework.generics import ListAPIView
from rest_framework import filters

from api.serializers.search import CitySerializer

City = apps.get_model('cities_light.City')


class CityView(ListAPIView):
    search_fields = ['name', 'alternate_names']
    filter_backends = (filters.SearchFilter,)
    queryset = City.objects.all()
    serializer_class = CitySerializer
