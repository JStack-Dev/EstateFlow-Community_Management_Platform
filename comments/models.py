from django.conf import settings
from django.db import models
from incidents.models import Incident


User = settings.AUTH_USER_MODEL


class Comment(models.Model):
    """
    Modelo que representa un comentario asociado a una incidencia.
    """

    content = models.TextField(
        verbose_name="Comentario"
    )

    created_at = models.DateTimeField(
        auto_now_add=True,
        verbose_name="Fecha de creación"
    )

    author = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="comments",
        verbose_name="Autor"
    )

    incident = models.ForeignKey(
        Incident,
        on_delete=models.CASCADE,
        related_name="comments",
        verbose_name="Incidencia"
    )

    def __str__(self):
        return f"Comentario de {self.author}"
