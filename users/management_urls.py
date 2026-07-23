from django.urls import path
from .views import user_list_api, user_update_api

urlpatterns = [
    path("", user_list_api),
    path("<int:pk>/", user_update_api),
]
