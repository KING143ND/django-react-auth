from django.core.mail import send_mail
from django.contrib.auth.models import User
from django.conf import settings
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from authentication.serializers import ForgotPasswordSerializer
from utils.token import account_activation_token
from utils.exceptions import format_serializer_error


class ForgotPasswordView(APIView):
    def post(self, request):
        serializer = ForgotPasswordSerializer(data=request.data)

        if not serializer.is_valid():
            return format_serializer_error(serializer.errors)

        email = serializer.validated_data['email']

        try:
            user = User.objects.get(email=email)

            token = account_activation_token.make_token(user)
            frontend_base_url = getattr(settings, 'FRONTEND_URL', '')
            reset_link = f"{frontend_base_url}/reset-password?user_id={user.pk}&token={token}"

            send_mail(
                subject="Password Reset Request",
                message=f"Click the link below to reset your password:\n{reset_link}",
                from_email=settings.EMAIL_HOST_USER,
                recipient_list=[email],
                fail_silently=False
            )

            return Response({
                'message': 'We have sent you an email to reset your password.',
                'status': status.HTTP_200_OK
            }, status=status.HTTP_200_OK)

        except User.DoesNotExist:
            return Response({
                'message': 'User with this email does not exist.',
                'status': status.HTTP_404_NOT_FOUND
            }, status=status.HTTP_404_NOT_FOUND)

        except Exception as e:
            return Response({
                'message': f'Internal server error: {str(e)}',
                'status': status.HTTP_500_INTERNAL_SERVER_ERROR
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
