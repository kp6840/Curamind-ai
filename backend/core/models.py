from django.db import models
from django.conf import settings

User = settings.AUTH_USER_MODEL


# -------------------------------
# Patient Model
# -------------------------------
class Patient(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    age = models.IntegerField()
    gender = models.CharField(max_length=10)
    phone = models.CharField(max_length=15)

    def __str__(self):
        return self.user.username


# -------------------------------
# Doctor Model
# -------------------------------
class Doctor(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    specialization = models.CharField(max_length=100)
    experience = models.IntegerField()
    hospital = models.CharField(max_length=100)

    def __str__(self):
        return self.user.username


# -------------------------------
# Medical Record Model
# -------------------------------
class MedicalRecord(models.Model):
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE)
    doctor = models.ForeignKey(Doctor, on_delete=models.CASCADE)

    diagnosis = models.TextField()
    prescription = models.TextField()

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.patient} - {self.doctor}"