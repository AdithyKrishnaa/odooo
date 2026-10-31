from django.contrib import admin
from .models import Quotation, QuotationItem


class QuotationItemInline(admin.TabularInline):
    model = QuotationItem
    extra = 1


@admin.register(Quotation)
class QuotationAdmin(admin.ModelAdmin):

    list_display = (
        'quotation_number',
        'status',
        'discount_percentage',
        'discount_amount',
        'valid_until',
        'created_at',
    )

    list_filter = ('status', 'created_at')
    search_fields = ('quotation_number',)
    inlines = [QuotationItemInline]


@admin.register(QuotationItem)
class QuotationItemAdmin(admin.ModelAdmin):

    list_display = (
        'quotation',
        'product',
        'quantity',
        'unit_price',
        'discount_percentage',
    )

    search_fields = (
        'quotation__quotation_number',
        'product__name',
    )