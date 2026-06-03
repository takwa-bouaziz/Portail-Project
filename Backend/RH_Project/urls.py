
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/accounts/', include('accounts.urls')),
    path('api/cover-letter/', include('cover_letter.urls')),
    path('api/interview/', include('interview.urls')),
    path('api/cv-tools/', include('cv_tools.urls')),
]
