
from decimal import Decimal

from django.core.exceptions import ValidationError
from django.core.validators import MinValueValidator
from django.db import models

from catalog.models import Plan


class Subscription(models.Model):

    STATUS_CHOICES = [
        ('DRAFT', 'Draft'),
        ('ACTIVE', 'Active'),
        ('PAUSED', 'Paused'),
        ('CANCELLED', 'Cancelled'),
        ('EXPIRED', 'Expired'),
    ]

    subscription_number = models.CharField(
        max_length=50,
        unique=True
    )

    plan = models.ForeignKey(
        Plan,
        on_delete=models.PROTECT,
        related_name='subscriptions'
    )

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='DRAFT'
    )

    start_date = models.DateField()

    end_date = models.DateField(
        blank=True,
        null=True
    )

    next_billing_date = models.DateField(
        blank=True,
        null=True
    )

    quantity = models.PositiveIntegerField(
        default=1,
        validators=[
            MinValueValidator(1)
        ]
    )

    unit_price = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        default=Decimal('0.00'),
        validators=[
            MinValueValidator(Decimal('0.00'))
        ]
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def clean(self):
        super().clean()

        errors = {}

        if (
            self.end_date
            and self.end_date < self.start_date
        ):
            errors['end_date'] = (
                'End date cannot be earlier than start date.'
            )

        if (
            self.next_billing_date
            and self.next_billing_date < self.start_date
        ):
            errors['next_billing_date'] = (
                'Next billing date cannot be earlier than start date.'
            )

        if errors:
            raise ValidationError(errors)

    def __str__(self):
        return self.subscription_number
