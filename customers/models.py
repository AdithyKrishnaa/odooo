from django.db import models
from django.conf import settings

class Customer(models.Model):
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL, 
        on_delete=models.CASCADE, 
        related_name='customer_profile',
        limit_choices_to={'role': 'CUSTOMER'}
    )
    company_name = models.CharField(max_length=255, blank=True, null=True)
    billing_address = models.TextField(blank=True, null=True)
    tax_id = models.CharField(max_length=50, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Customer: {self.user.full_name} ({self.user.email})"