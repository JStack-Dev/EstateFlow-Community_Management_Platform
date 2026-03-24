from django.urls import path
from .views import resident_works_api, staff_works_api

urlpatterns = [

    path("resident/", resident_works_api),

    path("staff/", staff_works_api),

]