
/**
 * Created by user on 16/6/20.
 */
require(['jquery','jquery.bootstrap','jquery.datetimepicker','common','quickSearch','app','jquery.ztree.core','jquery.ztree.excheck','jquery.ztree.exedit'],function($){
    var hqlManager = {

        placeholder: 'sql编辑框 \neq: select * from o_adv_info limit 100',

        zTreeObj:null,

        newCount:1,

        init:function(){
            this.initEvent();
            this.getRootTree();
            this.getUser();
        },

        initEvent:function(){
            var _this = this;
            $('#sql').attr('value', _this.placeholder);

            $('#sql').focus(function(){
                if($(this).val() === _this.placeholder){
                    $(this).val("");
                }
            });

            $('#sql').blur(function(){
                if($(this).val() ===''){
                    $(this).val(_this.placeholder);
                }
            });

            $("#saveJiaoben").click(function(){
                if($(this).hasClass("butDisabled")){
                    return;
                }
                _this.saveJiaoben();
            });

            $("#showSqlTask").click(function(){
                if($(this).hasClass("butDisabled")){
                    return;
                }
                _this.showSqlTask();
            });

            $(".myuserUl").delegate("li a", "click", function () {
                $(".myuserUl li a").removeClass("active");
                $(this).addClass("active");
                var loginName = $(this).attr("data-loginName");
                var id = $(this).attr("data-id");
                if ($(".selectUsers").find("a[data-id=" + id + "]").length <= 0) {
                    $(".selectUsers").append('<a class="btn btn-app" data-id="' + id + '" data-loginName="' + loginName + '">'
                        + '<span class="badge bg-yellow"><i class="fa fa-fw fa-times"></i></span>'
                        + loginName
                        + '</a>');
                }
            });

            //添加联系人
            $("#addUserBut").click(function () {
                $("#userModal").modal("toggle");
            });

            $("#quickSearchName").keyup(function (e) {
                var e = e || window.event;
                var value = $(this).val();
                if (e.keyCode != 38 && e.keyCode != 40) {
                    _this.quickTimeOut = setTimeout(function () {
                        _this.getUser(value);
                    }, 500)
                }
            });
            $("#quickSearchName").keydown(function (e) {
                var e = e || window.event;
                clearTimeout(_this.quickTimeOut);
            });
            $("#addFuzeren").click(function () {
                var selectUsers = $(".selectUsers a");
                var userIds = [], userLoginNames = [];
                for (var i = 0; i < selectUsers.length; i++) {
                    userIds.push(selectUsers.eq(i).attr("data-id"));
                    userLoginNames.push(selectUsers.eq(i).attr("data-loginName"));
                }
                $("#userNames").val(userLoginNames.join(", ")).attr("data-id", userIds.join(","));
                $("#userModal").modal("hide");
            });

            $(".selectUsers").delegate('.badge', "click", function () {
                $(this).parent().remove();
            });

            $("#saveHqlTask").click(function(){

                _this.saveHqlTask();
            });
        },

        saveHqlTask:function(){
            debugger;
            var _this = this;
            var verifyFlag = verifyEmpty(
                [
                    {name:"name",label:"任务名称"},
                    {name:"userNames",label:"负责人"},
                    {name:"hql",label:"hql脚本内容"},
                    {name:"desc",label:"描述"}
                ]
            );

            var selectNode = this.zTreeObj.getSelectedNodes()[0];

            if(verifyFlag) {
                var script ={
                    name:$("#name").val(),
                    administrator:$("#userNames").val(),
                    context:$("#hql").val(),
                    describe:$("#desc").val(),
                    treeId:selectNode.treeId,
                };
                showloading(true);
                $.ajax({
                    type: "post",
                    url: "/sentosa/transform/script/saveScript",
                    dataType: "json",
                    contentType: 'application/json',
                    data: JSON.stringify(script),
                    success: function (result) {
                        showloading(false);
                        if(result && result.success){
                            location.href = "hqlTaskList.html";
                        }else{
                            $.showModal({content:result.message});
                        }
                    },
                    error:function(a,b,c){
                        showloading(false);
                        alert(a.responseText);
                    }
                });
            }
        },

        showSqlTask:function(){
            var _this = this;
            var selectNode = _this.zTreeObj.getSelectedNodes();
            if(selectNode.length <= 0){
                showTip("请在左侧树中选中一个脚本");
                return;
            }

            if($.trim($("#sql").val()) == ""){
                showTip("请先给该脚本配置sql");
                return;
            }

            if(selectNode[0].context == ""){
                showTip("请先保存脚本,再点击生成sql任务.");
                return;
            }

            $("#hql").val($("#sql").val());
            $("#taskInfoMadel").modal("toggle");
        },

        saveJiaoben:function(){
            var _this = this;

            var selectNode = _this.zTreeObj.getSelectedNodes();
            if(selectNode.length <= 0){
                showTip("请在左侧树中选中一个脚本");
                return;
            }
            if(!selectNode[0].treeId){
                showTip("请先编辑该脚本的名称");
                return;
            }
            var sql = $("#sql").val();
            if(sql === _this.placeholder || $.trim(sql) == ""){
                showTip("请填写sql");
                return;
            }
            this.renameNode(selectNode[0],sql);


        },

        getRootTree:function(){
            var _this = this;
            showloading(true);
            $.ajax({
                type: "post",
                url: "/sentosa/transform/scriptTree/queryRootNode",
                data: {
                },
                success: function (result) {
                    showloading(false);
                    if(result && result.success){
                        var scriptTree = result.pairs.scriptTree;
                        scriptTree.isParent = true;
                        _this.initTree(scriptTree);
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

        initTree:function(scriptTree){
            var _this = this;
            var setting = {
                async: {
                    enable: true,
                    url: "/sentosa/transform/scriptTree/queryScriptTree",
                    autoParam: ["treeId"],
                    type: "post",
                    dataFilter:this.dataFilter
                },
                view: {
                    expandSpeed:"",
                    addHoverDom: addHoverDom,
                    removeHoverDom: removeHoverDom,
                    selectedMulti: false
                },
                edit: {
                    enable: true,
                    showRemoveBtn:showRemoveBtn,
                    showRenameBtn: showRenameBtn
                },
                data: {
                    simpleData: {
                        enable: true
                    },
                    key:{
                        name:"treeName"
                    }
                },
                callback: {
                    beforeRemove: beforeRemove,
                    beforeRename: beforeRename,
                    onRename:zTreeOnRename,
                    beforeClick:beforeClick,
                    onClick: zTreeOnClick,
                    onAsyncSuccess: zTreeOnAsyncSuccess,
                    onRemove:onRemove
                }


            };
            this.zTreeObj = $.fn.zTree.init($("#treeDemo"), setting, scriptTree);

            function beforeClick(treeId, treeNode, clickFlag){
                if(treeNode.type == 0){
                    return false;
                }
                return true;
            }
            function zTreeOnClick(event, treeId, treeNode){
                if(treeNode.treeId){
                    if(treeNode.scriptId == -100){
                        $("#showSqlTask").removeClass("butDisabled");
                    }else{
                        $("#showSqlTask").addClass("butDisabled");
                    }
                    if(treeNode.status == 1){
                        $("#saveJiaoben").addClass("butDisabled");
                    }else{
                        $("#saveJiaoben").removeClass("butDisabled");
                    }
                    $("#sql").val(treeNode.context);
                    return true;
                }else{
                    $("#showSqlTask").addClass("butDisabled");
                    $("#saveJiaoben").addClass("butDisabled");
                    $("#sql").val("");
                    return false;
                }
            }

            function zTreeOnAsyncSuccess(event, treeId, treeNode, msg){
                $("#showSqlTask").addClass("butDisabled");
                $("#saveJiaoben").addClass("butDisabled");
                $("#sql").val("");
                var childs = treeNode.children;
                for(var i=0;i<childs.length;i++){
                    if(childs[i].scriptId != -100){
                        $("#"+childs[i].tId).find("a").addClass("scriptId");
                    }
                }
            }

            function showRemoveBtn(treeId, treeNode) {
                if(treeNode.level==0 || (treeNode.children && treeNode.children.length>0) || treeNode.status){
                    return false;
                }
                return true;
            }

            function showRenameBtn(treeId, treeNode) {
                if(treeNode.level==0){
                    return false;
                }
                return true;
            }

            function beforeRemove(treeId, treeNode) {
                //_this.renameNode(treeNode);
                var zTree = $.fn.zTree.getZTreeObj("treeDemo");
                zTree.selectNode(treeNode);
                if(!treeNode.treeId){
                    return true;
                }
                if(confirm("确认删除 节点 -- " + treeNode.treeName + " 吗？")){
                    _this.deleteNode(treeNode.treeId,treeNode.getParentNode());
                    return false;
                };
            }
            function onRemove(event, treeId, treeNode){
                //_this.zTreeObj.reAsyncChildNodes(treeNode.getParentNode(), "refresh");
            }
            function beforeRename(treeId, treeNode, newName) {
                if (newName.length == 0 || $.trim(newName) == "") {
                    alert("节点名称不能为空.");
                    return false;
                }
                return true;
            }
            function zTreeOnRename(event, treeId, treeNode, isCancel) {
                _this.renameNode(treeNode);
            }

            function addHoverDom(treeId, treeNode) {
                if(!treeNode.isParent || !treeNode.treeId){
                    return;
                }
                var sObj = $("#" + treeNode.tId + "_span");
                if (treeNode.editNameFlag || $("#addBtn_"+treeNode.tId).length>0) return;
                var addStr = "<span class='button add' id='addBtn_" + treeNode.tId
                    + "' title='add node' onfocus='this.blur();'></span>";
                sObj.after(addStr);
                var btn = $("#addBtn_"+treeNode.tId);
                if (btn) btn.bind("click", function(){
                    var zTree = $.fn.zTree.getZTreeObj("treeDemo");
                    //if(treeNode.children && treeNode.children.length>0){
                    //    var type = treeNode.children[0].isParent;
                    //    zTree.addNodes(treeNode, {id:(100 + _this.newCount), isParent:type, pId:treeNode.id, treeName:"new node" + (_this.newCount++)});
                    //}else{
                    $.showModal({
                        content:"请选择建文件夹还是脚本?",
                        closeCallBack:function(){
                            zTree.addNodes(treeNode, {id:(100 + _this.newCount), pId:treeNode.id, isParent:true, treeName:"请先命名" + (_this.newCount++)});
                        },
                        sureCallBack:function(){
                            zTree.addNodes(treeNode, {id:(100 + _this.newCount), pId:treeNode.id, treeName:"请先命名" + (_this.newCount++)});
                        },
                        title:"提示信息",
                        closeName:"建文件夹",
                        sureName:"建脚本"
                    });
                    //}
                    return false;
                });
            };
            function removeHoverDom(treeId, treeNode) {
                $("#addBtn_"+treeNode.tId).unbind().remove();
            };


        },

        dataFilter:function(treeId, parentNode, childNodes){
            var scriptTrees = childNodes.pairs.scriptTrees;
            for(var i=0;i<scriptTrees.length;i++){
                if(scriptTrees[i].type == 0){
                    scriptTrees[i].isParent = true;
                }else{
                    scriptTrees[i].isParent = false;
                }
            }
            return scriptTrees;
        },
        deleteNode:function(treeId,parentNode){
            var _this = this;
            showloading(true);
            $.ajax({
                type: "post",
                url: "/sentosa/transform/scriptTree/deleteScriptTree",
                data: {
                    treeId:treeId
                },
                success: function (result) {
                    showloading(false);
                    if(result && result.success){
                        showTip("删除成功.");
                        _this.zTreeObj.reAsyncChildNodes(parentNode, "refresh");
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
        renameNode:function(treeNode,context){
            debugger;
            var _this = this;
            if(treeNode.treeId){
                showloading(true);
                $.ajax({
                    type: "post",
                    url: "/sentosa/transform/scriptTree/updateScriptTree",
                    data: {
                        treeId:treeNode.treeId,
                        treeName:treeNode.treeName,
                        scriptId:treeNode.scriptId,
                        context:context?context:treeNode.context
                    },
                    success: function (result) {
                        showloading(false);
                        if(result && result.success){
                            showTip("修改成功");
                            _this.zTreeObj.reAsyncChildNodes(treeNode.getParentNode(), "refresh");
                        }else{
                            $.showModal({content: result.message});
                        }
                    },
                    error:function(a,b,c){
                        showloading(false);
                        alert(a.responseText);
                    }
                });
            }else{
                showloading(true);
                $.ajax({
                    type: "post",
                    url: "/sentosa/transform/scriptTree/saveScriptTree",
                    data: {
                        parentId:treeNode.getParentNode().treeId,
                        treeName:treeNode.treeName,
                        type:treeNode.isParent?0:1,
                        context:context?context:""
                    },
                    success: function (result) {
                        showloading(false);
                        if(result && result.success){
                            showTip("新增成功");
                            _this.zTreeObj.reAsyncChildNodes(treeNode.getParentNode(), "refresh");
                        }else{
                            $.showModal({content:result.message});
                        }
                    },
                    error:function(a,b,c){
                        showloading(false);
                        alert(a.responseText);
                    }
                });
            }

        },

        getUser: function (loginName) {
            var _this = this;
            showloading(true);
            $.ajax({
                type: "get",
                url: "/sentosa/users/search",
                global: false,
                data: {
                    loginName: $.trim(loginName)
                },
                success: function (result) {
                    showloading(false);
                    if (result && result.success) {
                        _this.setUserDig(result.pairs.dat);
                    } else {
                        $.showModal({conent: result.message});
                    }
                },
                error: function (a, b, c) {
                    showloading(false);
                    alert(a.responseText);
                }
            });
        },

        setUserDig: function (dat) {
            $(".myuserUl").empty();
            for (var i = 0; i < dat.length; i++) {
                $(".myuserUl").append('<li><a data-id="' + dat[i].id + '" data-loginName="' + dat[i].loginName + '" data-realName="' + dat[i].realName + '" href="javascript:void(0);">' + dat[i].realName + '  ' + dat[i].mail + ' ' + dat[i].groupName + '</a></li>');
            }
        }
    }
    hqlManager.init();
});
