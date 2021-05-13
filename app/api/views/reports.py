from rest_framework import mixins
from rest_framework.permissions import IsAuthenticated
from rest_framework.viewsets import GenericViewSet
from rest_framework.exceptions import ValidationError

from api.permissions import IsEngineer
from api.serializers.reports import ReportWriteSerializer, ReportReadSerializer
from reports.models import Report


class ReportWriteViewSet(mixins.CreateModelMixin,
                         mixins.UpdateModelMixin,
                         GenericViewSet,
                         ):
    queryset = Report.objects.all()
    serializer_class = ReportWriteSerializer
    permission_classes = IsEngineer,

    def create(self, request, *args, **kwargs):
        self.request.data['author'] = self.request.user.id
        title = self.request.data['title']
        if not title:
            self.request.data['title'] = 'auto'
        task_update_params = self.request.data['taskUpdateParams']
        for item in task_update_params:
            if not item['hours']:
                raise ValidationError(
                    '''У всех задач должно быть указано фактическое время исполнения!'''
                )
        return super().create(request, *args, **kwargs)


class ReportReadViewSet(mixins.ListModelMixin,
                        mixins.RetrieveModelMixin,
                        GenericViewSet
                        ):
    queryset = Report.objects.all().order_by('-edit_date')
    serializer_class = ReportReadSerializer
    permission_classes = IsAuthenticated,
