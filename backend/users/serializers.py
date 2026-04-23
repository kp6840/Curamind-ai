from rest_framework import serializers
from .models import User
from django.contrib.auth.password_validation import validate_password

# ✅ Import profiles
from core.models import Patient, Doctor


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'role']

    # ✅ Password validation
    def validate(self, attrs):
        validate_password(attrs['password'])
        return attrs

    # ✅ Email validation (keep yours)
    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("Email already exists")
        return value

    # ✅ Create user + auto profile
    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)

        if user.role == 'patient':
            Patient.objects.create(user=user)
        elif user.role == 'doctor':
            Doctor.objects.create(user=user)

        return user