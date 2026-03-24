from django.contrib.auth.decorators import login_required
from django.shortcuts import render
from django.utils import timezone
from django.db.models import Avg, Count, F, ExpressionWrapper, DurationField

from rest_framework import status
from rest_framework.decorators import (
    api_view,
    permission_classes,
    authentication_classes,
)
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .authentication import CsrfExemptSessionAuthentication
from .models import Incident
from .serializers import IncidentSerializer


# --------------------------------------------------
# VISTA HTML (LEGACY - NO TOCAR)
# --------------------------------------------------

@login_required
def incident_list(request):
    user = request.user

    if user.role in ["ADMIN", "STAFF"]:
        incidents = Incident.objects.all()
    else:
        incidents = Incident.objects.filter(created_by=user)

    return render(
        request,
        "incidents/incident_list.html",
        {"incidents": incidents},
    )


# --------------------------------------------------
# API REST - LISTAR Y CREAR
# --------------------------------------------------

@api_view(["GET", "POST"])
@authentication_classes([CsrfExemptSessionAuthentication])
@permission_classes([IsAuthenticated])
def incident_list_api(request):

    user = request.user
    is_staff = user.role in ["ADMIN", "STAFF"]

    # -------------------------
    # GET - LISTADO
    # -------------------------
    if request.method == "GET":

        incidents = (
            Incident.objects.all()
            if is_staff
            else Incident.objects.filter(created_by=user)
        )

        serializer = IncidentSerializer(
            incidents,
            many=True,
            context={"request": request},
        )
        return Response(serializer.data)

    # -------------------------
    # POST - CREAR
    # -------------------------
    if request.method == "POST":

        serializer = IncidentSerializer(
            data=request.data,
            context={"request": request},
        )

        if serializer.is_valid():
            serializer.save(created_by=user)
            return Response(
                serializer.data,
                status=status.HTTP_201_CREATED,
            )

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST,
        )


# --------------------------------------------------
# API REST - ACTUALIZAR (PATCH)
# --------------------------------------------------

@api_view(["PATCH"])
@authentication_classes([CsrfExemptSessionAuthentication])
@permission_classes([IsAuthenticated])
def incident_update_api(request, pk):

    try:
        incident = Incident.objects.get(pk=pk)
    except Incident.DoesNotExist:
        return Response(
            {"error": "Incidencia no encontrada"},
            status=status.HTTP_404_NOT_FOUND,
        )

    user = request.user
    is_staff = user.role in ["ADMIN", "STAFF"]

    # 🔥 CONTROL DE PERMISOS
    if not (is_staff or incident.created_by == user):
        return Response(
            {"error": "No tienes permiso para modificar esta incidencia."},
            status=status.HTTP_403_FORBIDDEN,
        )

    serializer = IncidentSerializer(
        incident,
        data=request.data,
        partial=True,
        context={"request": request},
    )

    if serializer.is_valid():

        new_status = request.data.get("status")

        if new_status == Incident.Status.RESOLVED:
            incident.resolved_at = timezone.now()

        elif new_status in [
            Incident.Status.OPEN,
            Incident.Status.IN_PROGRESS,
        ]:
            incident.resolved_at = None

        serializer.save()

        return Response(serializer.data)

    return Response(
        serializer.errors,
        status=status.HTTP_400_BAD_REQUEST,
    )


# --------------------------------------------------
# API REST - ESTADÍSTICAS EJECUTIVAS (KPI)
# --------------------------------------------------

@api_view(["GET"])
@authentication_classes([CsrfExemptSessionAuthentication])
@permission_classes([IsAuthenticated])
def incident_stats_api(request):
    """
    Devuelve métricas ejecutivas para dashboard premium.
    """

    total = Incident.objects.count()
    open_count = Incident.objects.filter(status=Incident.Status.OPEN).count()
    in_progress_count = Incident.objects.filter(
        status=Incident.Status.IN_PROGRESS
    ).count()
    resolved_count = Incident.objects.filter(
        status=Incident.Status.RESOLVED
    ).count()

    resolved_incidents = Incident.objects.filter(
        status=Incident.Status.RESOLVED,
        resolved_at__isnull=False,
    ).annotate(
        resolution_duration=ExpressionWrapper(
            F("resolved_at") - F("created_at"),
            output_field=DurationField(),
        )
    )

    avg_resolution = resolved_incidents.aggregate(
        avg_time=Avg("resolution_duration")
    )["avg_time"]

    avg_hours = (
        round(avg_resolution.total_seconds() / 3600, 2)
        if avg_resolution
        else 0
    )

    return Response({
        "total": total,
        "open": open_count,
        "in_progress": in_progress_count,
        "resolved": resolved_count,
        "avg_resolution_hours": avg_hours,
    })