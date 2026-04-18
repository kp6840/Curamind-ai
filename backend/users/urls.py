from django.urls import path
from .views import register, login, patient_dashboard, doctor_dashboard
urlpatterns = [
    path('register/', register),
    path('login/', login),
    path('patient/', patient_dashboard),
    path('doctor/', doctor_dashboard),
]