/**
 * Created by user on 16/6/20.
 */
require(['jquery','jquery.bootstrap','jquery.datetimepicker','common','quickSearch','app'],function($){
    var dbList = {

        pageNo:1,

        pageSize:10,

        totalPage:0,

        totalRecords:0,

        init:function(){
            this.initEvent();
            this.getDBList();
        },

        initEvent:function(){
            var _this = this;
            $("#addDB").click(function(){
                $("#chooseTypeModal").modal("toggle");
            });
            $('#createTime').datetimepicker({
                format: "yyyy-mm-dd",
                autoclose: true,
                todayBtn: true,
                todayHighlight: true,
                showMeridian: true,
                minView:2,
                pickerPosition: "bottom-right",
                language: "zh-CN"
            });

            $("#sureAddDB").click(function(){
                var selectRadio = $("input[name='dbtype']:checked").val();
                if(selectRadio == 1){
                    location.href = 'dbAddOne.html';
                }else{
                    location.href = 'dbAddMore.html';
                }
            });

            $("#search").click(function(){
                _this.pageNo = 1;
                _this.getDBList();
            });

            $("#prevPage").click(function(){
                if(_this.pageNo <= 1){
                    return;
                }else{
                    _this.pageNo = _this.pageNo - 1;
                    _this.getDBList();
                }
            });

            $("#nextPage").click(function(){
                if(_this.pageNo >= _this.totalPage){
                    return;
                }
                _this.pageNo = _this.pageNo + 1;
                _this.getDBList();
            });

            $("#DBlistTable").delegate(".modify","click",function(){
                var groupId = $(this).parent().attr("data-groupId");
                var isMulti = $(this).parent().attr("data-isMulti");
                debugger;
                if(isMulti == 0){
                    location.href = "dbModifyOne.html?groupId="+groupId;
                }else{
                    location.href = "dbModifyMore.html?groupId="+groupId;
                }

            });
            $("#DBlistTable").delegate(".delete","click",function(){
                var groupId = $(this).parent().attr("data-groupId");
                var name = $(this).parent().attr("data-name");
                $.showModal({
                    content:name,
                    closeCallBack:null,
                    sureCallBack:function(){
                        _this.deleteDB(groupId);
                    },
                    title:"提示信息"
                });
            });
        },

        deleteDB:function(groupId){
            var _this = this;
            $.ajax({
                type: "POST",
                url: "/sentosa/metadata/group/delete",
                data: {
                    groupId:groupId
                },
                success: function (result) {
                    showloading(false);
                    if(result && result.success){
                        showTip("删除成功!");
                        _this.getDBList();
                    }else{
                        $.showModal({content:"删除失败"});
                    }
                },
                error:function(a,b,c){
                    showloading(false);
                    alert(a.responseText);
                }
            });
        },

        getDBList:function(){
            var _this = this;
            var DBjianjie = $("#DBjianjie").val();
            var desc = $("#desc").val();
            var isMulti = $("#isMulti").val();
            var createTime = $("#createTime").val();
            showloading(true);
            $.ajax({
                type: "get",
                url: "/sentosa/metadata/group/list",
                data: {
                    name: DBjianjie,
                    note: desc,
                    isMulti:isMulti,
                    createTimeFormat:createTime,
                    pageNo:_this.pageNo,
                    pageSize:_this.pageSize
                },
                success: function (result) {
                    showloading(false);
                    if(result && result.success){
                        var dat = result.pairs.dat;
                        _this.setDataList(dat);
                    }else{
                        $.showModal({content:"查询失败"});
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
                    +'<td>'+data[i].note+'</td>'
                    +'<td>'+data[i].creator+'</td>'
                    +'<td>'+(data[i].isMulti==0?'单库':'多库')+'</td>'
                    +'<td>'+new Date(data[i].timestamp).Format('yyyy-MM-dd hh:mm:ss')+'</td>'
                    +'<td data-groupId="'+data[i].id+'" data-isMulti="'+data[i].isMulti+'" data-name="'+data[i].name+'">'
                    +'<i class="fa fa-fw fa-cog pull-left modify"></i>'
                    +'<i class="fa fa-fw fa-times pull-left delete"></i>'
                    +'</td>'
                    +'</tr>'
                strHtml = strHtml  + sHtml;
            }
            $("#DBlistTable").html(strHtml);
        },

        chooseTypeModal:function(){

        }

    }
    dbList.init();
});
