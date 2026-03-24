from django.conf import settings
from django.db import models

User = settings.AUTH_USER_MODEL


class Package(models.Model):

    class Carrier(models.TextChoices):
        AMAZON = "AMAZON", "Amazon"
        CORREOS = "CORREOS", "Correos"
        SEUR = "SEUR", "SEUR"
        DHL = "DHL", "DHL"
        OTHER = "OTHER", "Otro"

    resident = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="packages"
    )

    carrier = models.CharField(
        max_length=20,
        choices=Carrier.choices
    )

    tracking_number = models.CharField(
        max_length=100,
        blank=True
    )

    description = models.CharField(
        max_length=200,
        blank=True
    )

    received_at = models.DateTimeField(
        auto_now_add=True
    )

    delivered = models.BooleanField(
        default=False
    )

    delivered_at = models.DateTimeField(
        null=True,
        blank=True
    )

    def __str__(self):
        return f"{self.carrier} - {self.resident}"