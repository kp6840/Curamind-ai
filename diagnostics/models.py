from django.db import models
from django.contrib.auth.models import User
from django.core.exceptions import ValidationError
from django.utils import timezone

# 1. Custom function for organized file storage (Week 2 Task)
def patient_directory_path(instance, filename):
    return f'patient_{instance.patient.id}/{timezone.now().year}/{filename}'

class Patient(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    date_of_birth = models.DateField()
    address = models.TextField()
    
    # Timestamps (Week 2 Task)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Patient: {self.user.username}"

class Doctor(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    specialty = models.CharField(max_length=100)
    license_number = models.CharField(max_length=50)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Dr. {self.user.last_name} ({self.specialty})"

class MedicalRecord(models.Model):
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE)
    image_type = models.CharField(max_length=50)
    # Improved file structure (Week 2 Task)
    dicom_file = models.FileField(upload_to=patient_directory_path)
    uploaded_at = models.DateTimeField(auto_now_add=True)
    ai_flagged = models.BooleanField(default=False)

    def __str__(self):
        return f"Record: {self.patient.user.username} - {self.image_type}"

class Appointment(models.Model):
    STATUS_CHOICES = [
        ('SCHEDULED', 'Scheduled'),
        ('COMPLETED', 'Completed'),
        ('CANCELLED', 'Cancelled'),
    ]

    patient = models.ForeignKey(Patient, on_delete=models.CASCADE)
    # Relationship fix: SET_NULL so we keep records if doctor is deleted (Week 2 Task)
    doctor = models.ForeignKey(Doctor, on_delete=models.SET_NULL, null=True)
    
    # Indexing: Added db_index for faster searching (Week 2 Task)
    appointment_date = models.DateTimeField(db_index=True)
    reason = models.TextField(null=True, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='SCHEDULED')
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    # Validation: Prevent past dates (Week 2 Task)
    def clean(self):
        if self.appointment_date < timezone.now():
            raise ValidationError("Appointment date cannot be in the past.")

    def __str__(self):
        last_name = self.doctor.user.last_name if self.doctor else "Unknown Doctor"
        return f"Appt: {self.patient.user.last_name} with Dr. {last_name}"

class AuditLog(models.Model):
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    action = models.CharField(max_length=255)
    ip_address = models.GenericIPAddressField(null=True)
    resource_accessed = models.CharField(max_length=255)
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Audit: {self.user} - {self.action} at {self.timestamp}"