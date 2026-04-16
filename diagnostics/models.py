from django.db import models
from django.contrib.auth.models import User

# 1. Patient Table
class Patient(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    date_of_birth = models.DateField()
    address = models.TextField()

    def __str__(self):
        return f"Patient: {self.user.username}"

# 2. Doctor Table (New!)
class Doctor(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    specialty = models.CharField(max_length=100)
    license_number = models.CharField(max_length=50)

    def __str__(self):
        return f"Dr. {self.user.last_name} ({self.specialty})"

# 3. Medical Record Table (For MRI/X-rays)
class MedicalRecord(models.Model):
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE)
    image_type = models.CharField(max_length=50) 
    dicom_file = models.FileField(upload_to='medical_scans/')
    uploaded_at = models.DateTimeField(auto_now_add=True)
    ai_flagged = models.BooleanField(default=False)

# 4. Appointment Table (New!)
class Appointment(models.Model):
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE)
    doctor = models.ForeignKey(Doctor, on_delete=models.CASCADE)
    appointment_date = models.DateTimeField()
    reason = models.TextField(null=True, blank=True)
    status = models.CharField(max_length=20, default='Scheduled')

# 5. Improved Audit Log (For HIPAA Security)
class AuditLog(models.Model):
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    action = models.CharField(max_length=255)
    ip_address = models.GenericIPAddressField(null=True) # Added for security
    resource_accessed = models.CharField(max_length=255, null=True) # e.g. "MRI Scan #10"
    timestamp = models.DateTimeField(auto_now_add=True)