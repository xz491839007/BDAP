var showloading = function(flag){
    var wrapper =  $("#overlay-wrapper");
    if(wrapper.length > 0){
    }else{
        var strHtml = '<div class="overlay-wrapper" id="overlay-wrapper" style="display: none;">'
            +'<div class="overlay">'
            +'<i class="fa fa-refresh fa-spin"></i>'
            +'</div>'
            +'</div>';
        $("body").append(strHtml);
    }
    if(flag){
        $("#overlay-wrapper").show();
    }else{
        $("#overlay-wrapper").hide();
    }


}
window.showloading = showloading;
// 对Date的扩展，将 Date 转化为指定格式的String
// 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，
// 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
// 例子：
// (new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423
// (new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18
Date.prototype.Format = function(fmt)
{
    var o = {
        "M+" : this.getMonth()+1,                 //月份
        "d+" : this.getDate(),                    //日
        "h+" : this.getHours(),                   //小时
        "m+" : this.getMinutes(),                 //分
        "s+" : this.getSeconds(),                 //秒
        "q+" : Math.floor((this.getMonth()+3)/3), //季度
        "S"  : this.getMilliseconds()             //毫秒
    };
    if(/(y+)/.test(fmt))
        fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));
    for(var k in o)
        if(new RegExp("("+ k +")").test(fmt))
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
    return fmt;
}

/*
 *
 * 输入框 只能输入数字
 * */
$.fn.numeral = function() {
    $(this).css("ime-mode", "disabled");
    this.bind("keypress",function(e) {
        var browser = {}, ua = navigator.userAgent.toLowerCase();
        browser.firefox = /firefox/.test(ua);
        browser.chrome = /chrome/.test(ua);
        browser.opera = /opera/.test(ua);
        browser.ie = /msie/.test(ua);
        //IE 11的userAgent版本为Trident 7.0
        if(!browser.ie) browser.ie = /trident 7.0/.test(ua);

        var code = (e.keyCode ? e.keyCode : e.which);  //兼容火狐 IE
        if(browser.firefox&&(e.keyCode==0x8))  //火狐下不能使用退格键
        {
            return ;
        }
        return code >= 48 && code<= 57;
    });
    this.bind("blur", function() {
        if (this.value.lastIndexOf(".") == (this.value.length - 1)) {
            this.value = this.value.substr(0, this.value.length - 1);
        } else if (isNaN(this.value)) {
            this.value = "";
        }
    });
    this.bind("paste", function() {
        //if(typeof(clipboardData)!="undefined"){
        //    var s =clipboardData.getData('text');
        //    if (!/\D/.test(s));
        //    value = s.replace(/^0*/, '');
        //    return false;
        //}
        return false;//限制粘贴
    });
    this.bind("dragenter", function() {
        return false;
    });
    this.bind("keyup", function() {
        if (/(^0+)/.test(this.value)) {
            this.value = this.value.replace(/^0*/, '');
        }
    });
};

$.getQueryString = function(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return r[2]; return null;
};

$.showModal = function(obj){
    var data = {
        content:"提示信息",
        closeCallBack:null,
        sureCallBack:null,
        title:"提示信息",
        closeName:"关闭",
        sureName:"确定"
    };
    data = $.extend({},data,obj);
    var mymodalcontent = $("#mymodalcontent");
    if(mymodalcontent.length > 0){
        mymodalcontent.find(".modal-title").html(data.title);
        mymodalcontent.find(".modal-body p").html(data.content);
        mymodalcontent.find(".modal-footer .myclose").html(data.closeName);
        mymodalcontent.find(".modal-footer .mysure").html(data.sureName);

    }else{
        var htmlStr =   '<div class="modal" id="mymodalcontent">'
            +'<div class="modal-dialog">'
            +'<div class="modal-content">'
            +'<div class="modal-header">'
            +'<button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">×</span><span class="sr-only">Close</span></button>'
            +'<h4 class="modal-title">'+data.title+'</h4>'
            +'</div>'
            +'<div class="modal-body">'
            +'<p>'+data.content+'</p>'
            +'</div>'
            +'<div class="modal-footer">'
            +'<button type="button" class="btn btn-default myclose" >'+data.closeName+'</button>'
            +'<button type="button" class="btn btn-primary mysure">'+data.sureName+'</button>'
            +'</div>'
            +'</div>'
            +'</div>'
            +'</div>';
        $("body").append(htmlStr);
    }
    $("#mymodalcontent").modal("toggle");

    $("#mymodalcontent").find(".myclose").unbind("click").click(function(){
        data.closeCallBack && data.closeCallBack();
        $("#mymodalcontent").modal("hide");
    });

    $("#mymodalcontent").find(".mysure").unbind("click").click(function(){
        data.sureCallBack && data.sureCallBack();
        $("#mymodalcontent").modal("hide");
    });

};

