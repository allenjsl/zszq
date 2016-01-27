define(function (require, exports, module) {
    var $ = require('$');
    var slide = require('slide');
    var TZT = new (require('tzt'))($);
    var oTools = TZT.TOOLS;
    var myScroll;
    $(function () {
        init();
    });
    function init() {
        action41035();
        pageEvent();
        myScroll = oTools.iscroll('#wrapper');
    }
    function pageEvent() {
        $('.j_menulist').delegate('.line', 'click', function () {
            var currentmenuid = $(this).attr('data-id');
            action10061('/zsjy/app/wd/wd-cxx/wd-cxx.html?menuid=' + currentmenuid);
        });
    }
    //推送栏目
    function action41035() {
        var oSend = {
            action: "41035",
            uniqueid: '($tztuniqueid)'
        };
        TZT.getData(TZT.REQ.XML, oSend, function (oData) {
            var sDom = '';
            $.each(oData.GRID0, function (i, item) {
                var aItem = item.split('|');
                var menu_id = aItem[2];
                //栏目名称
                var menu_name = aItem[3];
                //栏目简介
                var menu_desc = aItem[4];
                sDom += '<div data-id="' + menu_id + '" class="line">' +
menu_name
        + '</div>';
            });
            $('.j_menulist').html(sDom);
        });
    }
});