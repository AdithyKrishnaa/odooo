
from decimal import Decimal

from django.core.exceptions import ValidationError
from django.core.validators import MinValueValidator
from django.db import models

from catalog.models import Product


class Quotation(models.Model):

    STATUS_CHOICES = [
        ('DRAFT', 'Draft'),
        ('SENT', 'Sent'),
        ('ACCEPTED', 'Accepted'),
        ('REJECTED', 'Rejected'),
        ('EXPIRED', 'Expired'),
    ]

    quotation_number = models.CharField(
        max_length=50,
        unique=True
    )

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='DRAFT'
    )

    discount_percentage = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        default=Decimal('0.00'),
        validators=[
            MinValueValidator(Decimal('0.00'))
        ]
    )

    discount_amount = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        default=Decimal('0.00'),
        validators=[
            MinValueValidator(Decimal('0.00'))
        ]
    )

    valid_until = models.DateField(
        blank=True,
        null=True
    )

    notes = models.TextField(blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def clean(self):
        super().clean()

        errors = {}

        if self.discount_percentage < 0:
            errors['discount_percentage'] = (
                'Discount percentage cannot be negative.'
            )

        if self.discount_percentage > 100:
            errors['discount_percentage'] = (
                'Discount percentage cannot be greater than 100.'
            )

        if self.discount_amount < 0:
            errors['discount_amount'] = (
                'Discount amount cannot be negative.'
            )

        if errors:
            raise ValidationError(errors)

    def get_subtotal(self):
        return sum(
            (item.get_total() for item in self.items.all()),
            Decimal('0.00')
        )

    def get_discount(self):
        subtotal = self.get_subtotal()

        percentage_discount = (
            subtotal * self.discount_percentage / Decimal('100')
        )

        return percentage_discount + self.discount_amount

    def get_total(self):
        total = self.get_subtotal() - self.get_discount()

        return max(total, Decimal('0.00'))

    def __str__(self):
        return self.quotation_number


class QuotationItem(models.Model):

    quotation = models.ForeignKey(
        Quotation,
        on_delete=models.CASCADE,
        related_name='items'
    )

    product = models.ForeignKey(
        Product,
        on_delete=models.PROTECT,
        related_name='quotation_items'
    )

    quantity = models.PositiveIntegerField(
        validators=[
            MinValueValidator(1)
        ]
    )

    unit_price = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        validators=[
            MinValueValidator(Decimal('0.00'))
        ]
    )

    discount_percentage = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        default=Decimal('0.00'),
        validators=[
            MinValueValidator(Decimal('0.00'))
        ]
    )

    def clean(self):
        super().clean()

        errors = {}

        if self.discount_percentage < 0:
            errors['discount_percentage'] = (
                'Discount percentage cannot be negative.'
            )

        if self.discount_percentage > 100:
            errors['discount_percentage'] = (
                'Discount percentage cannot be greater than 100.'
            )

        if errors:
            raise ValidationError(errors)

    def get_total(self):
        subtotal = self.quantity * self.unit_price

        discount = (
            subtotal * self.discount_percentage / Decimal('100')
        )

        return subtotal - discount

    def __str__(self):
        return (
            f"{self.quotation.quotation_number} - "
            f"{self.product.name}"
        )
