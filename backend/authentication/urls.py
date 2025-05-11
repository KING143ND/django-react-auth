from django.urls import path
from authentication.views import (
    # User Views
    SignUpView, ChangePasswordView, ForgotPasswordView, PasswordResetConfirmView,
    # OTP Views
    GenerateOTPView, ValidateOTPView, ResendOTPView, 
    # Custom Token Views
    CustomTokenObtainPairView,
)
from rest_framework_simplejwt.views import (
    # Refresh Token Views
    TokenRefreshView,
)


urlpatterns = [
    # Token endpoints
    path(
        'token/', 
        CustomTokenObtainPairView.as_view(), 
        name='token_obtain_pair'
    ),
    path(
        'token/refresh/', 
        TokenRefreshView.as_view(), 
        name='token_refresh'
    ),
    path(
        'signup/', 
        SignUpView.as_view(), 
        name='user-register'
    ),
    # User endpoints
    path(
        'password/change/', 
        ChangePasswordView.as_view(), 
        name='change-password'
    ),
    path(
        'password/forgot/', 
        ForgotPasswordView.as_view(), 
        name='forgot-password'
    ),
    path(
        'password/reset/<int:user_id>/<str:token>/', 
        PasswordResetConfirmView.as_view(), 
        name='password-reset-confirm'
    ),
    # OTP endpoints
    path(
        'otp/', 
        GenerateOTPView.as_view(), 
        name='generate-otp'
    ),
    path(
        'otp/validate/', 
        ValidateOTPView.as_view(), 
        name='validate-otp'
    ),
    path(
        'otp/resend/', 
        ResendOTPView.as_view(), 
        name='resend-otp'
    ),
]
