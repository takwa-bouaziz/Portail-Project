from django.db import models

# Create your models here.
class CoverLetter(models.Model):
    candidate_name = models.CharField(max_length=100)
    job_title = models.CharField(max_length=100)
    company_name = models.CharField(max_length=100)
    cv_text = models.TextField()
    job_description = models.TextField()
    generated_letter = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.candidate_name} - {self.job_title}"