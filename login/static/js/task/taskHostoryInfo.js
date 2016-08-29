/**
 * Created by user on 16/6/24.
 */
/**
 * Created by user on 16/6/20.
 */
require(['jquery','jquery.bootstrap','jquery.datetimepicker','common','quickSearch','app'],function($){
    var taskhostoryInfo = {

        logDir:"",

        taskEnglishName:"",

        runState:"",

        init:function(){
            this.initEvent();
            this.logDir = $.getQueryString("logDir");
            this.taskEnglishName = $.getQueryString("ename");
            this.runState = $.getQueryString("runState");
            $("#ename").html(this.taskEnglishName);
            this.redoGetTaskInfo();
        },

        initEvent:function(){

        },

        redoGetTaskInfo:function(){
            var _this = this;
            _this.getTaskInfo();
            if(_this.runState == "4"){
                setInterval(function(){
                    _this.getTaskInfo();
                },10000);
            }
        },

        getTaskInfo:function(){
            var _this = this;
            $.ajax({
                type: "get",
                url: "/sentosa/job/instance/logger",
                data: {
                    logDir:_this.logDir
                },
                success: function (result) {
                    if(result && result.success){
                        var dat = result.pairs.dat;
                        _this.setInfo(dat);
                    }else{
                        $.showModal({content:"查询失败"});
                    }
                },
                error:function(a,b,c){
                    alert(a.responseText);
                }
            });
        },

        setInfo:function(dat){
            $("#info").val(dat);
            $("#info").scrollTop($("#info")[0].scrollHeight);
        }



    };
    taskhostoryInfo.init();
});
