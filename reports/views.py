from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from django.db.models import Sum, Count
from django.utils import timezone
from datetime import timedelta
from billing.models import Invoice, Subscription
from payments.models import Payment, AutoPayTransaction
from notifications.models import ReminderLog

class ExecutiveDashboardReportView(APIView):
    permission_classes = [IsAuthenticated, IsAdminUser]

    def get(self, request):
        today = timezone.now().date()
        thirty_days_ago = today - timedelta(days=30)

        total_revenue = Payment.objects.filter(status='successful').aggregate(total=Sum('amount'))['total'] or 0.00
        recent_revenue = Payment.objects.filter(status='successful', payment_date__date__gte=thirty_days_ago).aggregate(total=Sum('amount'))['total'] or 0.00
        outstanding_balance = Invoice.objects.filter(status__in=['issued', 'partially_paid', 'overdue']).aggregate(total=Sum('outstanding_balance'))['total'] or 0.00
        overdue_balance = Invoice.objects.filter(status='overdue').aggregate(total=Sum('outstanding_balance'))['total'] or 0.00

        active_subscriptions = Subscription.objects.filter(status='active').count()
        upcoming_renewals_7d = Subscription.objects.filter(
            status='active',
            next_billing_date__date__range=[today, today + timedelta(days=7)]
        ).count()

        invoice_status_counts = list(Invoice.objects.values('status').annotate(count=Count('id')))
        autopay_stats = AutoPayTransaction.objects.values('status').annotate(count=Count('id'))
        reminder_stats = ReminderLog.objects.values('status').annotate(count=Count('id'))

        return Response({
            "summary_metrics": {
                "total_successful_revenue": float(total_revenue),
                "revenue_last_30_days": float(recent_revenue),
                "total_outstanding_balance": float(outstanding_balance),
                "total_overdue_balance": float(overdue_balance),
                "active_subscriptions": active_subscriptions,
                "upcoming_renewals_next_7_days": upcoming_renewals_7d,
            },
            "invoice_status_breakdown": invoice_status_counts,
            "autopay_performance": list(autopay_stats),
            "reminder_delivery_performance": list(reminder_stats)
        })
