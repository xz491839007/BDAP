from django.conf.urls import url
from usertag import views

urlpatterns = [
    url(r'^taglist', views.taglist, name="taglist"),
    url(r'^ruleList', views.rulelist, name="ruleList"),
    url(r'^addtag', views.addtag, name="addtag"),
    url(r'^addrule', views.addrule, name="addrule")
]
