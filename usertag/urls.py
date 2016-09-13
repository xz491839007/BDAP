from django.conf.urls import url
from usertag import views

urlpatterns = [
    url(r'^taglist', views.taglist, name="taglist"),
    url(r'^ruleList', views.rulelist, name="ruleList"),
    url(r'^addtag', views.addtag, name="addtag"),
    url(r'^addrule', views.addrule, name="addrule"),
    url(r'^showall', views.showall, name="showall"),
    url(r'^tablelist', views.tablelist, name="tablelist"),
    url(r'^columnlist', views.columnlist, name="columnlist"),
    url(r'^createtag', views.createtag, name="createtag"),
    url(r'^label/list', views.labellist, name="labellist"),
    url(r'^label/delete', views.delete, name="delete"),
]
