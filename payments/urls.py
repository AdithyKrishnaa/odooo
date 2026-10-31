from django.urls import path
from .views import PaymentListView, RecordPaymentView, AutoPaySettingView, TriggerSimulatedAutoPayView

urlpatterns = [
    path('', PaymentListView.as_view(), name='payment-list'),
    path('record/', RecordPaymentView.as_view(), name='payment-record'),
    path('autopay/settings/', AutoPaySettingView.as_view(), name='autopay-settings'),
    path('autopay/trigger/<int:invoice_id>/', TriggerSimulatedAutoPayView.as_view(), name='autopay-trigger'),
]
