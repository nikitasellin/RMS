from rest_framework import mixins
from rest_framework.permissions import IsAuthenticated
from rest_framework.viewsets import GenericViewSet

from api.serializers.customers import CustomerSerializer, SiteSerializer
from customers.models import Customer, Site


class CustomerViewSet(mixins.ListModelMixin,
                      mixins.RetrieveModelMixin,
                      GenericViewSet,
                      ):
    queryset = Customer.objects.all()
    serializer_class = CustomerSerializer
    permission_classes = IsAuthenticated,


class SiteViewSet(mixins.ListModelMixin,
                  mixins.RetrieveModelMixin,
                  GenericViewSet,
                  ):
    queryset = Site.objects.all()
    serializer_class = SiteSerializer
    permission_classes = IsAuthenticated,

    def get_queryset(self):
        qs = super().get_queryset()
        try:
            customer_id = self.request.query_params.get('customer_id', '')
            qs = qs.filter(customer__id=customer_id)
        except ValueError:
            customer_id = ''
        try:
            city_id = self.request.query_params.get('city_id', '')
            qs = qs.filter(city__id=city_id)
        except ValueError:
            city_id = ''
        return qs
