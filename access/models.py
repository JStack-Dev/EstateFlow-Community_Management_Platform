from django.conf import settings
from django.db import models

User = settings.AUTH_USER_MODEL


class VisitorAccess(models.Model):

    resident = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="visitor_accesses"
    )

    visitor_name = models.CharField(max_length=200)

    visitor_dni = models.CharField(
        max_length=20,
        blank=True
    )

    visit_date = models.DateField()

    entry_time = models.TimeField(
        null=True,
        blank=True
    )

    exit_time = models.TimeField(
        null=True,
        blank=True
    )

    authorized = models.BooleanField(
        default=True
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    def __str__(self):
        return f"{self.visitor_name} - {self.visit_date}"