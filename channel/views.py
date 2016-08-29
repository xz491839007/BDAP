from django.shortcuts import render

def DBtoHiveAdd(request):
    return render(request, 'DBtoHiveAdd.html')

def DBtoHiveModify(request):
    return render(request, 'DBtoHiveModify.html')

def exportDB(request):
    return render(request, 'exportDB.html')

def exportDBList(request):
    return render(request, 'exportDBList.html')

def exportDBModify(request):
    return render(request, 'exportDBModify.html')

def importDBList(request):
    return render(request, 'importDBList.html')

def importHiveHiveList(request):
    return render(request, 'importHiveHiveList.html')

def upload(request):
    return render(request, 'upload.html')

def uploadInfo(request):
    return render(request, 'uploadInfo.html')

def uploadList(request):
    return render(request, 'uploadList.html')
