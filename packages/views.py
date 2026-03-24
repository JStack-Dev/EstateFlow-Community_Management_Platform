from django.utils import timezone

from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

from incidents.authentication import CsrfExemptSessionAuthentication

from .models import Package
from .serializers import PackageSerializer


@api_view(["GET"])
@permission_classes([IsAuthenticated])
@authentication_classes([CsrfExemptSessionAuthentication])
def resident_packages_api(request):

    user = request.user

    packages = Package.objects.filter(resident=user)

    serializer = PackageSerializer(packages, many=True)

    return Response(serializer.data)


@api_view(["GET", "POST"])
@permission_classes([IsAuthenticated])
@authentication_classes([CsrfExemptSessionAuthentication])
def staff_packages_api(request):

    user = request.user

    if user.tipo_usuario != "PERSONAL":
        return Response(
            {"error": "No autorizado"},
            status=status.HTTP_403_FORBIDDEN
        )

    if request.method == "GET":

        packages = Package.objects.all()

        serializer = PackageSerializer(packages, many=True)

        return Response(serializer.data)

    if request.method == "POST":

        serializer = PackageSerializer(data=request.data)

        if serializer.is_valid():

            serializer.save()

            return Response(
                serializer.data,
                status=status.HTTP_201_CREATED
            )

        return Response(serializer.errors)


@api_view(["PATCH"])
@permission_classes([IsAuthenticated])
@authentication_classes([CsrfExemptSessionAuthentication])
def deliver_package_api(request, pk):

    try:
        package = Package.objects.get(pk=pk)
    except Package.DoesNotExist:

        return Response(
            {"error": "Paquete no encontrado"},
            status=status.HTTP_404_NOT_FOUND
        )

    package.delivered = True
    package.delivered_at = timezone.now()

    package.save()

    serializer = PackageSerializer(package)

    return Response(serializer.data)