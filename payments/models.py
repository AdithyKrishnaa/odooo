from decimal import Decimal
from django.db import models
from django.core.validators import MinValueValidator
from billing.models import Invoice, Subscription

class Payment(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('successful', 'Successful'),
        ('failed', 'Failed'),
        ('refunded', 'Refunded'),
    ]
    METHOD_CHOICES = [
        ('credit_card', 'Credit Card (Simulated)'),
        ('bank_transfer', 'Bank Transfer'),
        ('autopay', 'AutoPay (Simulated)'),
    ]

    invoice = models.ForeignKey(Invoice, on_delete=models.PROTECT, related_name='payments')
    amount = models.DecimalField(max_digits=12, decimal_places=2, validators=[MinValueValidator(Decimal('0.01'))])
    payment_date = models.DateTimeField(auto_now_add=True)
    payment_method = models.CharField(max_length=50, choices=METHOD_CHOICES)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending', db_index=True)
    transaction_reference = models.CharField(max_length=100, unique=True, db_index=True)
    failure_reason = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"Payment {self.transaction_reference} - {self.amount} ({self.status})"

class AutoPaySetting(models.Model):
    subscription = models.OneToOneField(Subscription, on_delete=models.CASCADE, related_name='autopay_setting')
    is_enabled = models.BooleanField(default=False)
    fail_next_attempt = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"AutoPay Sub #{self.subscription_id}: {'Enabled' if self.is_enabled else 'Disabled'}"

class AutoPayTransaction(models.Model):
    STATUS_CHOICES = [
        ('success', 'Success'),
        ('failed', 'Failed'),
    ]

    autopay_setting = models.ForeignKey(AutoPaySetting, on_delete=models.CASCADE, related_name='transactions')
    invoice = models.ForeignKey(Invoice, on_delete=models.CASCADE, related_name='autopay_attempts')
    attempt_date = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES)
    failure_reason = models.CharField(max_length=255, blank=True, null=True)
    idempotency_key = models.CharField(max_length=128, unique=True)

    def __str__(self):
        return f"AutoPay Attempt for Invoice {self.invoice.invoice_number} - {self.status}"
