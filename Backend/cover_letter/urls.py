from django.urls import path
from . import views

urlpatterns = [
    path('generate/', views.generate_cover_letter, name='generate_cover_letter'),
    path('<int:pk>/', views.get_cover_letter, name='get_cover_letter'),
]
