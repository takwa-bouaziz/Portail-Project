from django.conf import settings
from django.db import models


class CvMatchAnalysis(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="cv_match_analyses",
        null=True,
        blank=True,
    )
    cv_text = models.TextField()
    job_description = models.TextField()
    matching_score = models.IntegerField(default=0)
    matching_summary = models.TextField(blank=True)
    strengths = models.JSONField(default=list, blank=True)
    missing_skills = models.JSONField(default=list, blank=True)
    improvement_suggestions = models.JSONField(default=list, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"CV match {self.matching_score}% - {self.created_at}"


class CvRewriteResult(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="cv_rewrite_results",
        null=True,
        blank=True,
    )
    section_name = models.CharField(max_length=100)
    target_role = models.CharField(max_length=150, blank=True)
    original_text = models.TextField()
    rewritten_text = models.TextField()
    improvement_notes = models.JSONField(default=list, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"CV rewrite - {self.section_name}"


class HrInterviewGuide(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="hr_interview_guides",
        null=True,
        blank=True,
    )
    job_title = models.CharField(max_length=150)
    job_description = models.TextField()
    questions = models.JSONField(default=list, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Guide entretien - {self.job_title}"


class HrCvRanking(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="hr_cv_rankings",
        null=True,
        blank=True,
    )
    job_title = models.CharField(max_length=150)
    job_description = models.TextField()
    candidates = models.JSONField(default=list, blank=True)
    ranking = models.JSONField(default=list, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Classement CV - {self.job_title}"
