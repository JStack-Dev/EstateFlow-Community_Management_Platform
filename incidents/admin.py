from django.contrib import admin
from .models import Incident


@admin.register(Incident)
class IncidentAdmin(admin.ModelAdmin):
    list_display = (
        "title",
        "category",
        "location",
        "urgency",
        "status",
        "created_at",
        "assigned_to",
    )

    list_filter = (
        "status",
        "category",
        "urgency",
    )

    search_fields = (
        "title",
        "description",
        "location",
    )

    ordering = ("-created_at",)
