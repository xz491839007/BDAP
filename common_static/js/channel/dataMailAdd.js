/**
 * Created by user on 16/6/20.
 */
require(['jquery','jquery.bootstrap','jquery.datetimepicker','common','quickSearch','app'],function($){
    var dataMailAdd = {

        ue:null,

        init:function(){
            this.ue = UE.getEditor('editor');
        },

        initEvent:function(){
            var _this = this;

        }
    };
    dataMailAdd.init();
});
