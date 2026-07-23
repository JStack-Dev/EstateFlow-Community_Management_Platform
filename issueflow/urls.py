from django.contrib import admin
from django.urls import path, include
from django.contrib.auth.views import LoginView, LogoutView
from django.views.generic import TemplateView

from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

from incidents.views import incident_list

urlpatterns = [
    path("admin/", admin.site.urls),

    # --------------------------------------------------
    # PLANTILLAS DJANGO (requisito PFM: modelos, vistas, plantillas, auth)
    # --------------------------------------------------
    path("", TemplateView.as_view(template_name="landing.html"), name="landing"),
    path("login/", LoginView.as_view(template_name="registration/login.html"), name="login"),
    path("logout/", LogoutView.as_view(), name="logout"),
    path("incidents/", incident_list, name="incident_list"),

    # --------------------------------------------------
    # API JWT
    # --------------------------------------------------
    path("api/token/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("api/token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),

    # --------------------------------------------------
    # API ENDPOINTS
    # --------------------------------------------------
    path("api/auth/", include("users.urls")),
    path("api/users/", include("users.management_urls")),
    path("api/incidents/", include("incidents.urls")),
    path("api/reservations/", include("reservations.urls")),
    path("api/packages/", include("packages.urls")),
    path("api/access/", include("access.urls")),
    path("api/works/", include("works.urls")),
    path("api/notifications/", include("notifications.urls")),
]