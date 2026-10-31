from rest_framework import status, generics, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import get_user_model
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes, force_str
from .serializers import (
    RegisterSerializer,
    ChangePasswordSerializer,
    PasswordResetRequestSerializer,
    PasswordResetConfirmSerializer
)
from .models import AuditLog

User = get_user_model()

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (permissions.AllowAny,)
    serializer_class = RegisterSerializer

    def create(self, request, *args, **kwargs):
        response = super().create(request, *args, **kwargs)
        user = User.objects.get(email=request.data.get('email'))
        AuditLog.objects.create(
            user=user,
            action="USER_REGISTERED",
            target_object=f"User: {user.email}",
            ip_address=request.META.get('REMOTE_ADDR')
        )
        return Response({
            "status": "success",
            "message": "User registered successfully.",
            "data": response.data
        }, status=status.HTTP_201_CREATED)

class LogoutView(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def post(self, request):
        try:
            refresh_token = request.data.get("refresh")
            token = RefreshToken(refresh_token)
            token.blacklist()
            AuditLog.objects.create(
                user=request.user,
                action="USER_LOGGED_OUT",
                ip_address=request.META.get('REMOTE_ADDR')
            )
            return Response({"message": "Successfully logged out."}, status=status.HTTP_205_RESET_CONTENT)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

class ChangePasswordView(generics.UpdateAPIView):
    serializer_class = ChangePasswordSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get_object(self):
        return self.request.user

    def update(self, request, *args, **kwargs):
        user = self.get_object()
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            if not user.check_password(serializer.validated_data.get("old_password")):
                return Response({"old_password": ["Wrong password."]}, status=status.HTTP_400_BAD_REQUEST)
            user.set_password(serializer.validated_data.get("new_password"))
            user.save()
            AuditLog.objects.create(
                user=user,
                action="PASSWORD_CHANGED",
                ip_address=request.META.get('REMOTE_ADDR')
            )
            return Response({"status": "success", "message": "Password updated successfully."}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class PasswordResetRequestView(APIView):
    permission_classes = (permissions.AllowAny,)
    serializer_class = PasswordResetRequestSerializer

    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data['email']
            try:
                user = User.objects.get(email=email)
                token = PasswordResetTokenGenerator().make_token(user)
                uid = urlsafe_base64_encode(force_bytes(user.pk))
                reset_link = f"http://localhost:3000/reset-password?uid={uid}&token={token}"
                return Response({
                    "message": "Password reset link sent.",
                    "debug_reset_link": reset_link
                }, status=status.HTTP_200_OK)
            except User.DoesNotExist:
                return Response({"message": "Password reset link sent."}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class PasswordResetConfirmView(APIView):
    permission_classes = (permissions.AllowAny,)
    serializer_class = PasswordResetConfirmSerializer

    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            try:
                uid = force_str(urlsafe_base64_decode(serializer.validated_data['uidb64']))
                user = User.objects.get(pk=uid)
                if PasswordResetTokenGenerator().check_token(user, serializer.validated_data['token']):
                    user.set_password(serializer.validated_data['new_password'])
                    user.save()
                    AuditLog.objects.create(
                        user=user,
                        action="PASSWORD_RESET_CONFIRMED",
                        ip_address=request.META.get('REMOTE_ADDR')
                    )
                    return Response({"message": "Password has been reset successfully."}, status=status.HTTP_200_OK)
                return Response({"error": "Invalid or expired token."}, status=status.HTTP_400_BAD_REQUEST)
            except (TypeError, ValueError, OverflowError, User.DoesNotExist):
                return Response({"error": "Invalid token or user."}, status=status.HTTP_400_BAD_REQUEST)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)