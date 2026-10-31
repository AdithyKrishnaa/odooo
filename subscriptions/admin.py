
from django.contrib import admin
from .models import Subscription


@admin.register(Subscription)
class SubscriptionAdmin(admin.ModelAdmin):

    list_display = (
        'subscription_number',
        'plan',
        'status',
        'start_date',
        'end_date',
        'next_billing_date',
        'quantity',
        'unit_price',
    )

    list_filter = (
        'status',
        'start_date',
        'next_billing_date',
    )

    search_fields = (
        'subscription_number',
        'plan__name',
    )

    readonly_fields = (
        'created_at',
        'updated_at',
    )
