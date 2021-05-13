from django.contrib import admin

from customers.models import Customer, Site

admin.site.register(Customer)
admin.site.register(Site)

