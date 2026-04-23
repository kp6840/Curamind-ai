from django.urls import path
from .views import book_appointment, doctor_appointments

urlpatterns = [
    path('book/', book_appointment),
    path('doctor-appointments/', doctor_appointments),
]