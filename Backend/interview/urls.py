from django.urls import path
from . import views

urlpatterns = [
    path('start/', views.start_interview, name='start_interview'),
    path('answer/', views.submit_answer, name='submit_answer'),
    path('summary/<int:session_id>/', views.get_interview_summary, name='get_interview_summary'),
]
