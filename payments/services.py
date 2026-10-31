import uuid
from decimal import Decimal
from django.db import transaction
from django.utils import timezone
from billing.models import Invoice
from .models import Payment, AutoPaySetting, AutoPayTransaction

class PaymentService:
    @staticmethod
    @transaction.atomic
    def process_payment(
        invoice_id: int,
        amount: Decimal,
        payment_method: str,
        transaction_reference: str = None
    ) -> Payment:
        invoice = Invoice.objects.select_for_update().get(id=invoice_id)

        if invoice.status in ['paid', 'void']:
            raise ValueError(f"Cannot accept payment against an invoice with status '{invoice.status}'.")

        if amount <= Decimal('0.00'):
            raise ValueError("Payment amount must be greater than zero.")

        if amount > invoice.outstanding_balance:
            raise ValueError(f"Payment amount (${amount}) exceeds outstanding balance (${invoice.outstanding_balance}).")

        if not transaction_reference:
            transaction_reference = f"TXN-{uuid.uuid4().hex[:10].upper()}"

        if Payment.objects.filter(transaction_reference=transaction_reference).exists():
            raise ValueError("Duplicate payment transaction reference.")

        payment = Payment.objects.create(
            invoice=invoice,
            amount=amount,
            payment_method=payment_method,
            status='successful',
            transaction_reference=transaction_reference
        )

        invoice.amount_paid += amount
        invoice.outstanding_balance -= amount

        if invoice.outstanding_balance == Decimal('0.00'):
            invoice.status = 'paid'
        else:
            invoice.status = 'partially_paid'

        invoice.save()
        return payment

class AutoPayService:
    @staticmethod
    @transaction.atomic
    def execute_autopay(invoice: Invoice) -> AutoPayTransaction:
        setting, _ = AutoPaySetting.objects.get_or_create(subscription=invoice.subscription)
        
        if not setting.is_enabled:
            raise ValueError("AutoPay is not enabled for this subscription.")

        idempotency_key = f"AUTOPAY-INV-{invoice.id}-{timezone.now().strftime('%Y%m%d')}"
        existing_attempt = AutoPayTransaction.objects.filter(idempotency_key=idempotency_key).first()
        if existing_attempt:
            return existing_attempt

        if setting.fail_next_attempt:
            setting.fail_next_attempt = False
            setting.save()

            txn = AutoPayTransaction.objects.create(
                autopay_setting=setting,
                invoice=invoice,
                status='failed',
                failure_reason="SIMULATED DECLINE: Card expired or insufficient funds.",
                idempotency_key=idempotency_key
            )
            Payment.objects.create(
                invoice=invoice,
                amount=invoice.outstanding_balance,
                payment_method='autopay',
                status='failed',
                transaction_reference=f"AUTOPAY-FAIL-{uuid.uuid4().hex[:8].upper()}",
                failure_reason=txn.failure_reason
            )
            return txn

        payment = PaymentService.process_payment(
            invoice_id=invoice.id,
            amount=invoice.outstanding_balance,
            payment_method='autopay',
            transaction_reference=f"AUTOPAY-SUCCESS-{uuid.uuid4().hex[:8].upper()}"
        )

        txn = AutoPayTransaction.objects.create(
            autopay_setting=setting,
            invoice=invoice,
            status='success',
            idempotency_key=idempotency_key
        )
        return txn
