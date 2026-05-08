from django.conf import settings
from django.db import models

class InterviewSession(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='interview_sessions',
        null=True,
        blank=True,
    )
    job_title = models.CharField(max_length=100)
    cv_text = models.TextField()
    total_score = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Entretien: {self.job_title} - {self.created_at}"

class InterviewQuestion(models.Model):
    session = models.ForeignKey(InterviewSession, on_delete=models.CASCADE, related_name='questions')
    question_text = models.TextField()
    order = models.IntegerField(default=1)

    def __str__(self):
        return f"Q{self.order}: {self.question_text[:50]}"

class InterviewAnswer(models.Model):
    question = models.ForeignKey(InterviewQuestion, on_delete=models.CASCADE, related_name='answers')
    answer_text = models.TextField()
    feedback = models.TextField(blank=True, null=True)
    score = models.IntegerField(default=0) # Score sur 10

    def __str__(self):
        return f"Reponse a Q{self.question.order}"
