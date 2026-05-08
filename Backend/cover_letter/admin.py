from django.contrib import admin

from .models import CoverLetter


@admin.register(CoverLetter)
class CoverLetterAdmin(admin.ModelAdmin):
    list_display = ("candidate_name", "job_title", "company_name", "user", "created_at")
    list_filter = ("created_at",)
    search_fields = ("candidate_name", "job_title", "company_name", "user__username")
