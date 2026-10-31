from datetime import timedelta
from django.core.management.base import BaseCommand
from django.utils import timezone
from django.core.mail import send_mail
from billing.models import Subscription
from notifications.models import ReminderLog

class Command(BaseCommand):
    help = "Scan active subscriptions and send automated renewal notifications."

    def handle(self, *args, **options):
        today = timezone.now().date()
        targets = [
            (7, '7_days_before', "Upcoming Renewal: 7 Days Remaining"),
            (3, '3_days_before', "Upcoming Renewal: 3 Days Remaining"),
            (0, 'day_of', "Your Subscription Renews Today"),
        ]

        sent_count = 0

        for days, reminder_type, subject in targets:
            target_date = today + timedelta(days=days)
            subscriptions = Subscription.objects.filter(
                status='active',
                next_billing_date__date=target_date
            )

            for sub in subscriptions:
                already_sent = ReminderLog.objects.filter(
                    customer=sub.customer,
                    subscription=sub,
                    reminder_type=reminder_type,
                    scheduled_date=today
                ).exists()

                if already_sent:
                    continue

                message = (
                    f"Hello {sub.customer.company_name or sub.customer.user.username},\n\n"
                    f"This is a reminder that your subscription to '{sub.plan.name}' "
                    f"is scheduled for renewal on {sub.next_billing_date.date()} for ${sub.plan.price}.\n\n"
                    f"Thank you for your business!"
                )

                try:
                    send_mail(
                        subject=subject,
                        message=message,
                        from_email='billing@sms-system.local',
                        recipient_list=[sub.customer.billing_email],
                        fail_silently=False,
                    )
                    ReminderLog.objects.create(
                        customer=sub.customer,
                        subscription=sub,
                        reminder_type=reminder_type,
                        scheduled_date=today,
                        status='sent'
                    )
                    sent_count += 1
                except Exception as e:
                    ReminderLog.objects.create(
                        customer=sub.customer,
                        subscription=sub,
                        reminder_type=reminder_type,
                        scheduled_date=today,
                        status='failed',
                        error_details=str(e)
                    )

        self.stdout.write(self.style.SUCCESS(f"Successfully processed renewal reminders. ({sent_count} sent)"))
