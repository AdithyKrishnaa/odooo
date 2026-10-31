from rest_framework import serializers
from .models import Payment, AutoPaySetting, AutoPayTransaction

class PaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payment
        fields = ['id', 'invoice', 'amount', 'payment_date', 'payment_method', 'status', 'transaction_reference', 'failure_reason']

class RecordPaymentRequestSerializer(serializers.Serializer):
    invoice_id = serializers.IntegerField()
    amount = serializers.DecimalField(max_digits=12, decimal_places=2)
    payment_method = serializers.ChoiceField(choices=Payment.METHOD_CHOICES)
    transaction_reference = serializers.CharField(required=False, allow_null=True)

class AutoPaySettingSerializer(serializers.ModelSerializer):
    class Meta:
        model = AutoPaySetting
        fields = ['id', 'subscription', 'is_enabled', 'fail_next_attempt']

class AutoPayTransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = AutoPayTransaction
        fields = ['id', 'autopay_setting', 'invoice', 'attempt_date', 'status', 'failure_reason', 'idempotency_key']
