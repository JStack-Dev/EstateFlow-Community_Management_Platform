from django.conf import settings
from django.db import models

User = settings.AUTH_USER_MODEL


class Work(models.Model):

    class Status(models.TextChoices):
        PENDING = "PENDING", "Pendiente"
        APPROVED = "APPROVED", "Aprobada"
        REJECTED = "REJECTED", "Rechazada"
        COMPLETED = "COMPLETED", "Finalizada"

    resident = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="works"
    )

    title = models.CharField(max_length=200)

    description = models.TextField()

    start_date = models.DateField()

    end_date = models.DateField()

    company = models.CharField(
        max_length=200,
        blank=True
    )

    workers_count = models.IntegerField(
        default=1
    )

    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.PENDING
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    def __str__(self):
        return f"{self.title} - {self.resident}"