from django.conf import settings
from django.db import models
from django.utils import timezone
from django.core.exceptions import ValidationError

User = settings.AUTH_USER_MODEL


class Incident(models.Model):

    class Status(models.TextChoices):
        OPEN = "OPEN", "Abierta"
        IN_PROGRESS = "IN_PROGRESS", "En proceso"
        RESOLVED = "RESOLVED", "Resuelta"

    class Category(models.TextChoices):
        ELECTRICITY = "ELECTRICITY", "Electricidad"
        PLUMBING = "PLUMBING", "Fontanería"
        SECURITY = "SECURITY", "Seguridad"
        GARDENING = "GARDENING", "Jardinería"
        CLEANING = "CLEANING", "Limpieza"
        INFRASTRUCTURE = "INFRASTRUCTURE", "Infraestructura"
        EMERGENCY = "EMERGENCY", "Emergencia"

    class Urgency(models.TextChoices):
        NORMAL = "NORMAL", "Normal"
        HIGH = "HIGH", "Alta"
        CRITICAL = "CRITICAL", "Crítica"

    title = models.CharField(max_length=200)
    description = models.TextField()

    category = models.CharField(
        max_length=20,
        choices=Category.choices,
        default=Category.INFRASTRUCTURE,
    )

    location = models.CharField(max_length=150)

    urgency = models.CharField(
        max_length=10,
        choices=Urgency.choices,
        default=Urgency.NORMAL,
    )

    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.OPEN,
    )

    # 🔥 NUEVO CAMPO IMAGEN
    image = models.ImageField(
        upload_to="incidents/",
        null=True,
        blank=True,
    )

    created_at = models.DateTimeField(auto_now_add=True)
    resolved_at = models.DateTimeField(null=True, blank=True)

    created_by = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="incidents_created",
    )

    assigned_to = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="incidents_assigned",
    )

    ALLOWED_TRANSITIONS = {
        Status.OPEN: [Status.IN_PROGRESS],
        Status.IN_PROGRESS: [Status.RESOLVED],
        Status.RESOLVED: [],
    }

    def clean(self):

        if self.status == self.Status.RESOLVED and not self.assigned_to:
            raise ValidationError(
                "No se puede resolver una incidencia sin técnico asignado."
            )

        if self.pk:
            previous = Incident.objects.get(pk=self.pk)
            if previous.status != self.status:
                allowed = self.ALLOWED_TRANSITIONS.get(previous.status, [])
                if self.status not in allowed:
                    raise ValidationError(
                        f"Transición no permitida: {previous.status} → {self.status}"
                    )

    def save(self, *args, **kwargs):

        if self.pk:
            previous = Incident.objects.get(pk=self.pk)

            if (
                previous.status != self.Status.RESOLVED
                and self.status == self.Status.RESOLVED
            ):
                self.resolved_at = timezone.now()

            if (
                previous.status == self.Status.RESOLVED
                and self.status != self.Status.RESOLVED
            ):
                self.resolved_at = None

        self.full_clean()
        super().save(*args, **kwargs)

    @property
    def resolution_time(self):
        if self.resolved_at:
            delta = self.resolved_at - self.created_at
            return round(delta.total_seconds() / 3600, 2)
        return None

    def __str__(self):
        return f"{self.title} - {self.get_status_display()}"
