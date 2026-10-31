from django.urls import path
from .views import ExecutiveDashboardReportView

urlpatterns = [
    path('dashboard/', ExecutiveDashboardReportView.as_view(), name='reports-dashboard'),
]
