
from decimal import Decimal

from django.core.exceptions import ValidationError
from django.test import SimpleTestCase

from catalog.models import Product
from .models import Quotation, QuotationItem


class QuotationModelTests(SimpleTestCase):

    def test_quotation_starts_as_draft(self):
        quotation = Quotation(
            quotation_number="QUO-001"
        )

        self.assertEqual(quotation.status, "DRAFT")

    def test_negative_discount_percentage_is_rejected(self):
        quotation = Quotation(
            quotation_number="QUO-002",
            discount_percentage=Decimal("-5.00")
        )

        with self.assertRaises(ValidationError):
            quotation.clean()

    def test_discount_percentage_above_100_is_rejected(self):
        quotation = Quotation(
            quotation_number="QUO-003",
            discount_percentage=Decimal("110.00")
        )

        with self.assertRaises(ValidationError):
            quotation.clean()

    def test_negative_discount_amount_is_rejected(self):
        quotation = Quotation(
            quotation_number="QUO-004",
            discount_amount=Decimal("-10.00")
        )

        with self.assertRaises(ValidationError):
            quotation.clean()


class QuotationItemTests(SimpleTestCase):

    def setUp(self):
        self.product = Product(
            name="Hosting",
            product_type="SERVICE",
            sales_price=Decimal("100.00"),
            cost_price=Decimal("40.00")
        )

        self.quotation = Quotation(
            quotation_number="QUO-005"
        )

    def test_item_total_without_discount(self):
        item = QuotationItem(
            quotation=self.quotation,
            product=self.product,
            quantity=2,
            unit_price=Decimal("100.00"),
            discount_percentage=Decimal("0.00")
        )

        self.assertEqual(
            item.get_total(),
            Decimal("200.00")
        )

    def test_item_total_with_discount(self):
        item = QuotationItem(
            quotation=self.quotation,
            product=self.product,
            quantity=2,
            unit_price=Decimal("100.00"),
            discount_percentage=Decimal("10.00")
        )

        self.assertEqual(
            item.get_total(),
            Decimal("180.00")
        )

    def test_item_rejects_discount_above_100(self):
        item = QuotationItem(
            quotation=self.quotation,
            product=self.product,
            quantity=1,
            unit_price=Decimal("100.00"),
            discount_percentage=Decimal("150.00")
        )

        with self.assertRaises(ValidationError):
            item.clean()

    def test_item_rejects_negative_unit_price(self):
        item = QuotationItem(
            quotation=self.quotation,
            product=self.product,
            quantity=1,
            unit_price=Decimal("-10.00"),
            discount_percentage=Decimal("0.00")
        )

        with self.assertRaises(ValidationError):
            item.full_clean()
