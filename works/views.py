from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

from .models import Work
from .serializers import WorkSerializer


@api_view(["GET", "POST"])
@permission_classes([IsAuthenticated])
def resident_works_api(request):

    user = request.user

    if request.method == "GET":

        works = Work.objects.filter(resident=user)

        serializer = WorkSerializer(works, many=True)

        return Response(serializer.data)

    if request.method == "POST":

        serializer = WorkSerializer(data=request.data)

        if serializer.is_valid():

            serializer.save(resident=user)

            return Response(
                serializer.data,
                status=status.HTTP_201_CREATED
            )

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def staff_works_api(request):

    if request.user.role not in ["STAFF", "ADMIN"]:

        return Response(
            {"error": "No autorizado"},
            status=status.HTTP_403_FORBIDDEN
        )

    works = Work.objects.all()

    serializer = WorkSerializer(works, many=True)

    return Response(serializer.data)