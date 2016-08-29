/**
 * Created by user on 16/6/20.
 */
require(['jquery','jquery.bootstrap','jquery.datetimepicker','common','quickSearch','app'],function($){
    var channelModify = {

        quickTimeOut: "",

        partKey: "",

        hiveTerminated: "",

        sqoopId:"",

        isModifyFirstFlag:true,

        initDBtableName:"",

        rdbmsDbId:"",

        columnMappers:"",

        _sqoop:"",

        init: function () {
            this.initEvent();
            this.getUser();
            this.getDB();
            this.getHive();
            this.sqoopId = $.getQueryString("sqoopId");
            this.getInfo();
        },

        initEvent: function () {
            var _this = this;
            $(".zifenpianfa .fa").click(function () {
                var type = $(this).attr("data-type");
                var selectRadio = $("input[name='optionsRadios']:checked");
                if (selectRadio.length == 0 && type != "add") {
                    $.showModal({
                        content: "请先在选择一个字段",
                        title: "提示信息"
                    });
                    return;
                }

                var $tr = selectRadio.parents("tr");
                if (type == "add") {
                    var strObj = $("#zifenpian").find("tr").eq(0).clone();
                    strObj.find(".tableInput").attr("data-flag", "false");
                    $("#zifenpian").append(strObj);
                } else if (type == "del") {
                    if (selectRadio.length >= 1) {
                        $tr.remove();
                    }
                }
            });

            $("#yuanElm").delegate("tr", "click", function () {
                var $this = $(this);
                if ($this.hasClass("active")) {
                    $this.removeClass("active");
                } else {
                    $this.addClass("active");
                }
            });
            $("#selectedElm").delegate("tr", "click", function () {
                var $this = $(this);
                if ($this.hasClass("active")) {
                    $this.removeClass("active");
                } else {
                    $this.addClass("active");
                }
            });

            $("#yuanElmAll").click(function () {
                var trs = $("#yuanElm tr");
                for (var i = 0; i < trs.length; i++) {
                    if (!trs.eq(i).hasClass("active")) {
                        trs.addClass("active");
                        return;
                    }
                }
                trs.removeClass("active");
            });
            $("#selectedElmAll").click(function () {
                var trs = $("#selectedElm tr");
                for (var i = 0; i < trs.length; i++) {
                    if (!trs.eq(i).hasClass("active")) {
                        trs.addClass("active");
                        return;
                    }
                }
                trs.removeClass("active");
            });
            $("#selectedElmUp").click(function () {
                var actives = $("#selectedElm tr.active");
                if (actives.length <= 0) {
                    return;
                } else {
                    var active = actives.eq(0);
                    if (active.index() != 0) {
                        active.prev().before(actives);
                    }
                }
            });
            $("#selectedElmDown").click(function () {
                var actives = $("#selectedElm tr.active");
                if (actives.length <= 0) {
                    return;
                } else {
                    var active = actives.eq(actives.length - 1);
                    if (active.next().length > 0) {
                        active.next().after(actives);
                    }
                }
            });
            $("#toRight").click(function () {
                var trs = $("#yuanElm tr.active");
                var hiveElmLength = $("#hiveElm tr").length;
                for (var i = 0; i < trs.length; i++) {
                    var selectedElmLength = $("#selectedElm tr").length;
                    if (selectedElmLength < hiveElmLength) {
                        $("#selectedElm").append(trs.eq(i));
                    }
                }
            });
            $("#toLeft").click(function () {
                var trs = $("#selectedElm tr.active");
                $("#yuanElm").append(trs);
            });

            $("#gaoji").click(function () {
                if ($("input[name='gaoji']:checked").length <= 0) {
                    $("#gaojiConfig").hide();
                    $("#shujuliang").removeAttr("disabled");
                } else {
                    $("#gaojiConfig").show();
                    $("#shujuliang").attr("disabled", "disabled");
                }
            });

            $(".fenquType").click(function () {
                var fenquType = $("input[name='fenquType']:checked");
                if (fenquType.val() == 0) {
                    $("#fenqubiaodashi").show();
                    $("#dongtaifenduDiv").hide();
                } else {
                    $("#fenqubiaodashi").hide();
                    $("#dongtaifenduDiv").show();
                }
            });

            $(".myuserUl").delegate("li a", "click", function () {
                $(".myuserUl li a").removeClass("active");
                $(this).addClass("active");
                var loginName = $(this).attr("data-loginName");
                var id = $(this).attr("data-id");
                if ($(".selectUsers").find("a[data-loginName='" + loginName + "']").length <= 0) {
                    $(".selectUsers").append('<a class="btn btn-app" data-id="' + id + '" data-loginName="' + loginName + '">'
                        + '<span class="badge bg-yellow"><i class="fa fa-fw fa-times"></i></span>'
                        + loginName
                        + '</a>');
                }
            });

            //添加联系人
            $("#addUserBut").click(function () {
                if(_this.isModifyFirstFlag){
                    _this.isModifyFirstFlag = false;
                    var fuzeren = $("#userNames").val().split(",");
                    for(var  i=0;i<fuzeren.length;i++){
                        $(".selectUsers").append('<a class="btn btn-app"  data-loginName="' + $.trim(fuzeren[i]) + '">'
                            + '<span class="badge bg-yellow"><i class="fa fa-fw fa-times"></i></span>'
                            + $.trim(fuzeren[i])
                            + '</a>');
                    }
                }else{
                    $("#userModal").modal("toggle");
                }
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

            $("#zifenpian").delegate(".tableInput", "click", function () {
                if ($(this).attr("data-flag") == "false") {
                    var kuId = $(this).attr("data-kuId");
                    _this.getTable(kuId, $(this));
                    $(this).attr("data-flag", "true")
                }
            });

            $("#saveInfo").click(function () {
                _this.saveInfo();
            });
        },

        getInfo:function(){
            var _this = this;
            showloading(true);
            $.ajax({
                type: "POST",
                url: "/sentosa/transform/sqoop/querySqoop",
                data: {
                    sqoopId:_this.sqoopId
                },
                success: function (result) {
                    showloading(false);
                    if (result && result.success) {
                        _this.setInfo(result.pairs.sqoop);
                    } else {
                        $.showModal({content: "保存失败:"+result.message});
                    }
                },
                error: function (a, b, c) {
                    showloading(false);
                    alert(a.responseText);
                }
            });
        },

        setInfo:function(sqoop){
            this._sqoop = sqoop;
            this.columnMappers = sqoop.columnMappers;

            $("#taskName").val(sqoop.sqoopName);
            $("#userNames").val(sqoop.administrator);
            $("#dbjiancheng").val(sqoop.dbAbbr);


            $("#hiveKu").val(sqoop.hiveDbName);
            $("#hiveKu").attr("data-value",sqoop.hiveDbId);
            this.hiveTerminated = sqoop.fieldsTerminatedBy;

            this.getHivebiao(sqoop.hiveDbId);
            $("#hivebiao").val(sqoop.hiveTable);
            $("#hivebiao").attr("data-value",sqoop.hiveTabId);

            this.setInitTableElm(sqoop.columnMappers);
            //this.getHiveTableElm(sqoop.hiveTabId);

            this.setDBInfo(sqoop);
            this.initGetTableElm();

            $("#qiefenziduan").val(sqoop.splitBy);
            if(sqoop.numMappers == 2 || sqoop.numMappers == 4 || sqoop.numMappers == 8 || sqoop.numMappers == 16 || sqoop.numMappers == 32){
                $("#shujuliang").val(sqoop.numMappers);
            }else{
                $("#gaoji").prop("checked",true);
                $("#gaojiConfig").show();
                $("#gaojiConfig").val(sqoop.numMappers);
            }

            if(sqoop.partType != 2){
                this.partKey = sqoop.partKey;
                $(".fenquOperate").show();
                if(sqoop.partType == 0){
                    $("input[name=fenquType]:eq(0)").trigger("click");
                    $("#fenqubiaodashi").show();
                    $("#dongtaifenduDiv").hide();
                    $("#fenqubds").val(sqoop.partVal);
                }else{
                    $("input[name=fenquType]:eq(1)").trigger("click");
                    $("#fenqubiaodashi").hide();
                    $("#dongtaifenduDiv").show();
                    $("#fenquziduan").val(sqoop.partVal);
                }
            }


            $("#where").val(sqoop.where);
            $("#desc").val(sqoop.describe );

        },

        saveInfo: function () {
            var _this = this;
            var verifyFlag = verifyEmpty(
                [
                    {name: "taskName", label: "任务名"},
                    {name: "userNames", label: "负责人"},
                    {name: "dbjiancheng", label: "DB简称"},
                    {name: "hiveKu", label: "Hive库"},
                    {name: "hivebiao", label: "Hive表"},
                    {name: "desc", label: "描述"}
                ]
            );

            if (verifyFlag) {
                var sqoop = {};
                sqoop.sqoopName = $("#taskName").val();
                sqoop.administrator = $("#userNames").val();
                sqoop.dbAbbr = $("#dbjiancheng").val();

                var zifenpian = $("#zifenpian").find("tr");

                var childSqoop = [];
                for (var i = 0; i < zifenpian.length; i++) {
                    var inputs = zifenpian.eq(i).find("input[type=text]");
                    if (inputs.eq(1).val() == "") {
                        showTip("DB第" + (i + 1) + "行表不能为空");
                        return;
                    }
                    if (i == 0) {
                        sqoop.connect = inputs.eq(0).val();
                        sqoop.table = inputs.eq(1).val();
                        sqoop.rdbmsDbId = inputs.eq(1).attr("data-kuId");
                        sqoop.rdbmsTabId = "1";//该字段没用
                        sqoop.driver = zifenpian.eq(i).find("input[type=hidden]").eq(0).val();
                        sqoop.username = zifenpian.eq(i).find("input[type=hidden]").eq(1).val();
                        sqoop.password = zifenpian.eq(i).find("input[type=hidden]").eq(2).val();
                    } else {
                        var sq = {};
                        sq.connect = inputs.eq(0).val();
                        sq.table = inputs.eq(1).val();
                        sq.rdbmsDbId = inputs.eq(1).attr("data-kuId");
                        sq.rdbmsTabId = "1";//该字段没用
                        sq.driver = zifenpian.eq(i).find("input[type=hidden]").eq(0).val();
                        sq.username = zifenpian.eq(i).find("input[type=hidden]").eq(1).val();
                        sq.password = zifenpian.eq(i).find("input[type=hidden]").eq(2).val();
                        childSqoop.push(sq);
                    }
                }
                sqoop.sqoops = childSqoop;
                sqoop.hiveDbName = $("#hiveKu").val();
                sqoop.hiveDbId = $("#hiveKu").attr("data-value");
                sqoop.hiveTable = $("#hivebiao").val();
                sqoop.hiveTabId = $("#hivebiao").attr("data-value");
                sqoop.fieldsTerminatedBy = _this.hiveTerminated;



                var columnMappers = [];
                var selectedElmTrs = $("#selectedElm tr"), hiveElmTrs = $("#hiveElm tr");
                if (selectedElmTrs.length != hiveElmTrs.length) {
                    showTip("源字段和hive表字段必须一一对应.")
                    return;
                }
                for (var k = 0; k < selectedElmTrs.length; k++) {
                    var ColumnMapper = {};
                    ColumnMapper.sColName = selectedElmTrs.eq(k).find("td").eq(0).html();
                    ColumnMapper.sColType = selectedElmTrs.eq(k).find("td").eq(1).html();
                    ColumnMapper.colId = hiveElmTrs.eq(k).find("td").eq(0).attr("data-colId");
                    ColumnMapper.cTaskId = hiveElmTrs.eq(k).find("td").eq(0).attr("data-cTaskId");
                    ColumnMapper.tColName = hiveElmTrs.eq(k).find("td").eq(0).html();
                    ColumnMapper.tColType = hiveElmTrs.eq(k).find("td").eq(1).html();
                    columnMappers.push(ColumnMapper);
                }
                sqoop.columnMappers = columnMappers;

                sqoop.splitBy = $("#qiefenziduan").val();
                if ($.trim(sqoop.splitBy) == "") {
                    showTip("数据切分字段不能为空.")
                    return;
                }

                if ($("#gaoji").is(":checked")) {
                    sqoop.numMappers = $("#gaojiConfig").val();
                    if ($.trim(sqoop.numMappers) == "") {
                        showTip("数据量高级不能为空.")
                        return;
                    }
                } else {
                    sqoop.numMappers = $("#shujuliang").val();
                }
                sqoop.reduceNumber = $("#shujuliang").val();

                if (this.partKey != "") {
                    var fenquType = $("input[name='fenquType']:checked").val();
                    if (fenquType == 0) {
                        sqoop.partVal = $("#fenqubds").val();
                        sqoop.partType = 0;
                        if ($.trim(sqoop.partVal) == "") {
                            showTip("分区表达式不能为空.")
                            return;
                        }
                    } else {
                        sqoop.partVal = $("#fenquziduan").val();
                        if ($.trim(sqoop.partVal) == "") {
                            showTip("选择分区字段不能为空.")
                            return;
                        }
                        sqoop.partType = 1;
                    }
                    sqoop.partKey = _this.partKey;
                } else {
                    sqoop.partType = 2;
                }

                sqoop.where = $("#where").val();
                sqoop.describe = $("#desc").val();
                sqoop.sqoopId = _this._sqoop.sqoopId;
                sqoop.taskId = _this._sqoop.taskId;
                sqoop.sqoopType = "import";
                sqoop.compressionCodec = "com.hadoop.compression.lzo.LzopCodec";
                showloading(true);
                $.ajax({
                    type: "POST",
                    url: "/sentosa/transform/sqoop/updateSqoop",
                    dataType: "json",
                    contentType: 'application/json',
                    data: JSON.stringify(sqoop),
                    success: function (result) {
                        showloading(false);
                        if (result && result.success) {
                            location.href = "importDBList.html";
                        } else {
                            $.showModal({content: result.message});
                        }
                    },
                    error: function (a, b, c) {
                        showloading(false);
                        alert(a.responseText);
                    }
                });
            }
        },

        setDBInfo:function(sqoop){
            var zifenpian = $("#zifenpian");
            this.rdbmsDbId = sqoop.rdbmsDbId;
            this.initDBtableName = sqoop.table;
            zifenpian.append('<tr>'
                + '<td style="width:36px;">'
                + '<div class="radio">'
                + '<label>'
                + '<input type="radio" name="optionsRadios">'
                + '</label>'
                + '</div>'
                + '</td>'
                + '<td>'
                + '<div class="col-sm-12 input-group-sm">'
                + '<input type="text" class="form-control" value="' + sqoop.connect + '" placeholder="" readonly>'
                + '</div>'
                + '</td>'
                + '<td>'
                + '<div class="col-sm-12 input-group-sm">'
                + '<input type="text" class="form-control tableInput" data-flag="false" data-kuId="'+sqoop.rdbmsDbId+'" data-value="'+sqoop.rdbmsTabId+'" placeholder="" value="' + sqoop.table + '">'
                + '<input type="hidden" value="' + sqoop.driver + '" placeholder="">'
                + '<input type="hidden" value="' + sqoop.username + '" placeholder="">'
                + '<input type="hidden" value="' + sqoop.password + '" placeholder="">'
                + '<span class="glyphicon glyphicon-search quickSearchIcon"></span>'
                + '</div>'
                + '</td>'
                + '</tr>');
            if(sqoop.sqoops.length>0){//多库
                $(".zifenpianfa").hide();
                var dat = sqoop.sqoops;
                for (var i = 0; i < dat.length; i++) {
                    zifenpian.append('<tr>'
                        + '<td style="width:36px;">'
                        + '<div class="radio">'
                        + '<label>'
                        + '<input type="radio" name="optionsRadios">'
                        + '</label>'
                        + '</div>'
                        + '</td>'
                        + '<td>'
                        + '<div class="col-sm-12 input-group-sm">'
                        + '<input type="text" class="form-control" value="' + dat[i].connect + '" placeholder="" readonly>'
                        + '</div>'
                        + '</td>'
                        + '<td>'
                        + '<div class="col-sm-12 input-group-sm">'
                        + '<input type="text" class="form-control tableInput" data-flag="false" data-kuId="'+sqoop.rdbmsDbId+'" data-value="'+sqoop.rdbmsTabId+'" placeholder="" value="' + dat[i].table + '">'
                        + '<input type="hidden" value="' + dat[i].driver + '" placeholder="">'
                        + '<input type="hidden" value="' + dat[i].username + '" placeholder="">'
                        + '<input type="hidden" value="' + dat[i].password + '" placeholder="">'
                        + '<span class="glyphicon glyphicon-search quickSearchIcon"></span>'
                        + '</div>'
                        + '</td>'
                        + '</tr>');
                }
            }else{//单库
                $(".zifenpianfa").show();
            }

        },

        getHive: function () {
            var _this = this;
            showloading(true);
            $.ajax({
                type: "get",
                url: "/sentosa/metadata/db/hives",
                data: {},
                success: function (result) {
                    showloading(false);
                    if (result && result.success) {
                        var dat = result.pairs.innerHiveDBs;
                        dat = dat.concat(result.pairs.marketHiveDBs);
                        $("#hiveKu").quickSearch({
                            data: dat,
                            text: "name",
                            value: "id",
                            width: "400px"
                        });
                        $("#hiveKu").changeValue(function () {
                            var id = $(this).attr("data-value");
                            $("#hivebiao").val("");
                            $("#hiveElm").html("");
                            $("#selectedElm").html("");
                            _this.hiveTerminated = "";
                            _this.getHivebiao(id);
                        });
                    } else {
                        $.showModal({content: "查询失败"});
                    }
                },
                error: function (a, b, c) {
                    showloading(false);
                    alert(a.responseText);
                }
            });
        },

        getHivebiao: function (id) {
            var _this = this;

            showloading(true);
            $.ajax({
                type: "get",
                url: "/sentosa/metadata/db/table/list",
                data: {
                    dbId: id
                },
                success: function (result) {
                    showloading(false);
                    if (result && result.success) {
                        var dat = result.pairs.dat;
                        $("#hivebiao").quickSearch({
                            data: dat,
                            text: "name",
                            value: "id",
                            width: "400px"
                        });
                        $("#hivebiao").changeValue(function () {
                            var value = $(this).attr("data-value");
                            _this.hiveTerminated = $(this).next().find("li.selected").attr("data-hiveTerminated");
                            _this.getHiveTableElm(value);
                        });
                    } else {
                        $.showModal({content: "查询失败"});
                    }
                },
                error: function (a, b, c) {
                    showloading(false);
                    alert(a.responseText);
                }
            });
        },


        getDB: function () {
            var _this = this;
            showloading(true);
            $.ajax({
                type: "get",
                url: "/sentosa/metadata/group/all",
                data: {
                    //groupId:$("#leftKu").find("i.text-light-blue").parent().attr("data-id")
                },
                success: function (result) {
                    showloading(false);
                    if (result && result.success) {
                        var dat = result.pairs.dat;
                        $("#dbjiancheng").quickSearch({
                            data: dat,
                            text: "name",
                            value: "id",
                            width: "400px"
                        });
                        $("#dbjiancheng").changeValue(function () {
                            var id = $(this).attr("data-value");
                            var isMulti = $(this).next().find("li.selected").attr("data-isMulti");
                            if (isMulti == "1") {
                                $(".zifenpianfa").hide();
                            } else {
                                $(".zifenpianfa").show();
                            }
                            _this.getKu(id);
                        });
                    } else {
                        $.showModal({content: "查询失败"});
                    }
                },
                error: function (a, b, c) {
                    showloading(false);
                    alert(a.responseText);
                }
            });
        },

        getKu: function (id) {
            var _this = this;
            showloading(true);
            $.ajax({
                type: "get",
                url: "/sentosa/metadata/group/db/list",
                data: {
                    groupId: id
                },
                success: function (result) {
                    showloading(false);
                    if (result && result.success) {
                        var dat = result.pairs.dat;
                        _this.setKutable(dat);
                    } else {
                        $.showModal({content: "查询失败"});
                    }
                },
                error: function (a, b, c) {
                    showloading(false);
                    alert(a.responseText);
                }
            });
        },

        setKutable: function (dat) {
            var zifenpian = $("#zifenpian");
            zifenpian.html("");
            $("#yuanElm").html("");
            $("#selectedElm").html("");
            for (var i = 0; i < dat.length; i++) {
                debugger;
                zifenpian.append('<tr>'
                    + '<td style="width:36px;">'
                    + '<div class="radio">'
                    + '<label>'
                    + '<input type="radio" name="optionsRadios">'
                    + '</label>'
                    + '</div>'
                    + '</td>'
                    + '<td>'
                    + '<div class="col-sm-12 input-group-sm">'
                    + '<input type="text" class="form-control" value="' + dat[i].jdbcUrl + '" placeholder="" readonly>'
                    + '</div>'
                    + '</td>'
                    + '<td>'
                    + '<div class="col-sm-12 input-group-sm">'
                    + '<input type="text" class="form-control tableInput" data-flag="false" data-kuId="' + dat[i].id + '" placeholder="">'
                    + '<input type="hidden" value="' + dat[i].driverType + '" placeholder="">'
                    + '<input type="hidden" value="' + dat[i].userName + '" placeholder="">'
                    + '<input type="hidden" value="' + dat[i].password + '" placeholder="">'
                    + '<span class="glyphicon glyphicon-search quickSearchIcon"></span>'
                    + '</div>'
                    + '</td>'
                    + '</tr>');
            }
        },

        getTable: function (id, $obj) {
            var _this = this;
            showloading(true);
            $.ajax({
                type: "get",
                url: "/sentosa/metadata/db/outer/table/list",
                data: {
                    dbId: id
                },
                success: function (result) {
                    showloading(false);
                    if (result && result.success) {
                        var dat = result.pairs.dat;
                        var _dat = [];
                        for (var i = 0; i < dat.length; i++) {
                            var d = {};
                            d.name = dat[i];
                            _dat.push(d);
                        }
                        $obj.quickSearch({
                            data: _dat,
                            text: "name",
                            value: "name",
                            width: "400px"
                        });
                        if ($obj.parent().parent().parent().index() == 0) {
                            $obj.changeValue(function () {
                                var value = $(this).attr("data-value");
                                var kuId = $(this).attr("data-kuId");
                                _this.getTableElm(value, kuId);
                            });
                        }
                        $obj.blur();
                        $obj.focus();//为了出发quicksearch的focus事件

                    } else {
                        $.showModal({content: "查询失败"});
                    }
                },
                error: function (a, b, c) {
                    showloading(false);
                    alert(a.responseText);
                }
            });
        },

        initGetTableElm: function () {
            var _this = this;
            showloading(true);
            $.ajax({
                type: "get",
                url: "/sentosa/metadata/db/outer/column/list",
                data: {
                    tableName: _this.initDBtableName,
                    dbId: _this.rdbmsDbId
                },
                success: function (result) {
                    showloading(false);
                    if (result && result.success) {
                        debugger;
                        var dat = result.pairs.dat;
                        $("#fenquziduan").quickSearch({
                            data: dat,
                            text: "name",
                            value: "isPartition",
                            width: "400px"
                        });
                        _this.initSetTableElm(dat);
                    } else {
                        $.showModal({content: "查询失败"});
                    }
                },
                error: function (a, b, c) {
                    showloading(false);
                    alert(a.responseText);
                }
            });
        },
        initSetTableElm:function(dat){
            for (var i = 0; i < dat.length; i++) {
                var flag = false;
                for(var j=0;j<this.columnMappers.length;j++){
                    if(this.columnMappers[j].sColName == dat[i].name){
                        flag = true;
                    }
                }
                if(!flag){
                    var str = '<tr>'
                        + '<td>' + dat[i].name + '</td>'
                        + '<td>' + dat[i].type + '</td>'
                        + '</tr>';
                    $("#yuanElm").append(str);
                }
            }

            $("#qiefenziduan").quickSearch({
                data: dat,
                text: "name",
                value: "id",
                width: "400px"
            });
        },

        getTableElm: function (tableName, dbId) {
            var _this = this;
            showloading(true);
            $.ajax({
                type: "get",
                url: "/sentosa/metadata/db/outer/column/list",
                data: {
                    tableName: tableName,
                    dbId: dbId
                },
                success: function (result) {
                    showloading(false);
                    if (result && result.success) {
                        var dat = result.pairs.dat;
                        $("#fenquziduan").quickSearch({
                            data: dat,
                            text: "name",
                            value: "isPartition",
                            width: "400px"
                        });
                        $("#fenquziduan").val("");
                        _this.setTableElm(dat);
                    } else {
                        $.showModal({content: "查询失败"});
                    }
                },
                error: function (a, b, c) {
                    showloading(false);
                    alert(a.responseText);
                }
            });
        },

        getHiveTableElm: function (tableId) {
            var _this = this;
            showloading(true);
            $.ajax({
                type: "get",
                url: "/sentosa/metadata/table/column/list",
                data: {
                    tableId: tableId,
                },
                success: function (result) {
                    showloading(false);
                    if (result && result.success) {
                        var dat = result.pairs.dat;
                        _this.setHiveTableElm(dat);
                    } else {
                        $.showModal({content: "查询失败"});
                    }
                },
                error: function (a, b, c) {
                    showloading(false);
                    alert(a.responseText);
                }
            });
        },

        setInitTableElm:function(columnMappers){
            for(var i=0;i<columnMappers.length;i++){
                var str = '<tr>'
                    + '<td>' + columnMappers[i].sColName + '</td>'
                    + '<td>' + columnMappers[i].sColType + '</td>'
                    + '</tr>';
                $("#selectedElm").append(str);
                var str1 = '<tr>'
                    + '<td data-colId="'+columnMappers[i].colId+'" data-cTaskId="'+columnMappers[i].cTaskId+'">' + columnMappers[i].tColName + '</td>'
                    + '<td>' + columnMappers[i].tColType + '</td>'
                    + '</tr>';
                $("#hiveElm").append(str1);
            }
        },

        setTableElm: function (dat) {
            $("#yuanElm").empty();
            $("#selectedElm").empty();
            for (var i = 0; i < dat.length; i++) {
                var str = '<tr>'
                    + '<td>' + dat[i].name + '</td>'
                    + '<td>' + dat[i].type + '</td>'
                    + '</tr>';
                $("#yuanElm").append(str);
            }

            $("#qiefenziduan").quickSearch({
                data: dat,
                text: "name",
                value: "id",
                width: "400px"
            });
            $("#qiefenziduan").val("");
        },

        setHiveTableElm: function (dat) {
            $("#hiveElm").empty();
            $("#selectedElm").empty();
            this.partKey = "";
            for (var i = 0; i < dat.length; i++) {
                if (dat[i].isPartition == 0) {
                    var str = '<tr>'
                        + '<td>' + dat[i].name + '</td>'
                        + '<td>' + dat[i].type + '</td>'
                        + '</tr>';
                    $("#hiveElm").append(str);
                } else if (dat[i].isPartition == 1) {
                    this.partKey = dat[i].name;
                }
            }
            if (this.partKey != "") {
                $(".fenquOperate").show();
                $("input[name=fenquType]:eq(0)").trigger("click");
                $("#fenqubiaodashi").show();
                $("#dongtaifenduDiv").hide();
            } else {
                $(".fenquOperate").hide();
                $("#dongtaifenduDiv").hide();
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
                        $.showModal({conent: "查询联系人失败"});
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
    channelModify.init();
});
