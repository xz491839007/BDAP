/**
 * Created by user on 16/6/20.
 */
require(['jquery','jquery.bootstrap','jquery.datetimepicker','common','quickSearch','app'],function($){
    var quotaList = {

        pageNo:1,

        pageSize:10,

        totalPage:0,

        totalRecords:0,

        init:function(){
            this.initEvent();
            this.getQuotaList();
        },

        initEvent:function(){
            var _this = this;
            $("#addQuota").click(function(){
                location.href = "quotaAdd.html";
            });

            $("#prevPage").click(function(){
                if(_this.pageNo <= 1){
                    return;
                }else{
                    _this.pageNo = _this.pageNo - 1;
                    _this.getQuotaList();
                }
            });

            $("#nextPage").click(function(){
                if(_this.pageNo >= _this.totalPage){
                    return;
                }
                _this.pageNo = _this.pageNo + 1;
                _this.getQuotaList();
            });

            $(".searchTh input").keydown(function(e){
                var e = e || window.event;
                if(e.keyCode == "13"){
                    _this.pageNo = 1;
                    _this.getQuotaList();
                }
            });
            $(".searchTh select").change(function(e){
                _this.pageNo = 1;
                _this.getQuotaList();
            });

            $("#taskTableList").delegate(".modify","click",function(){
                if($(this).hasClass("faDisabled")){
                    return;
                }
                location.href = "quotaModify.html?id="+$(this).parent().attr("data-id");
            });
            $("#taskTableList").delegate(".delete","click",function(){
                if($(this).hasClass("faDisabled")){
                    return;
                }
                var id = $(this).parent().attr("data-id");
                $.showModal({
                    content:"确认要删除改节点么",
                    closeCallBack:null,
                    sureCallBack:function(){
                        _this.deleteTask(id);
                    },
                    title:"提示信息",
                    closeName:"取消",
                    sureName:"确认"
                });
            });
        },

        deleteTask:function(id){
            var _this = this;
            showloading(true);
            $.ajax({
                type: "post",
                url: "/sentosa/metadata/quota/delete",
                data: {
                    id:id
                },
                success: function (result) {
                    showloading(false);
                    if(result && result.success){
                        _this.getQuotaList();
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

        getQuotaList:function(firstMenuId){
            var _this = this;
            showloading(true);
            $.ajax({
                type: "post",
                url: "/sentosa/metadata/quota/list",
                data: {
                    name:$("#ename").val(),
                    chineseName:$("#cname").val(),
                    creator:$("#fuzeren").val(),
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
                    +'<td>'+data[i].chineseName+'</td>'
                    +'<td>'+data[i].note+'</td>'
                    +'<td>'+data[i].creator+'</td>'
                    +'<td>'+new Date(data[i].createTime).Format('yyyy-MM-dd hh:mm:ss')+'</td>'
                    +'<td data-id="'+data[i].id+'">'
                    +'<i class="fa fa-fw fa-cog pull-left modify "></i>'
                    +'<i class="fa fa-fw fa-times pull-left delete "></i>'
                    +'</td>'
                    +'</tr>';
                strHtml = strHtml  + sHtml;
            }
            $("#taskTableList").html(strHtml);
        }

    }
    quotaList.init();
});
