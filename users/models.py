from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):

    class TipoUsuario(models.TextChoices):
        PROPIETARIO = "PROPIETARIO", "Propietario"
        INQUILINO = "INQUILINO", "Inquilino"
        PERSONAL = "PERSONAL", "Personal"

    class Rol(models.TextChoices):
        ADMIN = "ADMIN", "Administrador"
        STAFF = "STAFF", "Personal"
        USER = "USER", "Usuario"

    vivienda = models.ForeignKey(
        "estructura.Vivienda",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="usuarios"
    )

    tipo_usuario = models.CharField(
        max_length=20,
        choices=TipoUsuario.choices,
        default=TipoUsuario.PROPIETARIO
    )

    # 🔥 NUEVO CAMPO CLAVE
    role = models.CharField(
        max_length=10,
        choices=Rol.choices,
        default=Rol.USER
    )

    activo = models.BooleanField(default=True)

    def __str__(self):
        return self.username