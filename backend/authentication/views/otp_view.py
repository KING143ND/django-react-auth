import random
from datetime import timedelta
from django.utils import timezone
from django.core.mail import send_mail
from django.contrib.auth.models import User
from django.conf import settings
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from authentication.models import OtpStore


class GenerateOTPView(APIView):
    @staticmethod
    def generate_otp_code():
        """Generate a 6-digit random OTP code."""
        return ''.join([str(random.randint(0, 9)) for _ in range(6)])

    def post(self, request):
        try:
            user_id = request.data.get('user_id')

            user = User.objects.get(id=user_id)
            otp_code = self.generate_otp_code()
            expired_at = timezone.now() + timedelta(minutes=5)

            otp = OtpStore.objects.create(user=user, otp_code=otp_code, expired_at=expired_at)
            
            send_mail(
                subject='Verify Your Account',
                message=f'Your OTP code is {otp_code}',
                from_email=settings.EMAIL_HOST_USER,
                recipient_list=[user.email],
                fail_silently=False
            )

            return Response({
                'data': {'otp_code': otp.otp_code},
                'message': 'OTP has been sent successfully',
                'status': status.HTTP_201_CREATED
            }, status=status.HTTP_201_CREATED)

        except User.DoesNotExist:
            return Response({
                'message': 'User not found',
                'status': status.HTTP_404_NOT_FOUND
            }, status=status.HTTP_404_NOT_FOUND)

        except Exception as e:
            return Response({
                'message': f'Internal server error: {str(e)}',
                'status': status.HTTP_500_INTERNAL_SERVER_ERROR
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class ValidateOTPView(APIView):
    def post(self, request):
        try:
            otp_code = request.data.get('otp_code')
            user_id = request.data.get('user_id')

            user = User.objects.get(id=user_id)

            latest_otp = OtpStore.objects.filter(user=user).latest()

            now = timezone.now().replace(microsecond=0)
            otp_expiry = latest_otp.expired_at.replace(microsecond=0)

            if str(latest_otp.otp_code) != str(otp_code):
                return Response({
                    'message': 'OTP is invalid',
                    'status': status.HTTP_400_BAD_REQUEST
                }, status=status.HTTP_400_BAD_REQUEST)

            if now > otp_expiry:
                return Response({
                    'message': 'OTP is expired, please generate a new one',
                    'status': status.HTTP_400_BAD_REQUEST
                }, status=status.HTTP_400_BAD_REQUEST)

            user.is_active = True
            user.save()

            return Response({
                'message': 'OTP is valid, user is verified',
                'status': status.HTTP_200_OK
            }, status=status.HTTP_200_OK)

        except User.DoesNotExist:
            return Response({
                'message': 'User not found',
                'status': status.HTTP_404_NOT_FOUND
            }, status=status.HTTP_404_NOT_FOUND)

        except OtpStore.DoesNotExist:
            return Response({
                'message': 'No OTP found for user',
                'status': status.HTTP_404_NOT_FOUND
            }, status=status.HTTP_404_NOT_FOUND)

        except Exception as e:
            return Response({
                'message': f'Internal server error: {str(e)}',
                'status': status.HTTP_500_INTERNAL_SERVER_ERROR
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class ResendOTPView(APIView):
    def post(self, request):
        try:
            user_id = request.data.get('user_id')
            user = User.objects.get(id=user_id)

            otp_code = GenerateOTPView.generate_otp_code()
            expired_at = timezone.now() + timedelta(minutes=5)

            OtpStore.objects.create(user=user, otp_code=otp_code, expired_at=expired_at)

            send_mail(
                subject='Resend OTP',
                message=f'Your OTP code is {otp_code}',
                from_email=settings.EMAIL_HOST_USER,
                recipient_list=[user.email],
                fail_silently=False
            )

            return Response({
                'message': 'New OTP has been sent successfully',
                'status': status.HTTP_201_CREATED
            }, status=status.HTTP_201_CREATED)

        except User.DoesNotExist:
            return Response({
                'message': 'User not found',
                'status': status.HTTP_404_NOT_FOUND
            }, status=status.HTTP_404_NOT_FOUND)

        except Exception as e:
            return Response({
                'message': f'Internal server error: {str(e)}',
                'status': status.HTTP_500_INTERNAL_SERVER_ERROR
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
