from django.contrib import admin
from .models import Facility, Reservation


@admin.register(Facility)
class FacilityAdmin(admin.ModelAdmin):

    list_display = (
        "name",
        "opening_time",
        "closing_time",
        "slot_duration_minutes",
        "active",
    )

    list_filter = ("active",)


@admin.register(Reservation)
class ReservationAdmin(admin.ModelAdmin):

    list_display = (
        "facility",
        "user",
        "date",
        "start_time",
        "end_time",
    )

    list_filter = ("facility", "date")