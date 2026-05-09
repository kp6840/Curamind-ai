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

    # ✅ Prevent past appointments
    def validate_appointment_date(self, value):
        if value < date.today():
            raise serializers.ValidationError(
                "Cannot book appointment in the past"
            )
        return value


# -------------------------------
# Medical Record Serializer
# -------------------------------
class MedicalRecordSerializer(serializers.ModelSerializer):

    class Meta:
        model = MedicalRecord
        fields = '__all__'
        read_only_fields = ['doctor']

    # ✅ File validation
    def validate_file(self, value):

        if value:
            # Max 5MB
            if value.size > 5 * 1024 * 1024:
                raise serializers.ValidationError(
                    "File size must be under 5MB"
                )

        return value

    # ✅ Status validation
    def validate_status(self, value):

        allowed_status = ['pending', 'reviewed', 'completed']

        if value not in allowed_status:
            raise serializers.ValidationError(
                "Invalid status"
            )

        return value