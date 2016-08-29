/**
 * Created by user on 16/6/20.
 */
require(['jquery','jquery.bootstrap','jquery.datetimepicker','common','quickSearch','app'],function($){
    var tagMapping = {

        pageNo:1,

        pageSize:10,

        totalPage:0,

        totalRecords:0,

        init:function(){
            this.initEvent();
            this.getMappingList();
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

            $("#search").click(function(){
                _this.pageNo = 1;
                _this.getMappingList();
            });

            $("#prevPage").click(function(){
                if(_this.pageNo <= 1){
                    return;
                }else{
                    _this.pageNo = _this.pageNo - 1;
                    _this.getMappingList();
                }
            });

            $("#nextPage").click(function(){
                if(_this.pageNo >= _this.totalPage){
                    return;
                }
                _this.pageNo = _this.pageNo + 1;
                _this.getMappingList();
            });
            $(".searchTh input").keydown(function(e){
                var e = e || window.event;
                if(e.keyCode == "13"){
                    if(e.target.id == "createName" && e.target.value != ""){
                        return;
                    }
                    _this.pageNo = 1;
                    _this.getMappingList();
                }
            });
            $(".searchTh select").change(function(e){
                _this.pageNo = 1;
                _this.getMappingList();
            });

            $("#hiveTableList").delegate(".fa-cog","click",function(){
                var tableId = $(this).parent().attr("data-id");
                var tableName = $(this).parent().attr("data-name");
                location.href = "tagMappingModifyOne.html?tableId="+tableId+"&tableName="+tableName;
            });
            $("#piliang").click(function(){
                location.href = "tagMappingModifyMore.html";
            });

        },


        getMappingList:function(){
            var _this = this;
            var tableName = $("#tableName").val();
            var cname = $("#cname").val();
            var dbName = $("#dbName").val();
            var createName = $("#createName").val();
            var tableType = $("#tableType").val();
            showloading(true);
            $.ajax({
                type: "post",
                url: "/sentosa/metadata/table/list",
                data: {
                    dbId:"",
                    name: tableName,
                    chineseName: cname,
                    dbName: dbName,
                    creator:createName,
                    hiveType:tableType,
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
                var opeFa = '<i class="fa fa-fw fa-cog pull-left myfabut"></i>'
                var sHtml = '<tr>'
                    +'<td title="'+data[i].name+'">'+data[i].name+'</td>'
                    +'<td title="'+data[i].chineseName+'">'+data[i].chineseName+'</td>'
                    +'<td title="'+data[i].dbName+'">'+data[i].dbName+'</td>'
                    +'<td title="'+data[i].creator+'">'+data[i].creator+'</td>'
                    +'<td>'+(data[i].hiveType=="MANAGED_TABLE"?"内表":"外表")+'</td>'
                    +'<td data-id="'+data[i].id+'" data-hiveType="'+data[i].hiveType+'" data-dbName="'+data[i].dbName+'" data-name="'+data[i].name+'" style="width:120px;">'
                    + opeFa
                    +'</td>'
                    +'</tr>';
                strHtml = strHtml  + sHtml;
            }
            $("#hiveTableList").html(strHtml);
        },

        chooseTypeModal:function(){

        }

    }
    tagMapping.init();
});
