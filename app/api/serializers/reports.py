from django.db import transaction
from rest_framework import serializers

from api.serializers.accounts import EmployeeSerializer
from api.serializers.tasks import TaskForReportSerializer
from reports.models import Report


class ReportWriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Report
        fields = '__all__'

    @transaction.atomic
    def create(self, validated_data):
        title = validated_data.pop('title')
        start_date = validated_data['start_date']
        completion_date = validated_data['completion_date']
        tasks = validated_data.pop('tasks')
        task_update_params = self.initial_data['taskUpdateParams']
        if title == 'auto':
            evs_list = set()
            cities_list = set()
            for task in tasks:
                evs_list.add(task.execution_variant.name.lower())
                cities_list.add(task.site.city.alternate_names)
            evs = ', '.join(evs_list)
            cities = ', '.join(cities_list)
            title = f'''Отчёт о работах в г. {cities} с {start_date} по {completion_date} ({evs}).'''
        report = self.Meta.model.objects.create(
            title=title,
            **validated_data,
        )
        report.tasks.set(tasks)
        report.update_related_tasks(task_update_params)
        report.send_email()
        return report


class ReportReadSerializer(serializers.ModelSerializer):
    author = EmployeeSerializer(read_only=True)
    tasks = TaskForReportSerializer(read_only=True, many=True)

    class Meta:
        model = Report
        fields = ('id',
                  'title',
                  'author',
                  'start_date',
                  'completion_date',
                  'tasks',
                  'body',
                  'results',
                  'files',
                  )

