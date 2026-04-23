from django.db import models
from django.contrib.auth.models import User

class Patient(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    date_of_birth = models.DateField()
    address = models.TextField()

    def __str__(self):
        return f"Patient: {self.user.username}"

class Doctor(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    specialty = models.CharField(max_length=100)
    license_number = models.CharField(max_length=50)

    def __str__(self):
        return f"Dr. {self.user.last_name} ({self.specialty})"

class MedicalRecord(models.Model):
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE)
    image_type = models.CharField(max_length=50)
    dicom_file = models.FileField(upload_to='medical_scans/')
    uploaded_at = models.DateTimeField(auto_now_add=True)
    ai_flagged = models.BooleanField(default=False)

    def __str__(self):
        return f"Record: {self.patient.user.username} - {self.image_type}"

class Appointment(models.Model):
    # Khush's Requirement: Status Choices
    STATUS_CHOICES = [
        ('SCHEDULED', 'Scheduled'),
        ('COMPLETED', 'Completed'),
        ('CANCELLED', 'Cancelled'),
    ]

    patient = models.ForeignKey(Patient, on_delete=models.CASCADE)
    doctor = models.ForeignKey(Doctor, on_delete=models.CASCADE)
    appointment_date = models.DateTimeField()
    reason = models.TextField(null=True, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='SCHEDULED')

    def __str__(self):
        return f"Appt: {self.patient.user.last_name} with Dr. {self.doctor.user.last_name}"

class AuditLog(models.Model):
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    action = models.CharField(max_length=255)
    ip_address = models.GenericIPAddressField(null=True)
    resource_accessed = models.CharField(max_length=255)
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Audit: {self.user} - {self.action} at {self.timestamp}"