from django.urls import path
from .views import book_appointment, doctor_appointments, patient_appointments, update_appointment_status, create_record, patient_records

urlpatterns = [
    path('book/', book_appointment),
    path('doctor-appointments/', doctor_appointments),
    path('patient-appointments/', patient_appointments),
    path('update-status/<int:pk>/', update_appointment_status),
    path('records/create/', create_record),
    path('records/patient/', patient_records),
]