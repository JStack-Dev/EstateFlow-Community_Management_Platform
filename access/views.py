from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

from incidents.authentication import CsrfExemptSessionAuthentication

from .models import VisitorAccess
from .serializers import VisitorAccessSerializer


@api_view(["GET", "POST"])
@permission_classes([IsAuthenticated])
@authentication_classes([CsrfExemptSessionAuthentication])
def resident_access_api(request):

    user = request.user

    if request.method == "GET":

        accesses = VisitorAccess.objects.filter(resident=user)

        serializer = VisitorAccessSerializer(accesses, many=True)

        return Response(serializer.data)

    if request.method == "POST":

        serializer = VisitorAccessSerializer(
            data=request.data
        )

        if serializer.is_valid():

            serializer.save(resident=user)

            return Response(
                serializer.data,
                status=status.HTTP_201_CREATED
            )

        return Response(serializer.errors)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
@authentication_classes([CsrfExemptSessionAuthentication])
def staff_access_api(request):

    if request.user.tipo_usuario != "PERSONAL":

        return Response(
            {"error": "No autorizado"},
            status=status.HTTP_403_FORBIDDEN
        )

    accesses = VisitorAccess.objects.all()

    serializer = VisitorAccessSerializer(accesses, many=True)

    return Response(serializer.data)