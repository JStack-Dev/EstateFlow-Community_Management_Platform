from django.contrib.auth import authenticate
from django.contrib.auth import get_user_model

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

from rest_framework_simplejwt.tokens import RefreshToken

User = get_user_model()


# ---------------------------------------
# REGISTER
# ---------------------------------------

@api_view(["POST"])
@permission_classes([AllowAny])
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

    try:
        user = User.objects.create_user(
            username=username,
            password=password,
            tipo_usuario=tipo_usuario,
            activo=True
        )

        return Response({
            "message": "Usuario creado correctamente",
            "id": user.id,
            "username": user.username,
            "tipo_usuario": user.tipo_usuario
        }, status=status.HTTP_201_CREATED)

    except Exception as e:
        return Response(
            {"error": "Error creando usuario", "details": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


# ---------------------------------------
# LOGIN (JWT)
# ---------------------------------------

@api_view(["POST"])
@permission_classes([AllowAny])
def login_api(request):

    username = request.data.get("username", "").strip()
    password = request.data.get("password", "").strip()

    if not username or not password:
        return Response(
            {"error": "Usuario y contraseña obligatorios"},
            status=status.HTTP_400_BAD_REQUEST
        )

    user = authenticate(username=username, password=password)

    # 🔴 VALIDACIÓN CLAVE
    if user is None:
        return Response(
            {"error": "Credenciales incorrectas"},
            status=status.HTTP_401_UNAUTHORIZED
        )

    # 🔴 MUY IMPORTANTE (tu problema estaba aquí seguramente)
    if not user.is_active:
        return Response(
            {"error": "Usuario inactivo"},
            status=status.HTTP_403_FORBIDDEN
        )

    try:
        refresh = RefreshToken.for_user(user)

        return Response({
            "access": str(refresh.access_token),
            "refresh": str(refresh),
            "user": {
                "id": user.id,
                "username": user.username,
                "role": getattr(user, "role", None),
                "tipo_usuario": getattr(user, "tipo_usuario", None),
            }
        }, status=status.HTTP_200_OK)

    except Exception as e:
        return Response(
            {"error": "Error generando token", "details": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


# ---------------------------------------
# CURRENT USER
# ---------------------------------------

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def current_user_api(request):

    user = request.user

    return Response({
        "id": user.id,
        "username": user.username,
        "role": getattr(user, "role", None),
        "tipo_usuario": getattr(user, "tipo_usuario", None),
    }, status=status.HTTP_200_OK)


# ---------------------------------------
# USERS - LIST
# ---------------------------------------

from common.permissions import IsAdmin
from .serializers import UserSerializer


@api_view(["GET"])
@permission_classes([IsAuthenticated, IsAdmin])
def user_list_api(request):

    users = User.objects.all()
    serializer = UserSerializer(users, many=True)

    return Response(serializer.data, status=status.HTTP_200_OK)