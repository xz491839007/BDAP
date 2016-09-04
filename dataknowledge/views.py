from django.shortcuts import render

# Create your views here.

def hivetablelist(request):
    return render(request, 'hiveTableList.html')

def tagmanage(request):
    return render(request, 'tagManage.html')

def timevariableList(request):
    return render(request, 'timeVariableList.html')

def addrule(request):
    return render(request, "addRule.html")