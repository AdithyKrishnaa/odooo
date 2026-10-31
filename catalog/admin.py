
from django.contrib import admin
from .models import Product, ProductVariant, Plan, PlanProduct


class ProductVariantInline(admin.TabularInline):
    model = ProductVariant
    extra = 1


class PlanProductInline(admin.TabularInline):
    model = PlanProduct
    extra = 1


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = (
        'name',
        'product_type',
        'sales_price',
        'cost_price',
        'is_active',
    )
    list_filter = ('product_type', 'is_active')
    search_fields = ('name',)
    inlines = [ProductVariantInline]


@admin.register(Plan)
class PlanAdmin(admin.ModelAdmin):
    list_display = (
        'name',
        'price',
        'billing_frequency',
        'minimum_quantity',
        'is_active',
    )
    list_filter = ('billing_frequency', 'is_active')
    search_fields = ('name',)
    inlines = [PlanProductInline]
