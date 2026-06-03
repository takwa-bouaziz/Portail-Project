from django.contrib import admin

from .models import InterviewAnswer, InterviewQuestion, InterviewSession


class InterviewQuestionInline(admin.TabularInline):
    model = InterviewQuestion
    extra = 0


@admin.register(InterviewSession)
class InterviewSessionAdmin(admin.ModelAdmin):
    list_display = ("job_title", "user", "total_score", "created_at")
    list_filter = ("created_at",)
    search_fields = ("job_title", "user__username")
    inlines = [InterviewQuestionInline]


@admin.register(InterviewAnswer)
class InterviewAnswerAdmin(admin.ModelAdmin):
    list_display = ("question", "score")
    search_fields = ("answer_text", "feedback")
