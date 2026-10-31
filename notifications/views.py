from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from .models import ReminderLog
from .serializers import ReminderLogSerializer

class ReminderLogListView(generics.ListAPIView):
    serializer_class = ReminderLogSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        if self.request.user.is_staff:
            return ReminderLog.objects.all().order_by('-attempt_timestamp')
        return ReminderLog.objects.filter(customer__user=self.request.user).order_by('-attempt_timestamp')
