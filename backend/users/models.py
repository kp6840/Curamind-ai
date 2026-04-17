from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    
    ROLE_CHOICES = (
        ('patient', 'Patient'),
        ('doctor', 'Doctor'),
        ('admin', 'Admin'),
    )

    role = models.CharField(max_length=10, choices=ROLE_CHOICES)
    
    # extra fields (optional but useful)
    phone = models.CharField(max_length=15, blank=True, null=True)

    def __str__(self):
        return self.username