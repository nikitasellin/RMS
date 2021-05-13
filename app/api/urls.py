from django.urls import path, include
from rest_framework.routers import DefaultRouter

from api.views import jwt_auth, index, accounts, tasks, customers, search, reports

app_name = 'api'

accounts_router = DefaultRouter()
accounts_router.register('accounts-read',
                         accounts.EmployeeReadViewSet,
                         basename='a_r',
                         )
accounts_router.register('accounts-write',
                         accounts.EmployeeWriteViewSet,
                         basename='a_w',
                         )
accounts_router.register('groups', accounts.EmployeeGroupViewSet)

tasks_router = DefaultRouter()
tasks_router.register('directions', tasks.DirectionViewSet)
tasks_router.register('execution-variants', tasks.ExecutionVariantViewSet)
tasks_router.register('work-tasks',
                      tasks.WorkTaskViewSet,
                      basename='w_t',
                      )
tasks_router.register('assigned-tasks',
                      tasks.AssignedTaskViewSet,
                      basename='a_t',
                      )

reports_router = DefaultRouter()
reports_router.register('reports-read',
                        reports.ReportReadViewSet,
                        basename='r_r',
                        )
reports_router.register('reports-write',
                        reports.ReportWriteViewSet,
                        basename='r_w',
                        )


customers_router = DefaultRouter()
customers_router.register('customers', customers.CustomerViewSet)
customers_router.register('sites', customers.SiteViewSet)


urlpatterns = [
    path('token/obtain/',
         jwt_auth.CustomTokenObtainPairView.as_view(),
         name='token_obtain_pair',
         ),
    path('token/refresh/',
         jwt_auth.CustomTokenRefreshView.as_view(),
         name='token_refresh',
         ),
    path('search/city/',
         search.CityView.as_view(),
         name='search_city'),
    path('employee/',
         include((accounts_router.urls, app_name), namespace='employee'),
         ),
    path('tasks/',
         include((tasks_router.urls, app_name), namespace='work_tasks'),
         ),
    path('tasks/statuses/',
         tasks.StatusView.as_view(),
         name='task_statuses'
         ),
    path('customers/',
         include((customers_router.urls, app_name), namespace='customers')),
    path('reports/',
         include((reports_router.urls, app_name), namespace='reports'),
         ),
    path('', index.RootView.as_view()),
]
