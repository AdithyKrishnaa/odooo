from django.urls import path
from .views import InvoiceListView, InvoiceDetailView, GenerateInvoiceView, DownloadInvoicePDFView

urlpatterns = [
    path('invoices/', InvoiceListView.as_view(), name='invoice-list'),
    path('invoices/<int:pk>/', InvoiceDetailView.as_view(), name='invoice-detail'),
    path('invoices/<int:pk>/pdf/', DownloadInvoicePDFView.as_view(), name='invoice-pdf'),
    path('generate/', GenerateInvoiceView.as_view(), name='invoice-generate'),
]
