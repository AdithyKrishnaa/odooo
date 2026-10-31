
from decimal import Decimal

from django.core.exceptions import ValidationError
from django.core.validators import MinValueValidator
from django.db import models


class Product(models.Model):

    PRODUCT_TYPES = [
        ('SERVICE', 'Service'),
        ('PHYSICAL', 'Physical Product'),
        ('DIGITAL', 'Digital Product'),
    ]

    name = models.CharField(max_length=255)
    product_type = models.CharField(
        max_length=20,
        choices=PRODUCT_TYPES
    )
    sales_price = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        validators=[MinValueValidator(Decimal('0.00'))]
    )
    cost_price = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        default=Decimal('0.00'),
        validators=[MinValueValidator(Decimal('0.00'))]
    )
    notes = models.TextField(blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name


class ProductVariant(models.Model):

    ADJUSTMENT_TYPES = [
        ('FIXED', 'Fixed Amount'),
        ('PERCENTAGE', 'Percentage'),
    ]

    product = models.ForeignKey(
        Product,
        on_delete=models.CASCADE,
        related_name='variants'
    )
    name = models.CharField(max_length=255)
    price_adjustment = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        default=Decimal('0.00'),
        validators=[MinValueValidator(Decimal('0.00'))]
    )
    adjustment_type = models.CharField(
        max_length=20,
        choices=ADJUSTMENT_TYPES,
        default='FIXED'
    )
    is_active = models.BooleanField(default=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=['product', 'name'],
                name='unique_variant_name_per_product'
            )
        ]

    def clean(self):
        super().clean()

        if (
            self.adjustment_type == 'PERCENTAGE'
            and self.price_adjustment > Decimal('100.00')
        ):
            raise ValidationError({
                'price_adjustment': 'Percentage adjustment cannot exceed 100.'
            })

    def __str__(self):
        return f"{self.product.name} - {self.name}"


class Plan(models.Model):

    BILLING_FREQUENCIES = [
        ('WEEKLY', 'Weekly'),
        ('MONTHLY', 'Monthly'),
        ('QUARTERLY', 'Quarterly'),
        ('YEARLY', 'Yearly'),
    ]

    name = models.CharField(max_length=255, unique=True)
    description = models.TextField(blank=True)
    price = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        default=Decimal('0.00'),
        validators=[MinValueValidator(Decimal('0.00'))]
    )
    billing_frequency = models.CharField(
        max_length=20,
        choices=BILLING_FREQUENCIES
    )
    minimum_quantity = models.PositiveIntegerField(
        default=1,
        validators=[MinValueValidator(1)]
    )
    available_from = models.DateField(blank=True, null=True)
    available_until = models.DateField(blank=True, null=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def clean(self):
        super().clean()

        if (
            self.available_from
            and self.available_until
            and self.available_until < self.available_from
        ):
            raise ValidationError({
                'available_until': 'End date cannot be earlier than start date.'
            })

    def __str__(self):
        return self.name


class PlanProduct(models.Model):

    plan = models.ForeignKey(
        Plan,
        on_delete=models.CASCADE,
        related_name='plan_products'
    )
    product = models.ForeignKey(
        Product,
        on_delete=models.PROTECT,
        related_name='product_plans'
    )
    quantity = models.PositiveIntegerField(
        default=1,
        validators=[MinValueValidator(1)]
    )

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=['plan', 'product'],
                name='unique_product_per_plan'
            )
        ]

    def __str__(self):
        return f"{self.plan.name} - {self.product.name}"
