from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User


@admin.register(User)
class CustomUserAdmin(UserAdmin):

    fieldsets = UserAdmin.fieldsets + (
        (
            "Información residencial",
            {
                "fields": ("vivienda", "tipo_usuario", "activo"),
            },
        ),
    )

    list_display = (
        "username",
        "email",
        "tipo_usuario",
        "vivienda",
        "activo",
        "is_staff",
    )

    list_filter = (
        "tipo_usuario",
        "activo",
        "is_staff",
    )
