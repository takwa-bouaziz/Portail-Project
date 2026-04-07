
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/cover-letter/', include('cover_letter.urls')),
    path('api/interview/', include('interview.urls')),
]
