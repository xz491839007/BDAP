/**
 * Created by user on 16/6/20.
 */
require(['jquery','jquery.bootstrap','jquery.datetimepicker','common','quickSearch','app'],function($){
    var marketList = {

        pageNo:1,

        pageSize:100,

        selectId:"",

        init:function(){
            this.initEvent();
            this.getMarket();
        },

        initEvent:function(){
            var _this = this;

            $("#showAddMarket").click(function(){
                $("#marketMadel").modal("toggle");
            });

            $("#addMarket").click(function(){
                _this.saveMarket();
            });

            $("#leftMarket").delegate('a','click',function(){
                $("#leftMarket .fa-tablet").removeClass("text-light-blue");
                $(this).find(".fa-tablet").addClass("text-light-blue");
                _this.pageNo = 1;

                if(_this.selectId == $(this).attr("data-id")){
                    return;
                }

                _this.selectId = $(this).attr("data-id");
                _this.getKuInfo();
            });
            $("#leftMarket").delegate(".delete","click",function(){
                var id = $(this).parent().attr("data-id");
                $.showModal({
                    content:"确认要删除改节点么",
                    closeCallBack:null,
                    sureCallBack:function(){
                        _this.deleteMarket(id);
                    },
                    title:"提示信息",
                    closeName:"取消",
                    sureName:"确认"
                });
            });

            $("#leftMarket").delegate(".modify","click",function(){
                var id = $(this).parent().attr("data-id");
                _this.selectId = id;
                $("#mname").val($(this).parent().attr("data-name"));
                $("#node").val($(this).parent().attr("data-desc"));
                $("#marketMadelModify").modal("toggle");
            });

            $("#modifyMarket").click(function(){
                _this.modifyMarket();
            });
        },

        modifyMarket:function(){
            var desc = $("#node").val();
            if($.trim(desc) == ""){
                showTip("集市描述不能为空");
                return;
            }
            var _this = this;
            showloading(true);
            var data = {
                id:_this.selectId,
                note:desc
            };

            $("#marketMadelModify").modal("hide");
            $.ajax({
                type: "post",
                url: "/sentosa/market/modify",
                dataType:"json",
                contentType: 'application/json',
                data: JSON.stringify(data),
                success: function (result) {
                    showloading(false);
                    if(result && result.success){
                        showTip("修改成功.");
                        _this.getMarket();
                    }else{
                        $.showModal({content:result.message});
                    }
                },
                error:function(a,b,c){
                    showloading(false);
                    alert(a.responseText);
                }
            });
        },

        deleteMarket:function(id){
            var _this = this;
            showloading(true);
            $.ajax({
                type: "post",
                url: "/sentosa/market/delete",
                data: {
                    marketId:id
                },
                success: function (result) {
                    showloading(false);
                    if(result && result.success){
                        if(id == _this.selectId){
                            _this.selectId = "";
                        }
                        _this.getMarket();
                    }else{
                        $.showModal({content:"删除失败:"+result.message});
                    }
                },
                error:function(a,b,c){
                    showloading(false);
                    alert(a.responseText);
                }
            });
        },

        saveMarket:function(){
            var marketName = $("#marketName").val();
            var desc = $("#desc").val();
            if($.trim(marketName) == ""){
                showTip("集市名不能为空");
                return;
            }
            if($.trim(desc) == ""){
                showTip("集市描述不能为空");
                return;
            }
            var _this = this;
            showloading(true);
            var data = {
                name:marketName,
                note:desc
            };
            $.ajax({
                type: "post",
                url: "/sentosa/market/create",
                dataType:"json",
                contentType: 'application/json',
                data: JSON.stringify(data),
                success: function (result) {
                    showloading(false);
                    if(result && result.success){
                        showTip("保存成功.");
                        $("#marketMadel").modal("hide");
                        _this.getMarket();
                    }else{
                        $.showModal({content:result.message});
                    }
                },
                error:function(a,b,c){
                    showloading(false);
                    alert(a.responseText);
                }
            });

        },

        getMarket:function(){
            var _this = this;
            showloading(true);
            $.ajax({
                type: "get",
                url: "/sentosa/market/list",
                data: {
                    name:"",
                    note:"",
                    pageNo:_this.pageNo,
                    pageSize:_this.pageSize
                },
                success: function (result) {
                    showloading(false);
                    if(result && result.success){
                        var dat = result.pairs.dat;
                        _this.setDataList(dat);
                    }else{
                        $.showModal({content:result.message});
                    }
                },
                error:function(a,b,c){
                    showloading(false);
                    alert(a.responseText);
                }
            });
        },
        setDataList:function(dat){
            this.totalPage = dat.totalPage;
            this.totalRecords = dat.totalRecords;
            var data = dat.results;
            if(data.length<=0){
                return;
            }
            var strHtml = "";
            for(var i=0;i<data.length;i++){
                var selectStr = "";
                if(this.selectId == "" && i == 0){
                    this.selectId = data[i].id;
                    selectStr = "text-light-blue";
                }else if(this.selectId == data[i].id){
                    selectStr = "text-light-blue";
                }
                var sHtml = '<li>'
                    +'<a href="javascript:void(0);" data-id="'+data[i].id+'" data-name="'+data[i].name+'" data-desc="'+data[i].note+'">'
                    +'<i class="fa fa-tablet '+ selectStr+'"></i>'+data[i].name
                    +'<i class="fa fa-fw fa-times pull-right delete "></i>'
                    +'<i class="fa fa-fw fa-cog pull-right modify "></i>'
                    +'</a>'
                    +'</li>';
                strHtml = strHtml  + sHtml;

            }
            $("#leftMarket").html(strHtml);
            this.getKuInfo();
        },

        getKuInfo:function(){
            var _this = this;
            showloading(true);
            $.ajax({
                type: "get",
                url: "/sentosa/market/get",
                data: {
                    marketId:_this.selectId,
                    cascade:"true"
                },
                success: function (result) {
                    showloading(false);
                    if(result && result.success){
                        var dat = result.pairs.dat;
                        if(!dat) return;
                        _this.setKuTable(dat);
                    }else{
                        $.showModal({content:result.message});
                    }
                },
                error:function(a,b,c){
                    showloading(false);
                    alert(a.responseText);
                }
            });
        },

        //taskTableList
        setKuTable:function(dat){
            var data = dat.dbList;
            var strHtml = "";
            for(var i=0;i<data.length;i++){
                var sHtml = '<tr>'
                    +'<td>'+data[i].name+'</td>'
                    +'<td>'+data[i].creator+'</td>'
                    +'<td>'+new Date(data[i].timestamp).Format('yyyy-MM-dd hh:mm:ss')+'</td>'
                    +'<td>'+data[i].note+'</td>'
                    +'</tr>';
                strHtml = strHtml  + sHtml;
            }
            $("#taskTableList").html(strHtml);
        }


    };
    marketList.init();
});
