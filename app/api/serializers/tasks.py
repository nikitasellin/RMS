from rest_framework import serializers
from rest_framework.serializers import raise_errors_on_nested_writes
from rest_framework.utils import model_meta

from accounts.models import Employee
from api.serializers.accounts import EmployeeSerializer
from api.serializers.customers import SiteSerializer
from work_tasks.models import Direction, ExecutionVariant, WorkTask


class DirectionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Direction
        fields = '__all__'


class ExecutionVariantSerializer(serializers.ModelSerializer):
    class Meta:
        model = ExecutionVariant
        fields = '__all__'


class WorkTaskSerializer(serializers.ModelSerializer):
    site = SiteSerializer(read_only=True)
    originator = EmployeeSerializer(read_only=True)

    class Meta:
        model = WorkTask
        fields = [
            'id',
            'status',
            'originator',
            'site',
            'directions',
            'due_date',
            'srv_title',
            'description',
            'estimated_time',
            'execution_variant',
            'srv_number',
            'engineer',
            'actual_time',
            'comment',
            'status',
            'engineer_full_name',
            'iso_week',
            'city',
            'customer',
            'report_id',
        ]
        depth = 1
        read_only_fields = ['originator', 'city', 'customer', 'have_report']

    def create(self, validated_data):
        site = self.initial_data['site']
        directions = self.initial_data['directions']
        originator = self.initial_data['originator']
        execution_variant = self.initial_data.get('execution_variant', None)
        wt = self.Meta.model.objects.create(
            site=site,
            originator=originator,
            execution_variant=execution_variant,
            **validated_data,
        )
        wt.assign_srv_number()
        wt.directions.set(directions)
        wt.send_email('create')
        return wt

    def update(self, instance, validated_data):
        # @TODO! Refactor method!
        engineer_id = self.initial_data.get('engineer', '')
        site = self.initial_data.get('site', '')
        directions = self.initial_data.get('directions', '')
        execution_variant = self.initial_data.get('execution_variant', '')
        action_type = self.initial_data.get('action_type', '')
        if engineer_id:
            try:
                engineer = Employee.objects.get(id=engineer_id)
                instance.engineer = engineer
            except Employee.DoesNotExist:
                pass
        if site:
            instance.site = site
        if directions:
            instance.directions.set(directions)
        if execution_variant:
            instance.execution_variant = execution_variant

        # Vanilla part begin.
        raise_errors_on_nested_writes('update', self, validated_data)
        info = model_meta.get_field_info(instance)

        m2m_fields = []
        for attr, value in validated_data.items():
            if attr in info.relations and info.relations[attr].to_many:
                m2m_fields.append((attr, value))
            else:
                setattr(instance, attr, value)

        instance.save()

        for attr, value in m2m_fields:
            field = getattr(instance, attr)
            field.set(value)
        # Vanilla part end.

        instance.send_email(action_type)
        return instance


class AssignedTaskSerializer(serializers.ModelSerializer):
    site = SiteSerializer(read_only=True)
    originator = EmployeeSerializer(read_only=True)

    class Meta:
        model = WorkTask
        fields = [
            'id',
            'originator',
            'due_date',
            'srv_title',
            'description',
            'srv_number',
            'have_report',
            'site',
        ]


class TaskForReportSerializer(serializers.ModelSerializer):
    class Meta:
        model = WorkTask
        fields = [
            'id',
            'srv_number',
            'srv_title',
            'city',
            'customer',
            'actual_time',
            'comment',
        ]
