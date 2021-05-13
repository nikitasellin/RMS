from rest_framework import serializers

from accounts.models import Employee, EmployeeGroup


class EmployeeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Employee
        fields = (
            'id',
            'last_name',
            'first_name',
            'middle_name',
            'group',
            'city',
            'phone_number',
            'can_be_performer',
            'email',
            'password',
            'full_name',
            'role',
        )
        extra_kwargs = {
            'password': {'write_only': True}
        }

    def create(self, validated_data):
        employee = super().create(validated_data)
        employee.set_password(validated_data['password'])
        employee.save()
        return employee


class EmployeeGroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = EmployeeGroup
        fields = (
            'id',
            'name',
            'description',
            'acronym',
            'common_email',
        )
