from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.http import require_http_methods

from hive_service import ThriftHive
from thrift import Thrift
from thrift.transport import TSocket
from thrift.transport import TTransport
from thrift.protocol import TBinaryProtocol
import json



def taglist(request):
    return render(request, 'tagList.html')

def rulelist(request):
    return render(request, 'rulelist.html')

def addtag(request):
    return render(request, 'tagAdd.html')

def addrule(request):
    return render(request, "addRule.html")

def showall(request):
    # try:
    #     transport = TSocket.TSocket("127.0.0.1", 10000)
    #     transport = TTransport.TBufferedTransport(transport)
    #     prtocol = TBinaryProtocol.TBinaryProtocol(transport)
    #     client = ThriftHive.Client(prtocol)
    #     transport.open()
    #     client.execute("select name from posttypes")
    #
    #     print "The return value is:"
    #     for item in client.fetchAll():
    #         print item
    #     transport.close()
    #
    # except Thrift.TException, tx:
    #     print '%s' %(tx.message)

    result = {}
    result["success"] = True
    result["data"] = ["a1","a2","a3","a4"]
    return JsonResponse(result)

def tablelist(request):
    result = {}
    result["success"] = True
    result["data"] = ["b1", "b2", "b3", "b4"]
    return JsonResponse(result)

def columnlist(request):
    result = {}
    result["success"] = True
    result["data"] = ["c1", "c2", "c3", "c4"]
    return JsonResponse(result)

@require_http_methods(["POST"])
def createtag(request):
    req = json.loads(request.body)
    print req
    return JsonResponse(req)
