from django.urls import path
from .views import login_api, register_api, current_user_api, user_list_api, user_update_api

urlpatterns = [
    path("login/", login_api),
    path("register/", register_api),
    path("me/", current_user_api),
    path("", user_list_api),
    path("<int:pk>/", user_update_api),
]