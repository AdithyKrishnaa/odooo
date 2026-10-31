from django.db import models
from billing.models import Customer, Subscription, Invoice

class ReminderLog(models.Model):
    REMINDER_TYPES = [
        ('7_days_before', '7 Days Before Renewal'),
        ('3_days_before', '3 Days Before Renewal'),
        ('day_of', 'Day of Renewal'),
        ('overdue', 'Overdue Notice'),
    ]
    STATUS_CHOICES = [
        ('sent', 'Sent (Console Backend)'),
        ('failed', 'Failed'),
    ]

    customer = models.ForeignKey(Customer, on_delete=models.CASCADE, related_name='reminder_logs')
    subscription = models.ForeignKey(Subscription, on_delete=models.CASCADE, null=True, blank=True)
    invoice = models.ForeignKey(Invoice, on_delete=models.CASCADE, null=True, blank=True)
    reminder_type = models.CharField(max_length=30, choices=REMINDER_TYPES)
    scheduled_date = models.DateField()
    attempt_timestamp = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES)
    error_details = models.TextField(blank=True, null=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=['customer', 'subscription', 'reminder_type', 'scheduled_date'],
                name='unique_subscription_reminder_per_day'
            )
        ]

    def __str__(self):
        return f"{self.reminder_type} for {self.customer} on {self.scheduled_date} ({self.status})"
