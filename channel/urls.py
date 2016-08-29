from django.conf.urls import url
from channel import views

urlpatterns = [
    url(r'^DBtoHiveAdd', views.DBtoHiveAdd, name="DBtoHiveAdd"),
    url(r'^DBtoHiveModify', views.DBtoHiveModify, name="DBtoHiveModify"),
    url(r'^exportDB', views.exportDB, name="exportDB"),
    url(r'^exportDBList', views.exportDBList, name="exportDBList"),
    url(r'^exportDBModify', views.exportDBModify, name="exportDBModify"),
    url(r'^importDBList', views.importDBList, name="importDBList"),
    url(r'^importHiveHiveList', views.importHiveHiveList, name="importHiveHiveList"),
    url(r'^upload', views.upload, name="upload"),
    url(r'^uploadInfo', views.uploadInfo, name="uploadInfo"),
    url(r'^uploadList', views.uploadList, name="uploadList"),
]

