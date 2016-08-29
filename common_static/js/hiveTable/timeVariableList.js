/**
 * Created by user on 16/6/20.
 */
require(['jquery','jquery.bootstrap','jquery.datetimepicker','common','quickSearch','app'],function($){
    var timeVariableList = {

        pageNo:1,

        pageSize:10,

        totalPage:0,

        totalRecords:0,

        selectId:"",

        init:function(){
            this.initEvent();
            this.getMarket();
        },

        initEvent:function(){
            var _this = this;

            $("#prevPage").click(function(){
                if(_this.pageNo <= 1){
                    return;
                }else{
                    _this.pageNo = _this.pageNo - 1;
                    _this.getMarket();
                }
            });

            $("#nextPage").click(function(){
                if(_this.pageNo >= _this.totalPage){
                    return;
                }
                _this.pageNo = _this.pageNo + 1;
                _this.getMarket();
            });

            $(".searchTh input").keydown(function(e){
                var e = e || window.event;
                if(e.keyCode == "13"){
                    _this.pageNo = 1;
                    _this.getMarket();
                }
            });

            $("#taskTableList").delegate(".fa-cog","click",function(){
                var id = $(this).parent().attr("data-id");
                _this.selectId = id;
                _this.showModifyModal(id);
            });

            $("#taskTableList").delegate(".fa-times","click",function(){
                var id = $(this).parent().attr("data-id");
                $.showModal({
                    content:"确认要删除该时间变量吗",
                    closeCallBack:null,
                    sureCallBack:function(){
                        _this.deleteMarket(id);
                    },
                    title:"提示信息",
                    closeName:"取消",
                    sureName:"删除"
                });
            });

            $("#addTime").click(function(){
                $("#marketMadel").modal("toggle");
            });

            $("#addMarket").click(function(){
                _this.saveMarket();
            });

            $("#modifyMarket").click(function(){
                _this.modifyMarket();
            });
        },

        showModifyModal:function(id){
            showloading(true);
            $.ajax({
                type: "get",
                url: "/sentosa/transform/kv/get",
                data: {
                    id:id
                },
                success: function (result) {
                    showloading(false);
                    if(result && result.success){
                        var dat = result.pairs.dat;
                        $("#marketMadelModify").modal("toggle");
                        $("#mname").val(dat.name);
                        $("#mgongshi").val(dat.value);
                        $("#mdesc").val(dat.note);
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

        modifyMarket:function(){
            var name = $("#mname").val();
            var gongshi = $("#mgongshi").val();
            var desc = $("#mdesc").val();

            if($.trim(gongshi) == ""){
                showTip("变量公式");
                return;
            }
            if($.trim(desc) == ""){
                showTip("描述不能为空");
                return;
            }
            var _this = this;
            showloading(true);
            var data = {
                id:this.selectId,
                name:name,
                value:gongshi,
                note:desc
            };
            $("#marketMadelModify").modal("hide");
            $.ajax({
                type: "post",
                url: "/sentosa/transform/kv/modify",
                data: data,
                success: function (result) {
                    showloading(false);
                    if(result && result.success){
                        showTip("修改成功.");
                        $("#mname").val("");
                        $("#mgongshi").val("");
                        $("#mdesc").val("");
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
                url: "/sentosa/transform/kv/delete",
                data: {
                    id:id
                },
                success: function (result) {
                    showloading(false);
                    if(result && result.success){
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
            var name = $("#name").val();
            var gongshi = $("#gongshi").val();
            var desc = $("#desc").val();

            if($.trim(name) == ""){
                showTip("变量名称不能为空");
                return;
            }
            if($.trim(gongshi) == ""){
                showTip("变量公式");
                return;
            }
            if($.trim(desc) == ""){
                showTip("描述不能为空");
                return;
            }
            var _this = this;
            showloading(true);
            var data = {
                name:name,
                value:gongshi,
                note:desc
            };
            $.ajax({
                type: "post",
                url: "/sentosa/transform/kv/create",
                data: data,
                success: function (result) {
                    showloading(false);
                    if(result && result.success){
                        showTip("保存成功.");
                        $("#name").val("");
                        $("#gongshi").val("");
                        $("#desc").val("");
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
                type: "post",
                url: "/sentosa/transform/kv/list",
                data: {
                    name:$("#sname").val(),
                    value:$("#sgongshi").val(),
                    note:$("#sdesc").val(),
                    creator:$("#screator").val(),
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
            $("#currentPageNum").html(this.pageNo);
            $("#totalPageNum").html(this.totalPage);
            $("#totalNum").html(this.totalRecords);
            var data = dat.results;

            var strHtml = "";
            for(var i=0;i<data.length;i++){
                var sHtml = '<tr>'
                    +'<td>'+data[i].name+'</td>'
                    +'<td>'+data[i].value+'</td>'
                    +'<td>'+data[i].note+'</td>'
                    +'<td>'+data[i].creator+'</td>'
                    +'<td data-id="'+data[i].id+'">'
                    +'<i class="fa fa-fw fa-cog pull-left modify "></i>'
                    +'<i class="fa fa-fw fa-times pull-left delete "></i>'
                    +'</td>'
                    +'</tr>';
                strHtml = strHtml  + sHtml;
            }
            $("#taskTableList").html(strHtml);
        }


    };
    timeVariableList.init();
});
