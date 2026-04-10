from django.urls import path

from . import views


urlpatterns = [
    path("match/", views.analyze_cv_match, name="analyze_cv_match"),
    path("rewrite/", views.rewrite_cv_section, name="rewrite_cv_section"),
]
