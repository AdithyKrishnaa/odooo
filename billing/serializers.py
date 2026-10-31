from rest_framework import serializers
from .models import Invoice, InvoiceLine

class InvoiceLineSerializer(serializers.ModelSerializer):
    class Meta:
        model = InvoiceLine
        fields = ['id', 'description', 'quantity', 'unit_price', 'subtotal']

class InvoiceSerializer(serializers.ModelSerializer):
    lines = InvoiceLineSerializer(many=True, read_only=True)
    customer_name = serializers.CharField(source='customer.__str__', read_only=True)

    class Meta:
        model = Invoice
        fields = [
            'id', 'invoice_number', 'customer', 'customer_name', 'subscription',
            'status', 'issue_date', 'due_date', 'period_start', 'period_end',
            'subtotal', 'discount_amount', 'tax_rate_snapshot', 'tax_amount',
            'total_amount', 'amount_paid', 'outstanding_balance', 'lines'
        ]

class GenerateInvoiceRequestSerializer(serializers.Serializer):
    subscription_id = serializers.IntegerField()
    period_start = serializers.DateField()
    period_end = serializers.DateField()
    due_date = serializers.DateField()
    discount_code = serializers.CharField(required=False, allow_null=True)
    tax_rule_id = serializers.IntegerField(required=False, allow_null=True)
