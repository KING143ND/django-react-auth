from rest_framework import serializers
from django.contrib.auth.models import User


class ChangePasswordSerializer(serializers.Serializer):
    model = User
    new_password = serializers.CharField(required=True)
    confirm_password = serializers.CharField(required=True)
    