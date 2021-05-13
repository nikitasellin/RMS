from rest_framework import permissions


class CheckPermissionMixin:
    def has_permission(self, request, view):
        try:
            user_role = request.user.group.name
        except AttributeError:
            user_role = None
        return user_role == self.user_role


class IsEngineer(permissions.BasePermission, CheckPermissionMixin):
    user_role = 'engineer'


class IsManager(permissions.BasePermission):
    user_role = 'manager'


class IsTeamlead(permissions.BasePermission):
    user_role = 'teamlead'
