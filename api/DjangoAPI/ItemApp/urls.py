from django.urls import path, re_path
from ItemApp import views

from django.conf.urls.static import static
from django.conf import settings

urlpatterns=[
    re_path(r'^company$', views.companyApi),
    re_path(r'^company/([0-9]+)$', views.companyApi),

    re_path(r'^item$', views.itemApi),
    re_path(r'^item/([0-9]+)$', views.itemApi),

    re_path(r'^item/savefile$', views.SaveFile)
]+static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)