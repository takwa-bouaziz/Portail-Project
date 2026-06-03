from django.urls import path

from . import views


urlpatterns = [
    path("register/", views.register_user, name="register_user"),
    path("login/", views.login_user, name="login_user"),
    path("logout/", views.logout_user, name="logout_user"),
    path("me/", views.current_user, name="current_user"),
    path("history/", views.user_history, name="user_history"),
]
