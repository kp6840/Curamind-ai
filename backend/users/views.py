from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework.decorators import permission_classes
from .serializers import RegisterSerializer
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken

from .permissions import IsPatient, IsDoctor


# -------------------------------
# Register API
# -------------------------------
@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
    serializer = RegisterSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response({"message": "User created"}, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# -------------------------------
# Login API (JWT)
# -------------------------------
@api_view(['POST'])
@permission_classes([AllowAny])
def login(request):
    username = request.data.get("username")
    password = request.data.get("password")

    user = authenticate(request, username=username, password=password)

    if user is not None:
        refresh = RefreshToken.for_user(user)
        return Response({
            "access": str(refresh.access_token),
            "refresh": str(refresh),
            "user": {
                "username": user.username,
                "role": user.role
            }
        })
    
    return Response({"error": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)


# -------------------------------
# Patient Dashboard (Protected)
# -------------------------------
@api_view(['GET'])
@permission_classes([IsPatient])
def patient_dashboard(request):
    return Response({
        "message": f"Welcome Patient {request.user.username}"
    })


# -------------------------------
# Doctor Dashboard (Protected)
# -------------------------------
@api_view(['GET'])
@permission_classes([IsDoctor])
def doctor_dashboard(request):
    return Response({
        "message": f"Welcome Doctor {request.user.username}"
    })