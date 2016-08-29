/**
 * Created by user on 16/6/20.
 */
require(['jquery','jquery.bootstrap','jquery.datetimepicker','common','quickSearch','app'],function($){
    var exportDB = {

        quickTimeOut: "",

        partKey: "",

        hiveTerminated: "",

        jdbcUrl: "",

        objKu: null,

        driverType:"",

        mainkuId:"",

        selectUserName:"",

        init: function () {
            this.initEvent();
            this.getUser();
            this.getDB();
            this.getHive();
        },

        initEvent: function () {
            var _this = this;

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

            $("#saveInfo").click(function () {
                _this.saveInfo();
            });
        },

        saveInfo: function () {
            var _this = this;
            var verifyFlag = verifyEmpty(
                [
                    {name: "taskName", label: "任务名"},
                    {name: "userNames", label: "负责人"},
                    {name: "hiveKu", label: "Hive库"},
                    {name: "hivebiao", label: "Hive表"},
                    {name: "desc", label: "描述"}
                ]
            );

            if (verifyFlag) {
                var sqoop = {};
                sqoop.sqoopName = $("#taskName").val();
                sqoop.administrator = $("#userNames").val();
                sqoop.dbAbbr = $("#mubiaoku").val();

                sqoop.hiveDbName = $("#hiveKu").val();
                sqoop.hiveDbId = $("#hiveKu").attr("data-value");
                sqoop.targetDir = $("#hivebiao").next().find("li.selected").attr("data-location");
                sqoop.hiveTable = $("#hivebiao").val();
                sqoop.hiveTabId = $("#hivebiao").attr("data-value");
                var ispartition = $("#hivebiao").next().find("li.selected").attr("data-ispartition");
                sqoop.partType = ispartition == "1" ? 1 : 2;
                sqoop.fieldsTerminatedBy = _this.hiveTerminated;
                sqoop.partKey = _this.partKey;
                sqoop.table = $("#mubiaobiao").val();
                sqoop.rdbmsDbId = _this.mainkuId;
                sqoop.rdbmsTabId = "1";//该字段没用
                sqoop.selectUserName = _this.selectUserName;



                sqoop.connect = _this.jdbcUrl;
                sqoop.username = _this.objKu.userName;
                sqoop.password = _this.objKu.password;

                var columnMappers = [];
                var selectedElmTrs = $("#selectedElm tr"), hiveElmTrs = $("#hiveElm tr");
                if (selectedElmTrs.length != hiveElmTrs.length) {
                    showTip("源字段和hive表字段必须一一对应.");
                    return;
                }
                for (var k = 0; k < selectedElmTrs.length; k++) {
                    var ColumnMapper = {};
                    ColumnMapper.sColName = selectedElmTrs.eq(k).find("td").eq(0).html();
                    ColumnMapper.sColType = selectedElmTrs.eq(k).find("td").eq(1).html();
                    ColumnMapper.tColName = hiveElmTrs.eq(k).find("td").eq(0).html();
                    ColumnMapper.tColType = hiveElmTrs.eq(k).find("td").eq(1).html();
                    columnMappers.push(ColumnMapper);
                }
                sqoop.columnMappers = columnMappers;

                sqoop.partVal = $("#hivefentubiaodashi").val();
                sqoop.where = $("#where").val();
                sqoop.describe = $("#desc").val();

                sqoop.driver = _this.driverType;
                sqoop.sqoopType = "export";
                sqoop.compressionCodec = "com.hadoop.compression.lzo.LzopCodec";
                debugger;
                showloading(true);
                $.ajax({
                    type: "POST",
                    url: "/sentosa/transform/sqoop/saveSqoop",
                    dataType: "json",
                    contentType: 'application/json',
                    data: JSON.stringify(sqoop),
                    success: function (result) {
                        showloading(false);
                        if (result && result.success) {
                            location.href = "exportDBList.html";
                        } else {
                            $.showModal({content: "保存失败:"+result.message});
                        }
                    },
                    error: function (a, b, c) {
                        showloading(false);
                        alert(a.responseText);
                    }
                });
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
            $("#hivebiao").val("");
            $("#hiveElm").html("");
            _this.hiveTerminated = "";
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
                        $("#mubiaoku").quickSearch({
                            data: dat,
                            text: "name",
                            value: "id",
                            width: "400px"
                        });
                        $("#mubiaoku").changeValue(function () {
                            var id = $(this).attr("data-value");
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
            $("#mubiaobiao").val("");
            $("#selectedElm").html("");
            $("#yuanElm").html("");
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
                        debugger;
                        _this.objKu = dat[0];
                        var mainkuId = dat[0].id;
                        _this.mainkuId = mainkuId;
                        _this.jdbcUrl = dat[0].jdbcUrl;
                        _this.driverType = dat[0].driverType;
                        _this.selectUserName = dat[0].selectUserName;
                        _this.getTable(mainkuId, $("#mubiaobiao"));
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
        //
        //getDankuTable: function (id) {
        //    var _this = this;
        //    showloading(true);
        //    $.ajax({
        //        type: "get",
        //        url: "/sentosa/metadata/group/db/table/list",
        //        data: {
        //            groupId: id
        //        },
        //        success: function (result) {
        //            showloading(false);
        //            if (result && result.success) {
        //                var dat = result.pairs.dat;
        //                $("#mubiaobiao").quickSearch({
        //                    data: dat,
        //                    text: "name",
        //                    value: "id",
        //                    width: "400px"
        //                });
        //                $("#mubiaobiao").changeValue(function () {
        //                    var id = $(this).attr("data-value");
        //                    _this.getKu(id);
        //                });
        //            } else {
        //                $.showModal({content: "查询失败"});
        //            }
        //        },
        //        error: function (a, b, c) {
        //            showloading(false);
        //            alert(a.responseText);
        //        }
        //    });
        //},

        setKutable: function (dat) {
            var zifenpian = $("#zifenpian");
            zifenpian.html("");
            $("#yuanElm").html("");
            for (var i = 0; i < dat.length; i++) {
                zifenpian.append('<tr>'
                    + '<td>'
                    + '<div class="radio">'
                    + '<label>'
                    + '<input type="radio" name="optionsRadios">'
                    + '</label>'
                    + '</div>'
                    + '</td>'
                    + '<td>'
                    + '<div class="col-sm-8 input-group-sm">'
                    + '<input type="text" class="form-control" value="' + dat[i].jdbcUrl + '" placeholder="" readonly>'
                    + '</div>'
                    + '</td>'
                    + '<td>'
                    + '<div class="col-sm-8 input-group-sm">'
                    + '<input type="text" class="form-control tableInput" data-flag="false" data-kuId="' + dat[i].id + '" placeholder="">'
                    + '<input type="hidden" value="' + dat[i].driverType + '" placeholder="">'
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
                    debugger;
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
                                _this.getTableElm(id, value);
                            });
                        }
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

        getTableElm: function (dbId, tableName) {
            var _this = this;
            $("#yuanElm").html("");
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
                    debugger;
                    if (result && result.success) {
                        var dat = result.pairs.dat;
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


        },

        setHiveTableElm: function (dat) {
            $("#hiveElm").empty();
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
            } else {
                $(".fenquOperate").hide();
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
    exportDB.init();
});
