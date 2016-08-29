/**
 * Created by user on 16/6/24.
 */
require(['jquery','jquery.bootstrap','jquery.datetimepicker','common','quickSearch','app'],function($){
    var taskhostoryList = {

        pageNo:1,

        pageSize:10,

        totalPage:0,

        totalRecords:0,


        init:function(){
            var taskId = $.getQueryString("taskId");
            if(taskId != null){
                $("#taskId").val(taskId);
            }
            this.initEvent();
            this.getTaskList();
        },

        initEvent:function(){
            var _this = this;
            $("#addTask").click(function(){
                location.href = "taskAdd.html";
            });
            $('#startTime,#startTime').datetimepicker({
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

            $("#DBlistTable").delegate(".fa-file-text-o","click",function(){
                var $this = $(this);

                var ename = $this.attr("data-ename");
                var logDir = $this.attr("data-logDir");
                var runState = $(this).attr("data-runState");
                window.open("taskHostoryInfo.html?ename="+ename +"&logDir="+logDir+"&runState="+runState);

            });

            $("#DBlistTable").delegate(".fa-times","click",function(){
                var $this = $(this);
                var id = $this.attr("data-id");
                _this.killInstance(id);
            });

            $(".searchTh input").keydown(function(e){
                var e = e || window.event;
                if(e.keyCode == "13"){
                    _this.pageNo = 1;
                    _this.getTaskList();
                }
            });
            $(".searchTh select").change(function(e){
                _this.pageNo = 1;
                _this.getTaskList();
            });
        },

        killInstance:function(id){
            var _this = this;
            showloading(true);
            $.ajax({
                type: "get",
                url: "/sentosa/job/instance/kill",
                data: {
                    id:id
                },
                success: function (result) {
                    showloading(false);
                    if(result && result.success){
                        showTip("kill实例成功.")
                        setTimeout(function(){
                            _this.getTaskList(dat);
                        },500);
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

        getTaskList:function(){
            var _this = this;
            var taskEnglishName = $("#taskEnglishName").val();
            var runState = $("#runState").val();
            var startTime = $("#startTime").val();
            var endTime = $("#endTime").val();
            var taskId = $("#taskId").val();
            showloading(true);
            $.ajax({
                type: "get",
                url: "/sentosa/job/instance/search",
                data: {
                    taskId:taskId,
                    taskEnglishName: taskEnglishName,
                    runState: runState,
                    start: startTime,
                    end: endTime,
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
                var statusStr = '<i data-id="'+data[i].id+'" data-taskId="'+data[i].taskId+'" class="fa fa-fw fa-times pull-left myfabut"></i>';
                if(data[i].runState == 5 || data[i].runState == 6 || data[i].runState == 7){
                    statusStr = "";
                }
                var sHtml = '<tr>'
                    +'<td>'+data[i].taskId+'</td>'
                    +'<td>'+data[i].id+'</td>'
                    +'<td>'+data[i].taskEnglishName+'</td>'
                    +'<td>'+data[i].taskChineseName+'</td>'
                    +'<td>'+this.getState(data[i].runState)+'</td>'
                    +'<td>'+this.getType(data[i].type)+'</td>'
                    +'<td title="'+this.getTimeFormat(data[i].startTime)+'">'+this.getTimeFormat(data[i].startTime)+'</td>'
                    +'<td title="'+this.getTimeFormat(data[i].endTime)+'">'+this.getTimeFormat(data[i].endTime)+'</td>'
                    +'<td title="'+this.getTimeFormat(data[i].arrangeTime)+'">'+this.getTimeFormat(data[i].arrangeTime)+'</td>'
                    +'<td>'
                    +'<i data-runState="'+data[i].runState+'" data-logDir="'+data[i].logDir+'" data-ename="'+data[i].taskEnglishName+'" class="fa fa-fw fa-file-text-o pull-left myfabut"></i>'
                    +statusStr
                    +'</td>'
                    +'</tr>';
                strHtml = strHtml  + sHtml;
            }
            $("#DBlistTable").html(strHtml);
        },

        getTimeFormat:function(time){
            return (new Date(time)).Format("yyyy-MM-dd hh:mm:ss");
        },

        getState:function(type){
            if(type == 1){
                return "prepared";
            }else if(type == 2){
                return "ready";
            }else if(type == 3){
                return "waiting";
            }else if(type == 4){
                return "running";
            }else if(type == 5){
                return "success";
            }else if(type == 6){
                return "failed";
            }else if(type == 7){
                return "killed";
            }
            return "";
        },

        getType:function(type){
            if(type != 0){
                return "手动";
            }else{
                return "自动";
            }
        }


    };
    taskhostoryList.init();
});
