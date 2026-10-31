from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from billing.models import Invoice
from .models import Payment, AutoPaySetting
from .serializers import (
    PaymentSerializer, RecordPaymentRequestSerializer,
    AutoPaySettingSerializer, AutoPayTransactionSerializer
)
from .services import PaymentService, AutoPayService

class PaymentListView(generics.ListAPIView):
    serializer_class = PaymentSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        if self.request.user.is_staff:
            return Payment.objects.all().order_by('-payment_date')
        return Payment.objects.filter(invoice__customer__user=self.request.user).order_by('-payment_date')

class RecordPaymentView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = RecordPaymentRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data

        try:
            invoice = Invoice.objects.get(id=data['invoice_id'])
            if not request.user.is_staff and invoice.customer.user != request.user:
                return Response({"detail": "Access denied to invoice."}, status=status.HTTP_403_FORBIDDEN)

            payment = PaymentService.process_payment(
                invoice_id=invoice.id,
                amount=data['amount'],
                payment_method=data['payment_method'],
                transaction_reference=data.get('transaction_reference')
            )
            return Response(PaymentSerializer(payment).data, status=status.HTTP_201_CREATED)
        except Invoice.DoesNotExist:
            return Response({"detail": "Invoice not found."}, status=status.HTTP_404_NOT_FOUND)
        except ValueError as e:
            return Response({"detail": str(e)}, status=status.HTTP_400_BAD_REQUEST)

class AutoPaySettingView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        if request.user.is_staff:
            settings = AutoPaySetting.objects.all()
        else:
            settings = AutoPaySetting.objects.filter(subscription__customer__user=request.user)
        return Response(AutoPaySettingSerializer(settings, many=True).data)

    def post(self, request):
        serializer = AutoPaySettingSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        sub = serializer.validated_data['subscription']

        if not request.user.is_staff and sub.customer.user != request.user:
            return Response({"detail": "Access denied to subscription."}, status=status.HTTP_403_FORBIDDEN)

        setting, created = AutoPaySetting.objects.update_or_create(
            subscription=sub,
            defaults={
                'is_enabled': serializer.validated_data['is_enabled'],
                'fail_next_attempt': serializer.validated_data.get('fail_next_attempt', False)
            }
        )
        return Response(AutoPaySettingSerializer(setting).data, status=status.HTTP_200_OK)

class TriggerSimulatedAutoPayView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, invoice_id):
        try:
            invoice = Invoice.objects.get(id=invoice_id)
            if not request.user.is_staff and invoice.customer.user != request.user:
                return Response({"detail": "Access denied."}, status=status.HTTP_403_FORBIDDEN)

            txn = AutoPayService.execute_autopay(invoice)
            return Response(AutoPayTransactionSerializer(txn).data, status=status.HTTP_200_OK)
        except Invoice.DoesNotExist:
            return Response({"detail": "Invoice not found."}, status=status.HTTP_404_NOT_FOUND)
        except ValueError as e:
            return Response({"detail": str(e)}, status=status.HTTP_400_BAD_REQUEST)
