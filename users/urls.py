from django.urls import path
from .views import login_api, register_api, current_user_api

urlpatterns = [
    path("login/", login_api),
    path("register/", register_api),
    path("me/", current_user_api),
]