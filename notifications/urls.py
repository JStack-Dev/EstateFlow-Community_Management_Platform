from django.urls import path
from .views import resident_notifications

urlpatterns = [
    path("resident/", resident_notifications),
]