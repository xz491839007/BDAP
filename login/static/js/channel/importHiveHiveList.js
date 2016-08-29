/**
 * Created by user on 16/6/20.
 */
require(['jquery','jquery.bootstrap','jquery.datetimepicker','common','quickSearch','app'],function($){
    var channelList = {

        init:function(){
            this.initEvent();
        },

        initEvent:function(){
            $("#addChannel").click(function(){
                location.href = "DBtoHiveAdd.html";
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
        }

    }
    channelList.init();
});
