from rest_framework import serializers
from authentication.models import OtpStore


class OTPSerializer(serializers.ModelSerializer):
    class Meta:
        model = OtpStore
        fields = ['user', 'otp_code', 'created_at', 'expired_at']
