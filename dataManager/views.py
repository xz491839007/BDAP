from django.shortcuts import render

def sqlsearch(request):
    return render(request, 'sqlsearch.html')

def hqlmanager(request):
    return render(request, 'hqlmanager.html')

def hqltasklist(request):
    return render(request, 'hqltasklist.html')
