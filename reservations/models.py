from django.conf import settings
from django.db import models
from django.core.exceptions import ValidationError

User = settings.AUTH_USER_MODEL


class Facility(models.Model):

    name = models.CharField(max_length=100)

    description = models.TextField(blank=True)

    opening_time = models.TimeField()

    closing_time = models.TimeField()

    slot_duration_minutes = models.IntegerField(default=60)

    active = models.BooleanField(default=True)

    def __str__(self):
        return self.name


class Reservation(models.Model):

    facility = models.ForeignKey(
        Facility,
        on_delete=models.CASCADE,
        related_name="reservations"
    )

    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="reservations"
    )

    date = models.DateField()

    start_time = models.TimeField()

    end_time = models.TimeField()

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["date", "start_time"]

    def clean(self):

        overlapping = Reservation.objects.filter(
            facility=self.facility,
            date=self.date,
            start_time__lt=self.end_time,
            end_time__gt=self.start_time
        ).exclude(pk=self.pk)

        if overlapping.exists():
            raise ValidationError(
                "Ya existe una reserva en ese horario."
            )

    def save(self, *args, **kwargs):
        self.full_clean()
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.facility} - {self.date} {self.start_time}"