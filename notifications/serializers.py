from rest_framework import serializers
from .models import ReminderLog

class ReminderLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = ReminderLog
        fields = ['id', 'customer', 'subscription', 'invoice', 'reminder_type', 'scheduled_date', 'attempt_timestamp', 'status', 'error_details']
