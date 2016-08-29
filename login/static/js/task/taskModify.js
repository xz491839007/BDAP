/**
 * Created by user on 16/6/20.
 */
require(['jquery','jquery.bootstrap','jquery.datetimepicker','common','quickSearch','app'],function($){
    var taskModify = {

        id:"",

        oldEname:"",

        oldCname:"",

        oldgaojiinput:"",

        init:function(){
            this.id = $.getQueryString("id");
            this.initEvent();

            this.getTask(1);//SQOOP抽取 默认1
            this.getTask("",true);//依赖任务
            this.getGaoJi();
            this.getTaskInfo();
        },

        initEvent:function(){
            var _this = this;
            $('#startDate').datetimepicker({
                format: "yyyy-mm-dd hh:ii:ss",
                autoclose: true,
                todayBtn: true,
                todayHighlight: true,
                showMeridian: true,
                pickerPosition: "bottom-right",
                language: "zh-CN"
            });
            $('#startDate').val((new Date()).Format("yyyy-MM-dd hh:mm:ss"));

            $('#startDate').datetimepicker().on('changeDate', function(ev){
                _this.getGaoJi();
            });
            $("#pinci").change(function(){
                _this.getGaoJi();
            });

            $("#taskType").change(function(){
                var value = $(this).val();
                _this.getTask(value);
            });

            $("#saveBut").click(function(){
                _this.saveTask(false);
            });
            $("#saveAndDoBut").click(function(){
                _this.saveTask(true);
            });
            $("#gaoji").click(function(){
                if($(this).is(":checked")){
                    $("#gaojiinput").show();
                    $("#startDate,#pinci").attr("disabled","disabled");
                    _this.oldgaojiinput = $("#gaojiinput").val();
                }else{
                    $("#gaojiinput").hide();
                    $("#startDate,#pinci").removeAttr("disabled");
                    $("#gaojiinput").val(_this.oldgaojiinput);
                }
            });
            $("#addyilai").click(function(){
                var yilaitask = $("#yilaitask").val();
                var id = $("#yilaitask").attr("data-value")
                var isactive = $("#yilaitask").next().find("li.selected").attr("data-active");
                var schedule = $("#yilaitask").next().find("li.selected").attr("data-schedule");
                if(isactive == "true" && schedule == "true"){
                    if(id != _this.id){
                        if(yilaitask != "" && $("#yilaiList").find("option[data-id="+id+"]").length<=0){
                            $("#yilaiList").append('<option data-id="'+id+'">'+yilaitask+'</option>');
                        }
                    }else{
                        showTip("任务不能依赖本身.");
                    }
                }else{
                    if (isactive == "false" && schedule == "true") {
                        showTip("该任务未上线,不能被依赖");
                        return;
                    }
                    if (isactive == "false" && schedule == "false") {
                        showTip("该任务未添加调度,不能被依赖");
                        return;
                    }
                }
            });
            $("#removeyilai").click(function(){
                var sel = $('#yilaiList').find("option:selected");
                if(sel.length>0){
                    sel.remove();
                }
            });
            $("#ename").blur(function(){
                var value = $(this).val();
                if($.trim(value) == _this.oldEname){
                    return;
                }
                _this.checkName(value,false);
            });
            $("#cname").blur(function(){
                var value = $(this).val();
                if($.trim(value) == _this.oldCname){
                    return;
                }
                var value = $(this).val();
                _this.checkName(value,true);
            });
        },

        getTaskInfo:function(){
            var _this = this;
            showloading(true);
            $.ajax({
                type: "get",
                url: "/sentosa/scheduler/find",
                data: {
                    id:_this.id
                },
                success: function (result) {
                    debugger;
                    showloading(false);
                    if(result && result.success){
                        _this.setValues(result.pairs);
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

        setValues:function(pairs){
            var dat = pairs.dat,det = pairs.det;
            this.oldEname = dat.englishName;
            this.oldCname = dat.chineseName;

            $("#ename").val(dat.englishName);
            $("#cname").val(dat.chineseName);
            $("#taskType").val(dat.taskType);
            $("#chooseTask").val(dat.taskName);
            $("#chooseTask").attr("data-value",dat.taskId);

            $("#startDate").val((new Date(dat.startExecTime)).Format("yyyy-MM-dd hh:mm:ss"));

            $("#pinci").val(dat.cronType);
            $("#gaojiinput").val(dat.cronExpression);
            this.oldgaojiinput = dat.cronExpression;

            this.getGaoJi(true);

            $("#desc").html(dat.description);
            for(var i=0;i<det.length;i++){
                $("#yilaiList").append('<option data-id="'+det[i].id+'">'+det[i].englishName+'</option>');
            }

        },

        checkName:function(value,type){
            if($.trim(value)==""){
                return;
            }
            showloading(true);
            $.ajax({
                type: "post",
                url: "/sentosa/scheduler/unique",
                data: {
                    chinese:type,
                    name:value
                },
                success: function (result) {
                    showloading(false);
                    if(result && result.success){

                        var dat = result.pairs.dat;
                        if(!dat){
                            if(type){
                                $("#cnameError").show();
                            }else{
                                $("#enameError").show();
                            }
                        }else{
                            if(type){
                                $("#cnameError").hide();
                            }else{
                                $("#enameError").hide();
                            }
                        }
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

        saveTask:function(isactive){
            var _this = this;
            var verifyFlag = verifyEmpty(
                [
                    {name:"ename",label:"调度英文名"},
                    {name:"cname",label:"调度中文名"},
                    {name:"startDate",label:"执行时间"},
                    {name:"desc",label:"描述"},
                    {name:"gaojiinput",label:"执行时间/频次或者高级表达式"},
                ]
            );
            if($("#enameError").css("display") != "none" || $("#cnameError").css("display") != "none"){
                return;
            }
            if(verifyFlag){
                var data = {};
                data.id = _this.id;
                data.englishName = $("#ename").val();
                data.chineseName = $("#cname").val();

                data.taskId = $("#chooseTask").attr("data-value");
                data.description = $("#desc").val();
                //var id englishname chargeusers chargeusernames
                data.cronExpression = $("#gaojiinput").val();

                data.startExecTime = $("#startDate").val();
                data.cronType = $("#pinci").val();

                data.active = isactive;
                var yilaiOptions = $("#yilaiList option");
                var ids = [];
                for(var i=0;i<yilaiOptions.length;i++){
                    var id = yilaiOptions.eq(i).attr("data-id");
                    ids.push(id);
                }
                data.ids = ids.join(",");
                showloading(true);
                $.ajax({
                    type: "post",
                    url: "/sentosa/scheduler/modify",
                    data: data,
                    success: function (result) {
                        showloading(false);
                        if(result && result.success){
                            showTip("保存成功!");
                            location.href = "taskList.html";
                        }else{
                            $.showModal({content:result.message||"保存失败,可能是名字重复"});
                        }
                    },
                    error:function(a,b,c){
                        showloading(false);
                        alert(a.responseText);
                    }
                });
            }
        },

        getGaoJi:function(flag){
            var startDate = $("#startDate").val();
            var pinci = $("#pinci").val();
            showloading(true);
            $.ajax({
                type: "get",
                url: "/sentosa/job/parse",
                data: {
                    date:startDate,
                    frequencyType:pinci,
                    frequency:1
                },
                success: function (result) {
                    showloading(false);
                    if(result && result.success){
                        debugger;
                        var dat = result.pairs.dat;
                        if(!flag){
                            $("#gaojiinput").val(dat);
                        }else{
                            if(gaojiinput != dat){
                                $("#gaoji").trigger("click");
                            }
                        }

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

        getTask:function(type,flag){//flag 标示是任务类型 框 还是任务依赖框
            var data = {
                type:type
            };
            if(!flag){
                data.schedule = 0;
            }
            showloading(true);
            $.ajax({
                type: "get",
                url: "/sentosa/job/search",
                data: data,
                success: function (result) {
                    showloading(false);
                    if(result && result.success){
                        var dat = result.pairs.dat;
                        if(flag){
                            $("#yilaitask").quickSearch({
                                data:dat,
                                text:"englishName",
                                value:"id",
                                width: "400px"
                            });

                        }else{
                            $("#chooseTask").quickSearch({
                                data:dat,
                                text:"englishName",
                                value:"id",
                                width: "400px"
                            });
                        }
                    }else{
                        $.showModal({content:"查询失败"});
                    }
                },
                error:function(a,b,c){
                    showloading(false);
                    alert(a.responseText);
                }
            });
        }

    };
    taskModify.init();
});
