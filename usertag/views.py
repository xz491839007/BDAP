from django.shortcuts import render


def taglist(request):
    return render(request, 'tagList.html')

def rulelist(request):
    return render(request, 'rulelist.html')

def addtag(request):
    return render(request, 'tagAdd.html')