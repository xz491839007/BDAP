define(['jquery'],function($){
    /**
     * Created by user on 16/6/12.
     */
    $.fn.quickSearch = function(options){
        var settings = {
            data:[],  //数据来源
            text:"",    //显示的值 getText
            value:"",    //getValue值,
            width: "" //下拉框的宽度,
        };

        this.settings = $.extend({}, settings, options);
        //this.settings.width = this.css("width")?(parseInt(this.css("width").replace("px","")) + "px"):"200px";//宽度是输入框的宽度,写死
        var _this = this;
        this.firstFlag = true;
        this.focus(_showSelect);
        this.keyup(function (e) {
            var e = e || window.event;
            var value = _this.val();
            if(e.keyCode != 38 && e.keyCode != 40){
                _this.quickTimeOut = setTimeout(function () {
                    quickSearchSelect(value);
                }, 500)
            }
        });
        this.keydown(function (e) {
            var e = e || window.event;
            clearTimeout(_this.quickTimeOut);
            var selected = _this._thisSelect.find(".selected");
            var top = 0;
            if(e.keyCode == 38){//上
                if(_this._thisSelect.find(".selected").length == 0){
                    _this._thisSelect.find("li:last-child").addClass("selected");
                    top = _this._thisSelect[0].scrollHeight;
                }else{
                    if(selected.prev().length == 0){
                    }else{
                        selected.prev().addClass("selected");
                        selected.removeClass("selected");
                        top = selected.prev().offset().top - _this._thisSelect.offset().top + _this._thisSelect.scrollTop();
                    }
                }
                _thisSelect.scrollTop(top);
                return;
            }
            if(e.keyCode == 40){//下
                if(_this._thisSelect.find(".selected").length == 0){
                    _this._thisSelect.find("li:first-child").addClass("selected");
                    top = 0;
                }else{
                    if(selected.next().length == 0){
                        top = _this._thisSelect[0].scrollHeight;
                    }else{
                        selected.next().addClass("selected");
                        selected.removeClass("selected");
                        top = selected.next().offset().top - _this._thisSelect.offset().top + _this._thisSelect.scrollTop();
                    }
                }
                _this._thisSelect.scrollTop(top);
                return;
            }

            if(e.keyCode == 13){//回车
                var select = _this._thisSelect.find(".selected");
                if(select.length != 0){
                    _setValue(select);
                }
                return;
            }
        });
        this.blur(function(){
            var value = _this.val();
            checkValue(value);
        });

        function checkValue(value){
            var _data = _this.settings.data;
            var flag = false;
            for(var i=0;i<_data.length;i++){
                var text = _data[i][_this.settings.text];
                if(text == value){
                    flag = true;
                    break;
                }
            }
            if(!flag){
                _this.val("");
            }
        }

        function quickSearchSelect(value){
            var _data = _this.settings.data;
            var selectStr = "";
            for(var i=0;i<_data.length;i++){
                var elementStr = " ";
                for(var k in _data[i]){
                    elementStr = elementStr + ' data-' + k + '="' + _data[i][k]+'" ';
                }
                var text = _data[i][_this.settings.text];
                if(text.toLowerCase().indexOf(value.toLowerCase()) > -1){
                    selectStr = selectStr + '<li data-value="'+_data[i][_this.settings.value]+'" '+elementStr+'>'
                        +  text
                        + '</li>'
                }
            }
            _this._thisSelect.html(selectStr);
            bindEvent();
        }

        //收起下拉框
        $(window).click(function(e){
            var e = e || window.event;
            if(e.target.tagName == 'LI' || e.target.tagName == 'INPUT'){
                return;
            }else{
                _hideSelect();
            }
        });

        //下拉框信息
        function _showSelect(){
            $(".my_quick_search").hide();
            var _data = _this.settings.data;
            var selectStr = "";
            for(var i=0;i<_data.length;i++){
                var elementStr = " ";
                for(var k in _data[i]){
                    elementStr = elementStr + ' data-' + k + '="' + _data[i][k]+'" ';
                }
                selectStr = selectStr + '<li data-value="'+_data[i][_this.settings.value]+'" '+elementStr+'>'
                    + _data[i]
                    + '</li>'
            }
            if(_this.siblings(".my_quick_search").length>0){
                _this._thisSelect = _this.siblings(".my_quick_search");
                _this.siblings(".my_quick_search").html(selectStr);
            }else{
                selectStr = '<ul class="my_quick_search">'+selectStr+'</ul>';
                _this.after(selectStr);
                _this._thisSelect = _this.next();
            }
            if(_this.settings.width!="")  _this._thisSelect.css("width",_this.settings.width);
            bindEvent();
            _this._thisSelect && _this._thisSelect.slideDown(200);
        }

        //绑定下拉框的click事件
        function bindEvent(){
            _this._thisSelect.find("li").click(function(){
                _setValue($(this));
            });
        }

        /*
         * 1.选中的li
         * */
        function _setValue($li){
            var text = $li.text();
            var value = $li.attr("data-value");
            $li.siblings().removeClass("selected");
            $li.addClass("selected");
            _this.attr("data-value",value);
            _this.val(text);
            _this.fun && _this.fun();
            _hideSelect();
        }

        $.fn.changeValue = function(fun){
            _this.fun = fun;
        }

        //隐藏下拉框
        function _hideSelect(){
            _this._thisSelect&&_this._thisSelect.hide();
        }

        /*
         * 获取value的方法
         * */
        $.fn.getValue = function(){
            if(this.val() != ""){
                return _this.attr("data-value");
            }
            return "";
        }

        /*
         * 获取输入框的值的方法 相当于val()
         * */
        $.fn.getText = function(){
            return _this.val();
        }
        $.fn.setData =  function(data){
            _this.settings.data = data;
        }
        $.fn.getDataAttr =function(key){
            if(this.val() != "" && _this._thisSelect){
                var select = _this._thisSelect.find(".selected");
                if(select.length != 0){
                    return select.attr("data-"+key);
                }
            }
            return "";
        }

    }


});