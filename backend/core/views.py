from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status

from .models import (
    Appointment,
    Patient,
    Doctor,
    MedicalRecord
)

from .serializers import (
    AppointmentSerializer,
    MedicalRecordSerializer
)

from users.permissions import IsPatient, IsDoctor


# =====================================================
# BOOK APPOINTMENT (PATIENT ONLY)
# =====================================================
@api_view(['POST'])
@permission_classes([IsPatient])
def book_appointment(request):

    try:
        patient = Patient.objects.get(user=request.user)

    except Patient.DoesNotExist:
        return Response(
            {"error": "Patient profile not found"},
            status=404
        )

    data = request.data.copy()
    data['patient'] = patient.id

    # Prevent duplicate slot booking
    if Appointment.objects.filter(
        doctor=data.get('doctor'),
        appointment_date=data.get('appointment_date'),
        appointment_time=data.get('appointment_time')
    ).exists():

        return Response(
            {"error": "Slot already booked"},
            status=400
        )

    serializer = AppointmentSerializer(data=data)

    if serializer.is_valid():
        serializer.save()

        return Response(
            {
                "message": "Appointment booked successfully",
                "data": serializer.data
            },
            status=201
        )

    return Response(serializer.errors, status=400)


# =====================================================
# DOCTOR VIEW APPOINTMENTS
# =====================================================
@api_view(['GET'])
@permission_classes([IsDoctor])
def doctor_appointments(request):

    try:
        doctor = Doctor.objects.get(user=request.user)

    except Doctor.DoesNotExist:
        return Response(
            {"error": "Doctor profile not found"},
            status=404
        )

    appointments = Appointment.objects.filter(doctor=doctor)

    serializer = AppointmentSerializer(
        appointments,
        many=True
    )

    return Response(serializer.data)


# =====================================================
# PATIENT VIEW APPOINTMENTS
# =====================================================
@api_view(['GET'])
@permission_classes([IsPatient])
def patient_appointments(request):

    try:
        patient = Patient.objects.get(user=request.user)

    except Patient.DoesNotExist:
        return Response(
            {"error": "Patient profile not found"},
            status=404
        )

    appointments = Appointment.objects.filter(patient=patient)

    serializer = AppointmentSerializer(
        appointments,
        many=True
    )

    return Response(serializer.data)


# =====================================================
# UPDATE APPOINTMENT STATUS
# =====================================================
@api_view(['PATCH'])
@permission_classes([IsDoctor])
def update_appointment_status(request, pk):

    try:
        appointment = Appointment.objects.get(id=pk)

    except Appointment.DoesNotExist:
        return Response(
            {"error": "Appointment not found"},
            status=404
        )

    status_value = request.data.get("status")

    if status_value not in ['approved', 'rejected']:

        return Response(
            {"error": "Invalid status"},
            status=400
        )

    appointment.status = status_value
    appointment.save()

    return Response(
        {"message": "Appointment status updated"}
    )


# =====================================================
# CREATE MEDICAL RECORD
# =====================================================
@api_view(['POST'])
@permission_classes([IsDoctor])
def create_record(request):

    try:
        doctor = Doctor.objects.get(user=request.user)

    except Doctor.DoesNotExist:
        return Response(
            {"error": "Doctor profile not found"},
            status=404
        )

    data = request.data.copy()
    data['doctor'] = doctor.id

    serializer = MedicalRecordSerializer(data=data)

    if serializer.is_valid():
        serializer.save()

        return Response(
            {
                "message": "Medical record created",
                "data": serializer.data
            },
            status=201
        )

    return Response(serializer.errors, status=400)


# =====================================================
# PATIENT VIEW OWN RECORDS
# =====================================================
@api_view(['GET'])
@permission_classes([IsPatient])
def my_records(request):

    try:
        patient = Patient.objects.get(user=request.user)

    except Patient.DoesNotExist:
        return Response(
            {"error": "Patient profile not found"},
            status=404
        )

    records = MedicalRecord.objects.filter(patient=patient)

    serializer = MedicalRecordSerializer(
        records,
        many=True
    )

    return Response(serializer.data)


# =====================================================
# DOCTOR VIEW SINGLE RECORD
# =====================================================
@api_view(['GET'])
@permission_classes([IsDoctor])
def record_detail(request, pk):

    try:
        record = MedicalRecord.objects.get(id=pk)

    except MedicalRecord.DoesNotExist:
        return Response(
            {"error": "Medical record not found"},
            status=404
        )

    serializer = MedicalRecordSerializer(record)

    return Response(serializer.data)


# =====================================================
# DOCTOR UPDATE RECORD
# =====================================================
@api_view(['PATCH'])
@permission_classes([IsDoctor])
def update_record(request, pk):

    try:
        record = MedicalRecord.objects.get(id=pk)

    except MedicalRecord.DoesNotExist:
        return Response(
            {"error": "Medical record not found"},
            status=404
        )

    serializer = MedicalRecordSerializer(
        record,
        data=request.data,
        partial=True
    )

    if serializer.is_valid():
        serializer.save()

        return Response(
            {
                "message": "Medical record updated",
                "data": serializer.data
            }
        )

    return Response(serializer.errors, status=400)