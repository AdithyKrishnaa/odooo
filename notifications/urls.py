from django.urls import path
from .views import ReminderLogListView

urlpatterns = [
    path('reminders/', ReminderLogListView.as_view(), name='reminder-list'),
]
