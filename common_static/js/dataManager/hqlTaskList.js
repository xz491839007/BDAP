/**
 * Created by user on 16/6/20.
 */
require(['jquery','jquery.bootstrap','jquery.datetimepicker','common','quickSearch','app'],function($){
    var hqlTaskList = {

        pageNo:1,

        pageSize:10,

        totalPage:0,

        totalRecords:0,

        init:function(){
            this.initEvent();
            this.getHqlList();
        },

        initEvent:function(){
            var _this = this;

            $("#prevPage").click(function(){
                if(_this.pageNo <= 1){
                    return;
                }else{
                    _this.pageNo = _this.pageNo - 1;
                    _this.getHqlList();
                }
            });

            $("#nextPage").click(function(){
                if(_this.pageNo >= _this.totalPage){
                    return;
                }
                _this.pageNo = _this.pageNo + 1;
                _this.getHqlList();
            });

            $(".searchTh input").keydown(function(e){
                var e = e || window.event;
                if(e.keyCode == "13"){
                    _this.pageNo = 1;
                    _this.getHqlList();
                }
            });
            $(".searchTh select").change(function(e){
                _this.pageNo = 1;
                _this.getHqlList();
            });

            $("#taskTableList").delegate(".modify","click",function(){
                if($(this).hasClass("faDisabled")){
                    return;
                }
                location.href = "hqlTaskInfo.html?id="+$(this).parent().attr("data-id");
            });
            $("#taskTableList").delegate(".delete","click",function(){
                if($(this).hasClass("faDisabled")){
                    return;
                }
                if(confirm("是否要删除该节点?")){
                    _this.deleteTask($(this).parent().attr("data-id"),$(this).parent().attr("data-taskId"));
                }
            });
        },

        deleteTask:function(id,taskId){
            var _this = this;
            var script ={
                id:id,
                taskId:taskId
            };
            showloading(true);
            $.ajax({
                type: "post",
                url: "/sentosa/transform/script/deleteScript",
                dataType:"json",
                contentType: 'application/json',
                data: JSON.stringify(script),
                success: function (result) {
                    showloading(false);
                    if(result && result.success){
                        _this.getHqlList();
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

        getHqlList:function(firstMenuId){
            var _this = this;
            var script ={
                name:$("#name").val(),
                administrator:$("#fuzeren").val(),
                describe:$("#desc").val(),
            };
            showloading(true);
            $.ajax({
                type: "post",
                url: "/sentosa/transform/script/listScript/"+_this.pageSize + "/"+this.pageNo,
                dataType:"json",
                contentType: 'application/json',
                data: JSON.stringify(script),
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
                var sHtml = '<tr>'
                    +'<td>'+data[i].name+'</td>'
                    +'<td>'+new Date(data[i].createTime).Format('yyyy-MM-dd hh:mm:ss')+'</td>'
                    +'<td>'+data[i].administrator+'</td>'
                    +'<td>'+data[i].describe+'</td>'
                    +'<td data-id="'+data[i].id+'" data-taskId="'+data[i].taskId+'">'
                    +'<i class="fa fa-fw fa-cog pull-left modify '+statusStr+'"></i>'
                    +'<i class="fa fa-fw fa-times pull-left delete '+statusStr+'"></i>'
                    +'</td>'
                    +'</tr>'
                strHtml = strHtml  + sHtml;
            }
            $("#taskTableList").html(strHtml);
        }

    }
    hqlTaskList.init();
});
