from django.contrib import admin

# Register your models here.
from django.contrib.auth.admin import UserAdmin
from .models import User

# Register your custom User model here.
@admin.register(User)
class CustomUserAdmin(UserAdmin):
    model = User
    list_display = ['email', 'full_name', 'is_staff', 'is_active']
    search_fields = ['email', 'full_name']
    ordering = ['email']