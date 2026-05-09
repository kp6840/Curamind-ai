from django.urls import path

from .views import (
    book_appointment,
    doctor_appointments,
    patient_appointments,
    update_appointment_status,

    create_record,
    my_records,
    record_detail,
    update_record
)

urlpatterns = [

    # =========================================
    # APPOINTMENTS
    # =========================================
    path(
        'appointments/book/',
        book_appointment
    ),

    path(
        'appointments/doctor/',
        doctor_appointments
    ),

    path(
        'appointments/patient/',
        patient_appointments
    ),

    path(
        'appointments/<int:pk>/update/',
        update_appointment_status
    ),

    # =========================================
    # MEDICAL RECORDS
    # =========================================
    path(
        'records/create/',
        create_record
    ),

    path(
        'my-records/',
        my_records
    ),

    path(
        'record/<int:pk>/',
        record_detail
    ),

    path(
        'record/<int:pk>/update/',
        update_record
    ),
]