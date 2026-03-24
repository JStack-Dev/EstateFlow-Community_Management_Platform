from django.contrib import admin
from .models import Comment


@admin.register(Comment)
class CommentAdmin(admin.ModelAdmin):
    """
    Configuración del admin para comentarios.
    """

    list_display = ("author", "incident", "created_at")
    search_fields = ("content",)
    ordering = ("-created_at",)
