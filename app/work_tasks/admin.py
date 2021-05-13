from django.contrib import admin

from work_tasks.models import Direction, ExecutionVariant, WorkTask

admin.site.register(Direction)
admin.site.register(ExecutionVariant)
admin.site.register(WorkTask)