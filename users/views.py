from django.contrib.auth import authenticate, login, logout

from rest_framework.decorators import (
    api_view,
    permission_classes,
    authentication_classes,
)
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

from incidents.authentication import CsrfExemptSessionAuthentication
from .models import User


# ---------------------------------------
# REGISTER
# ---------------------------------------

@api_view(["POST"])
@permission_classes([AllowAny])
@authentication_classes([])
def register_api(request):

    username = request.data.get("username", "").strip()
    password = request.data.get("password", "").strip()
    tipo_usuario = request.data.get("tipo_usuario", "PROPIETARIO")

    if not username or not password:
        return Response(
            {"error": "Usuario y contraseña obligatorios"},
            status=status.HTTP_400_BAD_REQUEST
        )

    if User.objects.filter(username=username).exists():
        return Response(
            {"error": "El usuario ya existe"},
            status=status.HTTP_400_BAD_REQUEST
        )

    user = User.objects.create_user(
        username=username,
        password=password,
        tipo_usuario=tipo_usuario,
        activo=True
    )

    return Response(
        {
            "message": "Usuario creado correctamente",
            "id": user.id,
            "username": user.username,
            "tipo_usuario": user.tipo_usuario
        },
        status=status.HTTP_201_CREATED
    )


# ---------------------------------------
# LOGIN
# ---------------------------------------

@api_view(["POST"])
@permission_classes([AllowAny])
@authentication_classes([])
def login_api(request):

    username = request.data.get("username", "").strip()
    password = request.data.get("password", "").strip()

    if not username or not password:
        return Response(
            {"error": "Usuario y contraseña obligatorios"},
            status=status.HTTP_400_BAD_REQUEST
        )

    user = authenticate(request, username=username, password=password)

    if user is None:
        return Response(
            {"error": "Credenciales incorrectas"},
            status=status.HTTP_401_UNAUTHORIZED
        )

    if not user.activo:
        return Response(
            {"error": "Usuario desactivado"},
            status=status.HTTP_403_FORBIDDEN
        )

    login(request, user)

    return Response(
        {
            "id": user.id,
            "username": user.username,
            "role": user.role,  # 🔥 AÑADIDO
            "tipo_usuario": user.tipo_usuario,
            "vivienda": user.vivienda.referencia if user.vivienda else None,
        },
        status=status.HTTP_200_OK
    )


# ---------------------------------------
# LOGOUT
# ---------------------------------------

@api_view(["POST"])
@permission_classes([IsAuthenticated])
@authentication_classes([CsrfExemptSessionAuthentication])
def logout_api(request):

    logout(request)

    return Response(
        {"message": "Sesión cerrada correctamente"},
        status=status.HTTP_200_OK
    )


# ---------------------------------------
# CURRENT USER
# ---------------------------------------

@api_view(["GET"])
@permission_classes([IsAuthenticated])
@authentication_classes([CsrfExemptSessionAuthentication])
def current_user_api(request):

    user = request.user

    return Response(
        {
            "id": user.id,
            "username": user.username,
            "role": user.role,  # 🔥 AÑADIDO (CLAVE)
            "tipo_usuario": user.tipo_usuario,
            "vivienda": user.vivienda.referencia if user.vivienda else None,
        },
        status=status.HTTP_200_OK
    )


# ---------------------------------------
# USERS - LIST
# ---------------------------------------

from common.permissions import IsAdmin
from .serializers import UserSerializer


@api_view(["GET"])
@authentication_classes([CsrfExemptSessionAuthentication])
@permission_classes([IsAuthenticated, IsAdmin])
def user_list_api(request):

    users = User.objects.all()
    serializer = UserSerializer(users, many=True)

    return Response(serializer.data)


# ---------------------------------------
# USERS - UPDATE
# ---------------------------------------

@api_view(["PATCH"])
@authentication_classes([CsrfExemptSessionAuthentication])
@permission_classes([IsAuthenticated, IsAdmin])
def user_update_api(request, pk):

    try:
        user = User.objects.get(pk=pk)
    except User.DoesNotExist:
        return Response(
            {"error": "Usuario no encontrado"},
            status=status.HTTP_404_NOT_FOUND
        )

    serializer = UserSerializer(user, data=request.data, partial=True)

    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)