var verifyEmpty = function(values,texts){
    if(values && values.length > 0){
        for(var i=0;i<values.length;i++){
            var $obj = $("#"+values[i].name);
            var value = $obj.val();
            if($.trim(value) == ""){
                $obj.focus();
                showTip(values[i].label +" 不能为空.");
                return false;
            }
        }
    }

    if(texts && texts.length > 0){
        for(var i=0;i<texts.length;i++){
            var $obj = $("#"+texts[i].name);
            var value = $obj.text();
            if($.trim(value) == ""){
                $obj.focus();
                showTip(texts[i].label +" 不能为空.");
                return false;
            }
        }
    }
    return true;
}
window.verifyEmpty = verifyEmpty;

var showTip = function(content,callback){
    var calloutInfo = $("#calloutInfo");
    if(calloutInfo.length > 0){
        calloutInfo.find("p").html(content);
        calloutInfo.slideDown(500,function(){
            setTimeout(function(){
                $("#calloutInfo").slideUp(500);
            },2000);
        });
    }else{
        $("body").append('<div class="callout callout-info" id="calloutInfo">'
            +'<h4>提示信息</h4>'
            +'<p></p>'
            +'</div>');
        $("#calloutInfo").find("p").html(content);
        $("#calloutInfo").slideDown(500,function(){
            setTimeout(function(){
                $("#calloutInfo").slideUp(500);
                callback&&callback();
            },2000);
        });
    }
};
window.showTip = showTip;

function getCookie(c_name){
    if (document.cookie.length>0){　　//先查询cookie是否为空，为空就return ""
        c_start=document.cookie.indexOf(c_name + "=")　　//通过String对象的indexOf()来检查这个cookie是否存在，不存在就为 -1　　
        if (c_start!=-1){
            c_start=c_start + c_name.length+1　　//最后这个+1其实就是表示"="号啦，这样就获取到了cookie值的开始位置
            c_end=document.cookie.indexOf(";",c_start)　　//其实我刚看见indexOf()第二个参数的时候猛然有点晕，后来想起来表示指定的开始索引的位置...这句是为了得到值的结束位置。因为需要考虑是否是最后一项，所以通过";"号是否存在来判断
            if (c_end==-1) c_end=document.cookie.length
            return unescape(document.cookie.substring(c_start,c_end))　　//通过substring()得到了值。想了解unescape()得先知道escape()是做什么的，都是很重要的基础，想了解的可以搜索下，在文章结尾处也会进行讲解cookie编码细节
        }
    }
    return ""
}
window.getCookie = getCookie;

String.prototype.endWith=function(endStr){
    var d=this.length-endStr.length;
    return (d>=0&&this.lastIndexOf(endStr)==d)
};

/*
 * 获取用户信息,如果获得的user为空,则跳转到登录页面
 *
 * */

