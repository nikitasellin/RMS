from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import mixins
from rest_framework.exceptions import ValidationError
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.viewsets import GenericViewSet

from api.permissions import IsEngineer
from api.serializers.tasks import DirectionSerializer, \
    ExecutionVariantSerializer, WorkTaskSerializer, AssignedTaskSerializer
from customers.models import Site
from work_tasks.models import Direction, ExecutionVariant, WorkTask


class DirectionViewSet(mixins.ListModelMixin,
                       mixins.RetrieveModelMixin,
                       GenericViewSet,
                       ):
    queryset = Direction.objects.all()
    serializer_class = DirectionSerializer
    permission_classes = IsAuthenticated,


class ExecutionVariantViewSet(mixins.ListModelMixin,
                              mixins.RetrieveModelMixin,
                              GenericViewSet,
                              ):
    queryset = ExecutionVariant.objects.all()
    serializer_class = ExecutionVariantSerializer
    permission_classes = IsAuthenticated,


class WorkTaskViewSet(mixins.ListModelMixin,
                      mixins.CreateModelMixin,
                      mixins.RetrieveModelMixin,
                      mixins.UpdateModelMixin,
                      mixins.DestroyModelMixin,
                      GenericViewSet
                      ):
    queryset = WorkTask.objects.all().order_by('-due_date')
    serializer_class = WorkTaskSerializer
    permission_classes = IsAuthenticated,
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['iso_week']

    def create(self, request, *args, **kwargs):
        site_id = self.request.data['site']
        site = Site.objects.get(id=site_id)
        city_id = self.request.data.get('city', '')
        customer_id = self.request.data.get('customer', '')
        execution_variant_id = self.request.data.get('execution_variant', '')
        if not city_id:
            city_id = site.city.id
        if customer_id != site.customer.id or city_id != site.city.id:
            raise ValidationError(
                'Проверьте соответствие зазкачика, города и площадки!',
                code=400,
            )
        self.request.data['site'] = site
        self.request.data['originator'] = self.request.user
        if execution_variant_id:
            execution_variant = ExecutionVariant.objects.get(id=execution_variant_id)
            self.request.data['execution_variant'] = execution_variant
        return super().create(request, *args, **kwargs)

    def update(self, request, *args, **kwargs):
        # @TODO! Refactor method.
        partial = kwargs.get('partial', False)
        execution_variant_id = self.request.data.get('execution_variant', '')
        if execution_variant_id:
            execution_variant = ExecutionVariant.objects.get(id=execution_variant_id)
            self.request.data['execution_variant'] = execution_variant
        if partial:
            return super().update(request, *args, **kwargs)
        site_id = self.request.data['site']
        site = Site.objects.get(id=site_id)
        city_id = self.request.data.get('city', '')
        customer_id = self.request.data.get('customer', '')
        if not city_id:
            city_id = site.city.id
        if customer_id != site.customer.id or city_id != site.city.id:
            raise ValidationError(
                'Проверьте соответствие зазкачика, города и площадки!',
                code=400,
            )
        self.request.data['site'] = site
        return super().update(request, *args, **kwargs)


class AssignedTaskViewSet(mixins.ListModelMixin,
                          mixins.RetrieveModelMixin,
                          mixins.UpdateModelMixin,
                          GenericViewSet
                          ):
    queryset = WorkTask.objects.all()
    serializer_class = AssignedTaskSerializer
    permission_classes = IsEngineer,

    def get_queryset(self):
        qs = super().get_queryset()
        return qs.filter(engineer=self.request.user).order_by('-due_date')


class StatusView(APIView):
    """
    Статусы рабочих задач.
    """

    def get(self, request):
        response_data = []
        for choice in WorkTask.STATUS_CHOICES:
            response_data.append({
                'id': choice[0],
                'name': choice[1],
            })
        return Response(response_data)
