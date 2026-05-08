from django.urls import path

from . import views


urlpatterns = [
    path("match/", views.analyze_cv_match, name="analyze_cv_match"),
    path("rewrite/", views.rewrite_cv_section, name="rewrite_cv_section"),
    path("hr/interview-guide/", views.generate_hr_interview_guide, name="generate_hr_interview_guide"),
    path("hr/rank-cvs/", views.rank_hr_cvs, name="rank_hr_cvs"),
]
