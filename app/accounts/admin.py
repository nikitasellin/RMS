from django.contrib import admin
from django.contrib.auth.admin import UserAdmin

from .models import EmployeeGroup, Employee, Vacation


class EmployeeAdmin(UserAdmin):
    model = Employee
    list_display = (
        'email',
        'last_name',
        'first_name',
        'middle_name',
        'group',
        'city',
        'can_be_performer',
        'phone_number',
        'is_staff',
        'is_active',
    )
    list_filter = ('is_active',)
    fieldsets = (
        (None,
            {
                'fields': (
                    'email',
                    'password',
                    'last_name',
                    'first_name',
                    'middle_name',
                    'group',
                    'city',
                    'can_be_performer',
                    'phone_number',
                )
            }
         ),
        ('Permissions', {'fields': ('is_active',)}),
    )
    add_fieldsets = (
        (None,
            {
                'classes': ('wide',),
                'fields':
                    (
                        'email',
                        'last_name',
                        'first_name',
                        'middle_name',
                        'group',
                        'city',
                        'can_be_performer',
                        'is_active',
                        'password1',
                        'password2',
                    )
            }
         ),
    )
    search_fields = ('email', 'last_name',)
    ordering = ('last_name', 'email',)


admin.site.register(EmployeeGroup)
admin.site.register(Employee, EmployeeAdmin)
admin.site.register(Vacation)
