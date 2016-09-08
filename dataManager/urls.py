from django.conf.urls import url
from dataManager import views

urlpatterns = [
    url(r'^sqlsearch', views.sqlsearch, name="sqlsearch"),
    url(r'^hqlmanager', views.hqlmanager, name="hqlmanager"),
    url(r'^hqltasklist', views.hqltasklist, name="hqltasklist"),
]
