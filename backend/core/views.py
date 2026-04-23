from django.shortcuts import render

# Create your views here.
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status

from .models import Appointment, Patient, Doctor
from .serializers import AppointmentSerializer
from users.permissions import IsPatient, IsDoctor


# -------------------------------
# Book Appointment (Patient only)
# -------------------------------
@api_view(['POST'])
@permission_classes([IsPatient])
def book_appointment(request):
    try:
        patient = Patient.objects.get(user=request.user)
    except Patient.DoesNotExist:
        return Response({"error": "Patient profile not found"}, status=404)

    data = request.data.copy()
    data['patient'] = patient.id

    serializer = AppointmentSerializer(data=data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=201)

    return Response(serializer.errors, status=400)


# -------------------------------
# View Appointments (Doctor only)
# -------------------------------
@api_view(['GET'])
@permission_classes([IsDoctor])
def doctor_appointments(request):
    try:
        doctor = Doctor.objects.get(user=request.user)
    except Doctor.DoesNotExist:
        return Response({"error": "Doctor profile not found"}, status=404)

    appointments = Appointment.objects.filter(doctor=doctor)
    serializer = AppointmentSerializer(appointments, many=True)

    return Response(serializer.data)