// var users = JSON.parse(localStorage.getItem("users"));
// var staff = [];
// window.staff = staff;
// for(var key in users){
//     staff.push(users[key]);
// }
// var user = getCookie("user");
// if(!user || user == "" || user == null){
//     location.href = "/sentosa/login";
// }
// user = JSON.parse(JSON.parse(getCookie("user")));
// window.staff = staff;
// if(user && user.loginName){
//     $(".hidden-xs").html(user.loginName);
// }else{
//     location.href = "/page/login.html";
// }
//
// $(".sidebar-menu").html('<li class="treeview active">'
//                             +'<a>'
//                                 +'<i class="fa fa-table"></i> <span>数据知识</span>'
//                                 +'<i class="fa fa-angle-left pull-right"></i>'
//                             +'</a>'
//                             +'<ul class="treeview-menu">'
//                                 +'<li><a href="../hiveTable/hiveTableList.html"><i class="fa fa-cog"></i>Hive表管理</a></li>'
//                                 +'<li><a href="../db/dbList.html"><i class="fa fa-cog"></i>DB配置</a></li>'
//                                 +'<li><a href="../quota/quotaList.html"><i class="fa fa-cog"></i>指标管理</a></li>'
//                                 +'<li><a href="../market/marketList.html"><i class="fa fa-cog"></i>集市管理</a></li>'
//                                 +'<li><a href="../hiveTable/timeVariableList.html"><i class="fa fa-cog"></i>时间变量管理</a></li>'
//                                 +'<li><a href="../hiveTable/tagManage.html"><i class="fa fa-cog"></i>标签管理</a></li>'
//                                 +'<li><a href="../hiveTable/tagMapping.html"><i class="fa fa-cog"></i>标签映射</a></li>'
//                             +'</ul>'
//                         +'</li>'
//                         +'<li class="treeview active">'
//                             +'<a>'
//                                 +'<i class="fa fa-table"></i> <span>数据通道</span>'
//                                 +'<i class="fa fa-angle-left pull-right"></i>'
//                             +'</a>'
//                             +'<ul class="treeview-menu">'
//                                 +'<li><a href="javascript:void(0);"  class="parentMenu"><i class="fa fa-sitemap"></i>导入</a></li>'
//                                 +'<li><a href="../channel/importDBList.html" class="lastMenu"><i class="fa fa-cog"></i>DB导入</a></li>'
//                                 +'<li><a href="../channel/uploadList.html"  class="lastMenu"><i class="fa fa-cog"></i>数据上传</a></li>'
//                                 +'<li><a href="javascript:void(0);"  class="parentMenu"><i class="fa fa-sitemap"></i>导出</a></li>'
//                                 +'<li><a href="../channel/exportDBList.html" class="lastMenu"><i class="fa fa-cog"></i>DB导出</a></li>'
//                                 +'<li><a href="../channel/dataMailList.html" class="lastMenu"><i class="fa fa-cog"></i>数据订阅</a></li>'
                            // +'</ul>'
                        // +'</li>'
                        // +'<li class="treeview active">'
                        //     +'<a>'
                        //         +'<i class="fa fa-table"></i> <span>调度管理</span>'
                        //         +'<i class="fa fa-angle-left pull-right"></i>'
                        //     +'</a>'
                        //     +'<ul class="treeview-menu">'
                        //         +'<li><a href="../task/taskList.html"><i class="fa fa-cog"></i>任务调度</a></li>'
                        //         +'<li><a href="../task/taskHostoryList.html"><i class="fa fa-cog"></i>任务日志管理</a></li>'
                        //     +'</ul>'
                        //     +'</li>'
                        // +'<li class="treeview active">'
                        //     +'<a>'
                        //         +'<i class="fa fa-table"></i> <span>查询开发</span>'
                        //         +'<i class="fa fa-angle-left pull-right"></i>'
                        //     +'</a>'
                        //     +'<ul class="treeview-menu">'
                        //         +'<li><a href="javascript:void(0);"  class="parentMenu"><i class="fa fa-sitemap"></i>查询</a></li>'
                        //         +'<li><a href="../dataManager/sqlSearch.html" class="lastMenu"><i class="fa fa-cog"></i>hql查询</a></li>'
                        //         +'<li><a href="../dataManager/hqlSearchList.html" class="lastMenu"><i class="fa fa-cog"></i>hql历史记录</a></li>'
                        //         +'<li><a href="javascript:void(0);"  class="parentMenu"><i class="fa fa-sitemap"></i>开发</a></li>'
                        //         +'<li><a href="../dataManager/hqlManager.html" class="lastMenu"><i class="fa fa-cog"></i>hql开发管理</a></li>'
                        //         +'<li><a href="../dataManager/hqlTaskList.html" class="lastMenu"><i class="fa fa-cog"></i>hql任务列表</a></li>'
                        //     +'</ul>'
                        // +'</li>'
                        // +'<li class="treeview active">'
                        //     +'<a>'
                        //         +'<i class="fa fa-table"></i> <span>监控</span>'
                        //         +'<i class="fa fa-angle-left pull-right"></i>'
                        //     +'</a>'
                        //     +'<ul class="treeview-menu">'
                        //         +'<li><a href="../monitor/monitor.html"><i class="fa fa-cog"></i>全局拓扑图</a></li>'
                        //     +'</ul>'
                        // +'</li>');
