from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

from incidents.authentication import CsrfExemptSessionAuthentication

from .models import Reservation, Facility
from .serializers import ReservationSerializer, FacilitySerializer


@api_view(["GET"])
@permission_classes([IsAuthenticated])
@authentication_classes([CsrfExemptSessionAuthentication])
def facilities_list_api(request):

    facilities = Facility.objects.filter(active=True)

    serializer = FacilitySerializer(facilities, many=True)

    return Response(serializer.data)


@api_view(["GET", "POST"])
@permission_classes([IsAuthenticated])
@authentication_classes([CsrfExemptSessionAuthentication])
def reservations_api(request):

    user = request.user

    if request.method == "GET":

        reservations = Reservation.objects.filter(user=user)

        serializer = ReservationSerializer(reservations, many=True)

        return Response(serializer.data)

    if request.method == "POST":

        serializer = ReservationSerializer(
            data=request.data,
            context={"request": request}
        )

        if serializer.is_valid():

            serializer.save()

            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)