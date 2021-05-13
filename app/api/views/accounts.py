from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import mixins
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.viewsets import GenericViewSet

from accounts.models import Employee, EmployeeGroup
from api.permissions import IsTeamlead
from api.serializers.accounts import EmployeeSerializer, EmployeeGroupSerializer


class EmployeeReadViewSet(mixins.ListModelMixin,
                          mixins.RetrieveModelMixin,
                          mixins.CreateModelMixin,
                          GenericViewSet,
                          ):
    queryset = Employee.objects.all().order_by('last_name')
    serializer_class = EmployeeSerializer
    pagination_class = None
    permission_classes = IsAuthenticated,
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['can_be_performer']


class EmployeeWriteViewSet(mixins.CreateModelMixin,
                           mixins.UpdateModelMixin,
                           mixins.DestroyModelMixin,
                           GenericViewSet,
                           ):
    queryset = Employee.objects.all().order_by('last_name')
    serializer_class = EmployeeSerializer
    pagination_class = None
    permission_classes = IsTeamlead,


class EmployeeGroupViewSet(mixins.ListModelMixin,
                           mixins.RetrieveModelMixin,
                           GenericViewSet,
                           ):
    queryset = EmployeeGroup.objects.all()
    serializer_class = EmployeeGroupSerializer
    pagination_class = None
    permission_classes = IsAuthenticated,
