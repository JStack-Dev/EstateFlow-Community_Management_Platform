from django.contrib import admin
from .models import Package


@admin.register(Package)
class PackageAdmin(admin.ModelAdmin):

    list_display = (
        "carrier",
        "resident",
        "tracking_number",
        "received_at",
        "delivered",
    )

    list_filter = (
        "carrier",
        "delivered",
    )