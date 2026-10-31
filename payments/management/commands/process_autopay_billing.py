from datetime import timedelta
from django.core.management.base import BaseCommand
from django.utils import timezone
from billing.models import Subscription, Invoice
from billing.services import BillingService
from payments.models import AutoPaySetting
from payments.services import AutoPayService

class Command(BaseCommand):
    help = "Process recurring invoices and execute AutoPay charges for due subscriptions."

    def handle(self, *args, **options):
        today = timezone.now().date()
        due_subscriptions = Subscription.objects.filter(
            status='active',
            next_billing_date__date__lte=today
        )

        invoices_created = 0
        autopay_processed = 0

        for sub in due_subscriptions:
            period_start = sub.next_billing_date.date()
            period_end = period_start + timedelta(days=sub.plan.billing_interval_days)
            due_date = period_start + timedelta(days=7)

            # 1. Ensure invoice exists for this period
            invoice = Invoice.objects.filter(
                subscription=sub,
                period_start=period_start,
                period_end=period_end
            ).first()

            if not invoice:
                try:
                    invoice = BillingService.create_invoice(
                        subscription=sub,
                        period_start=period_start,
                        period_end=period_end,
                        due_date=due_date
                    )
                    invoices_created += 1
                except ValueError:
                    continue

            # 2. Check if AutoPay is enabled and invoice has outstanding balance
            setting = AutoPaySetting.objects.filter(subscription=sub, is_enabled=True).first()
            if setting and invoice.outstanding_balance > 0:
                try:
                    AutoPayService.execute_autopay(invoice)
                    autopay_processed += 1
                except Exception as e:
                    self.stderr.write(f"AutoPay error for invoice {invoice.invoice_number}: {e}")

        self.stdout.write(
            self.style.SUCCESS(
                f"AutoPay processing complete. Invoices created: {invoices_created}, AutoPay attempts: {autopay_processed}"
            )
        )
