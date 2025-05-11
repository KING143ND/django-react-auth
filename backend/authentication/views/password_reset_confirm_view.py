from django.contrib.auth.models import User
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from authentication.serializers import SetNewPasswordSerializer
from utils.token import account_activation_token
from utils.exceptions import format_serializer_error


class PasswordResetConfirmView(APIView):
    def post(self, request, user_id, token):
        try:
            user = User.objects.get(pk=user_id)

            if not account_activation_token.check_token(user, token):
                return Response({
                    'message': 'Invalid or expired token.',
                    'status': status.HTTP_400_BAD_REQUEST
                }, status=status.HTTP_400_BAD_REQUEST)

            serializer = SetNewPasswordSerializer(data=request.data)
            if not serializer.is_valid():
                return format_serializer_error(serializer.errors)

            new_password = serializer.validated_data['new_password']
            user.set_password(new_password)
            user.save()

            return Response({
                'message': 'Password has been reset successfully.',
                'status': status.HTTP_200_OK
            }, status=status.HTTP_200_OK)

        except User.DoesNotExist:
            return Response({
                'message': 'User does not exist.',
                'status': status.HTTP_404_NOT_FOUND
            }, status=status.HTTP_404_NOT_FOUND)

        except Exception as e:
            return Response({
                'message': f'Internal server error: {str(e)}',
                'status': status.HTTP_500_INTERNAL_SERVER_ERROR
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
