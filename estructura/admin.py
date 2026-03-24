from django.contrib import admin
from .models import Urbanizacion, Vivienda, Invitacion


@admin.register(Urbanizacion)
class UrbanizacionAdmin(admin.ModelAdmin):
    list_display = ("nombre", "localidad", "provincia")
    search_fields = ("nombre",)


@admin.register(Vivienda)
class ViviendaAdmin(admin.ModelAdmin):
    list_display = ("referencia", "urbanizacion", "activa")
    list_filter = ("urbanizacion",)
    search_fields = ("referencia", "propietario_nombre")


@admin.register(Invitacion)
class InvitacionAdmin(admin.ModelAdmin):
    list_display = ("email", "vivienda", "usada", "fecha_expiracion")
    list_filter = ("usada",)
    search_fields = ("email",)
