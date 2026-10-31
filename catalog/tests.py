
from datetime import date
from decimal import Decimal

from django.core.exceptions import ValidationError
from django.test import SimpleTestCase

from .models import Plan, Product, ProductVariant, PlanProduct


class ProductModelTests(SimpleTestCase):

    def test_product_accepts_valid_prices(self):
        product = Product(
            name="Website Hosting",
            product_type="SERVICE",
            sales_price=Decimal("100.00"),
            cost_price=Decimal("40.00"),
        )

        product.full_clean(
            validate_unique=False,
            validate_constraints=False
        )

    def test_product_rejects_negative_sales_price(self):
        product = Product(
            name="Invalid Product",
            product_type="SERVICE",
            sales_price=Decimal("-10.00"),
            cost_price=Decimal("0.00"),
        )

        with self.assertRaises(ValidationError):
            product.full_clean(
                validate_unique=False,
                validate_constraints=False
            )


class ProductVariantModelTests(SimpleTestCase):

    def test_percentage_adjustment_cannot_exceed_100(self):
        product = Product(
            name="Hosting",
            product_type="SERVICE",
            sales_price=Decimal("100.00"),
        )

        variant = ProductVariant(
            product=product,
            name="Premium",
            adjustment_type="PERCENTAGE",
            price_adjustment=Decimal("150.00"),
        )

        with self.assertRaises(ValidationError):
            variant.clean()


class PlanModelTests(SimpleTestCase):

    def test_plan_rejects_end_date_before_start_date(self):
        plan = Plan(
            name="Invalid Plan",
            price=Decimal("100.00"),
            billing_frequency="MONTHLY",
            available_from=date(2026, 12, 1),
            available_until=date(2026, 11, 1),
        )

        with self.assertRaises(ValidationError):
            plan.clean()

    def test_plan_accepts_valid_availability_dates(self):
        plan = Plan(
            name="Valid Plan",
            price=Decimal("100.00"),
            billing_frequency="MONTHLY",
            available_from=date(2026, 1, 1),
            available_until=date(2026, 12, 31),
        )

        plan.clean()


class QuantityValidationTests(SimpleTestCase):

    def test_plan_rejects_zero_minimum_quantity(self):
        plan = Plan(
            name="Zero Quantity Plan",
            price=Decimal("100.00"),
            billing_frequency="MONTHLY",
            minimum_quantity=0,
        )

        with self.assertRaises(ValidationError):
            plan.full_clean(
                validate_unique=False,
                validate_constraints=False
            )

    def test_plan_product_rejects_zero_quantity(self):
        product = Product(
            name="Hosting",
            product_type="SERVICE",
            sales_price=Decimal("100.00"),
        )

        plan = Plan(
            name="Hosting Plan",
            price=Decimal("100.00"),
            billing_frequency="MONTHLY",
        )

        plan_product = PlanProduct(
            plan=plan,
            product=product,
            quantity=0,
        )

        with self.assertRaises(ValidationError):
            plan_product.full_clean(
                validate_unique=False,
                validate_constraints=False
            )
