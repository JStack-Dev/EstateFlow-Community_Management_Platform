from django.contrib.auth import authenticate

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

from rest_framework_simplejwt.tokens import RefreshToken

from .models import User


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
        return Response({"error": "Usuario y contraseña obligatorios"}, status=400)

    if User.objects.filter(username=username).exists():
        return Response({"error": "El usuario ya existe"}, status=400)

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
    }, status=201)


# ---------------------------------------
# LOGIN (JWT)
# ---------------------------------------

@api_view(["POST"])
@permission_classes([AllowAny])
def login_api(request):

    username = request.data.get("username", "").strip()
    password = request.data.get("password", "").strip()

    user = authenticate(username=username, password=password)

    if user is None:
        return Response({"error": "Credenciales incorrectas"}, status=401)

    refresh = RefreshToken.for_user(user)

    return Response({
        "access": str(refresh.access_token),
        "refresh": str(refresh),
        "user": {
            "id": user.id,
            "username": user.username,
            "role": user.role,
            "tipo_usuario": user.tipo_usuario,
        }
    })


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
        "role": user.role,
        "tipo_usuario": user.tipo_usuario,
    })


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

    return Response(serializer.data)