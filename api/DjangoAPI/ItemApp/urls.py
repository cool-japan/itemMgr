from django.conf.urls import url
from ItemApp import views

from django.conf.urls.static import static
from django.conf import settings

urlpatterns=[
    url(r'^company$',views.companyApi),
    url(r'^company/([0-9]+)$',views.companyApi),

    url(r'^item$',views.itemApi),
    url(r'^item/([0-9]+)$',views.itemApi),

    url(r'^item/savefile',views.SaveFile)
]+static(settings.MEDIA_URL,document_root=settings.MEDIA_ROOT)
