from django.db import models
from django.contrib.auth.models import User
    

class OtpStore(models.Model):
    """
    Model for storing OTP information, including the user, OTP code, and expiration time.
    
    Attributes:
        user (ForeignKey): The user associated with the OTP.
        otp_code (CharField): The OTP code.
        created_at (DateTimeField): The time when the OTP was created.
        expired_at (DateTimeField): The time when the OTP expires.
    """
    user= models.ForeignKey(User, on_delete=models.CASCADE, related_name='user_otp')
    otp_code = models.CharField(max_length=6, unique=True)
    created_at = models.DateTimeField(auto_now_add=True, editable=False)
    expired_at = models.DateTimeField()
    
    class Meta:
        get_latest_by = 'created_at'
        
    def __str__(self):
        return str(self.user)
