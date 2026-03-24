from django.conf import settings
from django.db import models

User = settings.AUTH_USER_MODEL


class Notification(models.Model):

    message = models.CharField(max_length=255)

    created_at = models.DateTimeField(auto_now_add=True)

    read = models.BooleanField(default=False)

    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="notifications"
    )

    def __str__(self):
        return self.message