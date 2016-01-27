define(function (require, exports, module) {
    var $ = require('$');
    var TZT = new (require('tzt'))($);
    var oTools = TZT.TOOLS;
    var myScroll;
    var socid = "", type = "";
    $(function () {
        init();
    });
    function init() {
        socid = TZT.getUrlParameter("socid");
        type = TZT.getUrlParameter("type");
        action41048();
        myScroll = oTools.iscroll('#wrapper');
    }
    function action41048() {
        var oSend = {
            action: "41048",
            uniqueid: "($tztuniqueid)",
            socid: socid,//消息id
            type: type//消息类型
        };
        TZT.getData(TZT.REQ.XML, oSend, function (oData) {
            var datetime = oData.MSGDATE;
            var date = datetime.substr(0, 8);
            var time = datetime.substr(8, 6);
            $(".j_title").html(oData.TITLE);
            $(".j_date").html(date.substr(0, 4) + "-" + date.substr(4, 2) + "-" + date.substr(6, 2));
            $(".j_time").html(time.substr(0, 2) + ':' + time.substr(2, 2) + ':' + time.substr(4, 2));
            $(".j_comeform").html('来源:'+oData.MSGFROM);
            $(".j_msgcontent").html(oData.GRID0.join("<br/>"));
            myScroll.refresh();
        });
    }
});