import uuid
from decimal import Decimal
from django.db import transaction
from django.utils import timezone
from .models import Invoice, InvoiceLine, DiscountRule, TaxRule, Subscription

def generate_invoice_number() -> str:
    today_str = timezone.now().strftime('%Y%m%d')
    unique_suffix = uuid.uuid4().hex[:6].upper()
    return f"INV-{today_str}-{unique_suffix}"

class BillingService:
    @staticmethod
    @transaction.atomic
    def create_invoice(
        subscription: Subscription,
        period_start,
        period_end,
        due_date,
        discount_code: str = None,
        tax_rule_id: int = None
    ) -> Invoice:
        if Invoice.objects.filter(subscription=subscription, period_start=period_start, period_end=period_end).exists():
            raise ValueError("An invoice already exists for this subscription and billing period.")

        plan = subscription.plan

        invoice = Invoice.objects.create(
            invoice_number=generate_invoice_number(),
            customer=subscription.customer,
            subscription=subscription,
            status='draft',
            issue_date=timezone.now().date(),
            due_date=due_date,
            period_start=period_start,
            period_end=period_end,
        )

        InvoiceLine.objects.create(
            invoice=invoice,
            description=f"Subscription to {plan.name} ({period_start} to {period_end})",
            quantity=1,
            unit_price=plan.price
        )

        subtotal = plan.price
        discount_amount = Decimal('0.00')

        if discount_code:
            try:
                discount_rule = DiscountRule.objects.get(code=discount_code, is_active=True)
                discount_amount = discount_rule.calculate_discount(subtotal)
            except DiscountRule.DoesNotExist:
                pass

        taxable_amount = max(Decimal('0.00'), subtotal - discount_amount)
        tax_rate = Decimal('0.00')
        tax_amount = Decimal('0.00')

        if tax_rule_id:
            try:
                tax_rule = TaxRule.objects.get(id=tax_rule_id, is_active=True)
                tax_rate = tax_rule.rate_percent
                tax_amount = (taxable_amount * tax_rate) / Decimal('100.00')
            except TaxRule.DoesNotExist:
                pass

        total_amount = taxable_amount + tax_amount

        invoice.subtotal = subtotal
        invoice.discount_amount = discount_amount
        invoice.tax_rate_snapshot = tax_rate
        invoice.tax_amount = tax_amount
        invoice.total_amount = total_amount
        invoice.outstanding_balance = total_amount
        invoice.status = 'issued'
        invoice.save()

        return invoice
