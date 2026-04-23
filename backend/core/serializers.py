from rest_framework import serializers
from .models import Appointment, MedicalRecord
from datetime import date


# -------------------------------
# Appointment Serializer
# -------------------------------
class AppointmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Appointment
        fields = '__all__'

    # ✅ Validate appointment date (no past booking)
    def validate_appointment_date(self, value):
        if value < date.today():
            raise serializers.ValidationError("Cannot book appointment in the past")
        return value


# -------------------------------
# Medical Record Serializer
# -------------------------------
class MedicalRecordSerializer(serializers.ModelSerializer):
    class Meta:
        model = MedicalRecord
        fields = '__all__'

    # ✅ Validate file size (max 5MB)
    def validate_file(self, value):
        if value:
            if value.size > 5 * 1024 * 1024:
                raise serializers.ValidationError("File size must be under 5MB")
        return value