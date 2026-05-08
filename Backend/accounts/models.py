from django.conf import settings
from django.db import models


class UserProfile(models.Model):
    CANDIDATE = "candidat"
    HR_ADVISOR = "conseiller_rh"

    ROLE_CHOICES = [
        (CANDIDATE, "Candidat"),
        (HR_ADVISOR, "Conseiller RH"),
    ]

    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="profile",
    )
    role = models.CharField(max_length=30, choices=ROLE_CHOICES, default=CANDIDATE)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} - {self.get_role_display()}"
