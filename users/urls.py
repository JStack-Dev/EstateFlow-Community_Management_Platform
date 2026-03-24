from django.urls import path
from .views import register_api, login_api, logout_api, current_user_api
from .views import user_list_api, user_update_api


urlpatterns = [

    path("register/", register_api),
    path("login/", login_api),
    path("logout/", logout_api),
    path("me/", current_user_api),
    path("users/", user_list_api),
    path("users/<int:pk>/", user_update_api),

]