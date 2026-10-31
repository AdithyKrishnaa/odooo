from django.http import HttpResponse
from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Invoice, Subscription
from .serializers import InvoiceSerializer, GenerateInvoiceRequestSerializer
from .services import BillingService
from .pdf_service import generate_invoice_pdf
from .permissions import IsOwnerOrAdmin

class InvoiceListView(generics.ListAPIView):
    serializer_class = InvoiceSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        if self.request.user.is_staff:
            return Invoice.objects.all().order_by('-created_at')
        return Invoice.objects.filter(customer__user=self.request.user).order_by('-created_at')

class InvoiceDetailView(generics.RetrieveAPIView):
    serializer_class = InvoiceSerializer
    permission_classes = [IsAuthenticated, IsOwnerOrAdmin]
    queryset = Invoice.objects.all()

class GenerateInvoiceView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = GenerateInvoiceRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data

        try:
            subscription = Subscription.objects.get(id=data['subscription_id'])
            if not request.user.is_staff and subscription.customer.user != request.user:
                return Response({"detail": "Access denied to subscription."}, status=status.HTTP_403_FORBIDDEN)

            invoice = BillingService.create_invoice(
                subscription=subscription,
                period_start=data['period_start'],
                period_end=data['period_end'],
                due_date=data['due_date'],
                discount_code=data.get('discount_code'),
                tax_rule_id=data.get('tax_rule_id')
            )
            return Response(InvoiceSerializer(invoice).data, status=status.HTTP_201_CREATED)
        except Subscription.DoesNotExist:
            return Response({"detail": "Subscription not found."}, status=status.HTTP_404_NOT_FOUND)
        except ValueError as e:
            return Response({"detail": str(e)}, status=status.HTTP_400_BAD_REQUEST)

class DownloadInvoicePDFView(APIView):
    permission_classes = [IsAuthenticated, IsOwnerOrAdmin]

    def get(self, request, pk):
        try:
            invoice = Invoice.objects.get(pk=pk)
            self.check_object_permissions(request, invoice)
            pdf_bytes = generate_invoice_pdf(invoice)
            response = HttpResponse(pdf_bytes, content_type='application/pdf')
            response['Content-Disposition'] = f'attachment; filename="{invoice.invoice_number}.pdf"'
            return response
        except Invoice.DoesNotExist:
            return Response({"detail": "Invoice not found."}, status=status.HTTP_404_NOT_FOUND)
