from django.db import models
from django.contrib.auth.models import User

# Patient Table
class Patient(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    date_of_birth = models.DateField()
    address = models.TextField()

# Medical Records Table
class MedicalRecord(models.Model):
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE)
    image_type = models.CharField(max_length=50) 
    dicom_file = models.FileField(upload_to='medical_scans/')
    uploaded_at = models.DateTimeField(auto_now_add=True)
    ai_flagged = models.BooleanField(default=False)

# Security Audit Log Table
class AuditLog(models.Model):
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    action = models.CharField(max_length=255)
    timestamp = models.DateTimeField(auto_now_add=True)