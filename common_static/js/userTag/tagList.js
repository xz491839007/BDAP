require(['jquery','jquery.bootstrap','jquery.datetimepicker','quickSearch','common','app'],function($,d3){
    var tagList = {

        pageNo:1,

        pageSize:10,

        totalPage:0,

        totalRecords:0,

        init:function(){
            this.initEvent();
            this.getTagList();
        },

        initEvent:function() {
            var _this = this;
            $("#addTag").click(function(){
                location.href = '/usertag/addtag';
            });

            $('#createDate,#modifyDate').datetimepicker({
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
                    _this.getTagList();
                }
            });

            $("#nextPage").click(function(){
                if(_this.pageNo >= _this.totalPage){
                    return;
                }
                _this.pageNo = _this.pageNo + 1;
                _this.getTagList();
            });
            $(".searchTh input").keydown(function(e){
                var e = e || window.event;
                if(e.keyCode == "13"){
                    _this.pageNo = 1;
                    _this.getTagList();
                }
            });
            $(".searchTh select").change(function(e){
                _this.pageNo = 1;
                _this.getTagList();
            });

            $("#taglistTable").delegate(".modify","click",function(){
                location.href = "tagAdd?id="+$(this).parent().attr("data-id");
            });
            $("#taglistTable").delegate(".delete","click",function(){
                if(confirm("是否要删除该节点?")){
                    _this.deleteTask($(this).parent().attr("data-id"));
                }
            });
            //$("#taglistTable").delegate(".fa-eye","click",function(){
            //    window.open ('uploadInfo.html?id='+$(this).parent().attr("data-id"));
            //});

        },


        deleteTask:function(name){
            var _this = this;
            showloading(true);
            var dat = {};
            dat.name = name;
            $.ajax({
                type: "post",
                url: "/usertag/label/delete",
                dataType: "json",
                data: JSON.stringify(dat),
                success: function (result) {
                    showloading(false);
                    if(result && result.success){
                        showTip("删除成功");
                        _this.getTagList();
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

        getTagList:function(){
            var _this = this;
            var name = $("#name").val();
            var type = $("#type").val();
            var joinColumnName = $("#joinColumnName").val();
            var createDate = $("#createDate").val();
            var desc = $("#desc").val();
            // showloading(false);
            $.ajax({
                type: "post",
                url: "/usertag/label/list",
                data: {
                    name: name,
                    desc: desc,
                    joinColumnName:joinColumnName,
                    createDate:createDate,
                    note:desc,
                    pageNo:_this.pageNo,
                    pageSize:_this.pageSize
                },
                success: function (result) {
                    // showloading(false);
                    console.log(result);
                    if(result && result.success){
                        var dat = result;
                        _this.setDataList(dat);
                    }else{
                        $.showModal({content:"查询失败:"+result.message});
                    }
                },
                error:function(a,b,c){
                    // showloading(false);
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
            var data = dat.data;
            var strHtml = "";
            for(var i=0;i<data.length;i++){
                var sHtml = '<tr>'
                    +'<td>'+data[i].tagname+'</td>'
                    +'<td>'+this.getType(data[i].classification)+'</td>'
                    +'<td>'+data[i].joinColumnName+'</td>'
                    +'<td>'+new Date(data[i].createtime).Format('yyyy-MM-dd hh:mm:ss')+'</td>'
                    +'<td>'+data[i].note+'</td>'
                    +'<td data-id='+data[i].tagname+'>'
                    // +'<i class="fa fa-fw fa-cog pull-left modify"></i>'
                    +'<i class="fa fa-fw fa-times pull-left delete"></i>'
                    +'</td>'
                    +'</tr>';
                strHtml = strHtml  + sHtml;
            }
            $("#taglistTable").html(strHtml);
        },

        getType:function(id){
            if(id == 1){
                return "维度";
            }else if(id == 2){
                return "静态指标";
            }else if(id == 3){
                return "动态指标";
            }
            return "";
        }




    };
    tagList.init();
});
