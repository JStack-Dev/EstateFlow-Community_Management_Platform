from django.contrib.auth import get_user_model, authenticate
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
import json

User = get_user_model()


# ---------------------------------------
# REGISTER
# ---------------------------------------
@api_view(["POST"])
@permission_classes([AllowAny])
def register_api(request):
    try:
        data = request.data or json.loads(request.body or "{}")
        username = data.get("username")
        password = data.get("password")
    except Exception:
        return Response(
            {"error": "Error leyendo datos"},
            status=status.HTTP_400_BAD_REQUEST
        )

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
        password=password
    )

    # 🔥 asegurar que esté activo para JWT
    user.is_active = True
    user.save()

    return Response(
        {"message": "Usuario creado correctamente"},
        status=status.HTTP_201_CREATED
    )


# ---------------------------------------
# LOGIN (CUSTOM JWT)
# ---------------------------------------
@api_view(["POST"])
@permission_classes([AllowAny])
def login_api(request):
    try:
        data = request.data or json.loads(request.body or "{}")
        username = data.get("username")
        password = data.get("password")
    except Exception:
        return Response(
            {"error": "Error leyendo datos"},
            status=status.HTTP_400_BAD_REQUEST
        )

    if not username or not password:
        return Response(
            {"error": "Usuario y contraseña obligatorios"},
            status=status.HTTP_400_BAD_REQUEST
        )

    user = authenticate(username=username, password=password)

    if user is None:
        return Response(
            {"error": "Credenciales incorrectas"},
            status=status.HTTP_401_UNAUTHORIZED
        )

    if not user.is_active:
        return Response(
            {"error": "Usuario inactivo"},
            status=status.HTTP_403_FORBIDDEN
        )

    refresh = RefreshToken.for_user(user)

    return Response({
        "access": str(refresh.access_token),
        "refresh": str(refresh),
    })


# ---------------------------------------
# CURRENT USER (🔥 CLAVE PARA FRONTEND)
# ---------------------------------------
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def current_user_api(request):
    user = request.user

    return Response({
        "id": user.id,
        "username": user.username,
        "role": user.role,  # 🔥 imprescindible para RoleGuard
    })