"""
URL configuration for backend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/6.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
urlpatterns = [
    path('admin/', admin.site.urls),
    path('users/', include('users.urls')),
    path('core/', include('core.urls')),
]
if settings.DEBUG:
    urlpatterns += static(
        settings.MEDIA_URL,
        document_root=settings.MEDIA_ROOT
    )
#patient token
# eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzc4MzA3NjE2LCJpYXQiOjE3NzgzMDQwMTYsImp0aSI6IjkyZWY2MWJiYzRlZjRiY2Y5ODUzNDk2N2ZhNTFkMGQyIiwidXNlcl9pZCI6IjExIn0.NlcGAwb_GmhAi5kdNRRNG4Wf75lKZ3WqGsxXQXAu9gs
#doctor token
#eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzc4MzA3NzQ4LCJpYXQiOjE3NzgzMDQxNDgsImp0aSI6IjcxNzM0N2VjYjBkNzQyMDg4NjE0MWViYjM2OWQyYzU4IiwidXNlcl9pZCI6IjEyIn0.tM2Zlk4aTSSOiFIipi3CKDIMr71B7_mJDW9NTWhncbY