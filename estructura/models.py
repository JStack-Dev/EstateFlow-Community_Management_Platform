import uuid
from django.db import models
from django.utils import timezone


class Urbanizacion(models.Model):
    nombre = models.CharField(max_length=200)
    direccion = models.CharField(max_length=255)
    localidad = models.CharField(max_length=100)
    provincia = models.CharField(max_length=100)
    codigo_postal = models.CharField(max_length=10)
    fecha_creacion = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Urbanización"
        verbose_name_plural = "Urbanizaciones"

    def __str__(self):
        return self.nombre


class Vivienda(models.Model):
    urbanizacion = models.ForeignKey(
        Urbanizacion,
        on_delete=models.CASCADE,
        related_name="viviendas"
    )
    referencia = models.CharField(max_length=100)
    direccion_detalle = models.CharField(max_length=255)
    propietario_nombre = models.CharField(max_length=200)
    activa = models.BooleanField(default=True)

    class Meta:
        verbose_name = "Vivienda"
        verbose_name_plural = "Viviendas"

    def __str__(self):
        return f"{self.referencia} - {self.urbanizacion.nombre}"


class Invitacion(models.Model):
    vivienda = models.ForeignKey(
        Vivienda,
        on_delete=models.CASCADE,
        related_name="invitaciones"
    )
    email = models.EmailField()
    token = models.UUIDField(default=uuid.uuid4, unique=True, editable=False)
    usada = models.BooleanField(default=False)
    fecha_creacion = models.DateTimeField(auto_now_add=True)
    fecha_expiracion = models.DateTimeField()

    class Meta:
        verbose_name = "Invitación"
        verbose_name_plural = "Invitaciones"

    def esta_expirada(self):
        return timezone.now() > self.fecha_expiracion

    def __str__(self):
        return f"Invitación para {self.email}"
