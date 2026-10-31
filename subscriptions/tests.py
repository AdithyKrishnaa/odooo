
from datetime import date
from decimal import Decimal

from django.core.exceptions import ValidationError
from django.test import SimpleTestCase

from catalog.models import Plan
from .models import Subscription


class SubscriptionModelTests(SimpleTestCase):

    def setUp(self):
        self.plan = Plan(
            name='Monthly Hosting',
            description='Monthly hosting subscription',
            price=Decimal('100.00'),
            billing_frequency='MONTHLY',
            minimum_quantity=1,
        )

    def test_subscription_starts_as_draft(self):
        subscription = Subscription(
            subscription_number='SUB-001',
            plan=self.plan,
            start_date=date(2026, 1, 1),
            unit_price=Decimal('100.00'),
        )

        self.assertEqual(subscription.status, 'DRAFT')

    def test_end_date_cannot_be_before_start_date(self):
        subscription = Subscription(
            subscription_number='SUB-002',
            plan=self.plan,
            start_date=date(2026, 2, 1),
            end_date=date(2026, 1, 1),
        )

        with self.assertRaises(ValidationError):
            subscription.clean()

    def test_next_billing_date_cannot_be_before_start_date(self):
        subscription = Subscription(
            subscription_number='SUB-003',
            plan=self.plan,
            start_date=date(2026, 2, 1),
            next_billing_date=date(2026, 1, 1),
        )

        with self.assertRaises(ValidationError):
            subscription.clean()

    def test_subscription_quantity_defaults_to_one(self):
        subscription = Subscription(
            subscription_number='SUB-004',
            plan=self.plan,
            start_date=date(2026, 1, 1),
        )

        self.assertEqual(subscription.quantity, 1)
