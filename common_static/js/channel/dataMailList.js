/**
 * Created by user on 16/6/20.
 */
require(['jquery','jquery.bootstrap','jquery.datetimepicker','common','quickSearch','app'],function($){
    var dataMailList = {

        pageNo:1,

        pageSize:10,

        totalPage:0,

        totalRecords:0,

        init:function(){
            //this.initEvent();
            //this.getTaskList();
            $("#addDataMail").click(function(){
                location.href = "dataMailAdd.html";
            });
        },

        initEvent:function(){
            var _this = this;
            $("#addDataMail").click(function(){
                location.href = "dataMailAdd.html";
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

            $("#prevPage").click(function(){
                if(_this.pageNo <= 1){
                    return;
                }else{
                    _this.pageNo = _this.pageNo - 1;
                    _this.getTaskList();
                }
            });

            $("#nextPage").click(function(){
                if(_this.pageNo >= _this.totalPage){
                    return;
                }
                _this.pageNo = _this.pageNo + 1;
                _this.getTaskList();
            });
            $(".searchTh input").keydown(function(e){
                var e = e || window.event;
                if(e.keyCode == "13"){
                    _this.pageNo = 1;
                    _this.getTaskList();
                }
            });

            $("#dblistTable").delegate(".modify","click",function(){
                if($(this).hasClass("faDisabled")){
                    return;
                }
                location.href = "exportDBModify.html?id="+$(this).parent().attr("data-id");
            });
            $("#dblistTable").delegate(".delete","click",function(){
                if($(this).hasClass("faDisabled")){
                    return;
                }
                if(confirm("是否要删除该节点?")){
                    _this.deleteTask($(this).parent().attr("data-id"));
                }
            });
        },

        deleteTask:function(id){
            var _this = this;
            showloading(true);
            $.ajax({
                type: "post",
                url: "/sentosa/transform/sqoop/deleteSqoop",
                data: {
                    sqoopId:id
                },
                success: function (result) {
                    showloading(false);
                    if(result && result.success){
                        showTip("删除成功");
                        _this.getTaskList();
                    }else{
                        $.showModal({content:"删除失败"+result.message});
                    }
                },
                error:function(a,b,c){
                    showloading(false);
                    alert(a.responseText);
                }
            });
        },

        getTaskList:function(){
            var _this = this;
            var taskName = $("#taskName").val();
            var tableName = $("#tableName").val();
            var fuzeren = $("#fuzeren").val();
            var desc = $("#desc").val();
            //var createTime = (new Date($("#createTime").val())).getTime();
            var sqoop = {};
            sqoop.sqoopName = taskName;
            sqoop.hiveTable = tableName;
            sqoop.administrator = fuzeren;
            sqoop.describe = desc;
            sqoop.sqoopType = "export";//export
            showloading(true);
            $.ajax({
                type: "post",
                url: "/sentosa/transform/sqoop/listSqoop/"+_this.pageSize+"/"+_this.pageNo,
                dataType:"json",
                contentType: 'application/json',
                data: JSON.stringify(sqoop),
                success: function (result) {
                    showloading(false);
                    if(result && result.success){
                        var dat = result.pairs.pageModel;
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
                var statusStr = data[i].status==0?"":"faDisabled";
                var opeFa = '<i class="fa fa-fw fa-cog pull-left myfabut modify '+statusStr+'"></i>'
                    +'<i class="fa fa-fw fa-times pull-left myfabut delete '+statusStr+'"></i>';
                var sHtml = '<tr>'
                    +'<td title="'+data[i].sqoopName+'">'+data[i].sqoopName+'</td>'
                    +'<td title="'+data[i].hiveTable+'">'+data[i].hiveTable+'</td>'
                    +'<td title="'+data[i].administrator+'">'+data[i].administrator+'</td>'
                    +'<td title="'+data[i].describe+'">'+data[i].describe+'</td>'
                    +'<td title="'+(new Date(data[i].createTime)).Format("yyyy-MM-dd hh:mm:ss")+'">'+(new Date(data[i].createTime)).Format("yyyy-MM-dd hh:mm:ss")+'</td>'
                    +'<td data-id="'+data[i].sqoopId+'" style="width:120px;">'
                    + opeFa
                    +'</td>'
                    +'</tr>';
                strHtml = strHtml  + sHtml;
            }
            $("#dblistTable").html(strHtml);
        }

    };
    dataMailList.init();
});
