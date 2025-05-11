from django.contrib import admin
from authentication.models import OtpStore


@admin.register(OtpStore)
class OtpStoreAdmin(admin.ModelAdmin):
    list_display = ['user', 'otp_code', 'created_at', 'expired_at']
    list_filter = ['created_at', 'expired_at']
    search_fields = ['user__username', 'user__email', 'user__first_name', 'user__last_name', 'otp_code']
    readonly_fields = ['created_at', 'expired_at']
    