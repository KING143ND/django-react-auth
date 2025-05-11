from django.contrib.auth.models import User
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from authentication.serializers import ChangePasswordSerializer
from utils.exceptions import format_serializer_error


class ChangePasswordView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            new_password = request.data.get('new_password')
            confirm_password = request.data.get('confirm_password')

            try:
                user = User.objects.get(id=request.user.id)
            except User.DoesNotExist:
                return Response({
                    "message": "User does not exist.",
                    "status": status.HTTP_404_NOT_FOUND
                }, status=status.HTTP_404_NOT_FOUND)

            serializer = ChangePasswordSerializer(data=request.data)

            if not serializer.is_valid():
                return format_serializer_error(serializer.errors)

            if not new_password or not confirm_password:
                return Response({
                    'message': 'New password and confirm password are required.',
                    'status': status.HTTP_400_BAD_REQUEST
                }, status=status.HTTP_400_BAD_REQUEST)

            if new_password != confirm_password:
                return Response({
                    'message': 'New password and confirm password do not match.',
                    'status': status.HTTP_400_BAD_REQUEST
                }, status=status.HTTP_400_BAD_REQUEST)

            if len(new_password) < 8:
                return Response({
                    'message': 'Password must be at least 8 characters long.',
                    'status': status.HTTP_400_BAD_REQUEST
                }, status=status.HTTP_400_BAD_REQUEST)

            user.set_password(new_password)
            user.save()

            return Response({
                'message': 'Password changed successfully.',
                'status': status.HTTP_200_OK
            }, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({
                'message': str(e),
                'status': status.HTTP_500_INTERNAL_SERVER_ERROR
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
