from django.urls import reverse_lazy
from rest_framework.response import Response
from rest_framework.views import APIView


class RootView(APIView):
    def get(self, request):
        links = {
            'Accounts': request.build_absolute_uri(
                reverse_lazy('api:employee:api-root')),
            'Tasks': request.build_absolute_uri(
                reverse_lazy('api:work_tasks:api-root')),
            'Customers': request.build_absolute_uri(
                reverse_lazy('api:customers:api-root')),
            'Reports': request.build_absolute_uri(
                reverse_lazy('api:reports:api-root')),
            'Obtain token': request.build_absolute_uri(
                reverse_lazy('api:token_obtain_pair')),
            'Refresh token': request.build_absolute_uri(
                reverse_lazy('api:token_refresh')),
        }
        return Response(links)
