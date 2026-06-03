from django.contrib import admin

from .models import CvMatchAnalysis, CvRewriteResult, HrCvRanking, HrInterviewGuide


@admin.register(CvMatchAnalysis)
class CvMatchAnalysisAdmin(admin.ModelAdmin):
    list_display = ("id", "user", "matching_score", "created_at")
    list_filter = ("created_at",)
    search_fields = ("user__username", "matching_summary")


@admin.register(CvRewriteResult)
class CvRewriteResultAdmin(admin.ModelAdmin):
    list_display = ("id", "user", "section_name", "target_role", "created_at")
    list_filter = ("section_name", "created_at")
    search_fields = ("user__username", "section_name", "target_role")


@admin.register(HrInterviewGuide)
class HrInterviewGuideAdmin(admin.ModelAdmin):
    list_display = ("id", "user", "job_title", "created_at")
    search_fields = ("user__username", "job_title")


@admin.register(HrCvRanking)
class HrCvRankingAdmin(admin.ModelAdmin):
    list_display = ("id", "user", "job_title", "created_at")
    search_fields = ("user__username", "job_title")
