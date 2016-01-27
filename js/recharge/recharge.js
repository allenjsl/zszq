/// <reference path="../../lib/jquery/jquery.js" />
/// <reference path="../../lib/common/common.js" />
define(function (require, exports, module) {
    var $ = require('$');
    var TZT = new (require('tzt'))($);
    var contront = '';
    $(function () {
        init();
    });
    function init() {
        contront = TZT.getUrlParameter('contront');
        getLS();
        pageEvent();
    }
    function pageEvent() {
        $('.j_goindex').on('click', function () {
            action10002();
        });
        $('.j_chals').on('click', function () {
            actioncz();
        });
    }
    function getLS() {
        var oSend = {
            action: 127,
            MobileCode: '($MobileCode)',
            Token: '($Token)',
            reqno: +new Date(),
            Startpos: 0,
            ContactID:contront,
            MaxCount: 1000
        };
        TZT.getData(TZT.REQ.XML, oSend, function (oData) {
            if (oData.ERRORMESSAGE == '查无记录!' || !oData.GRID0) {
                var dd = setTimeout(function () {
                    getLS(); clearTimeout(dd);
                }, 1000);
                return;
            }
            oData.GRID0.shift();
            var ifre = true;
            var ifrego = true;
            $.each(oData.GRID0, function (i, item) {
                var aItem = item.split('|');
                var status=aItem[7];
                if (aItem[8] == contront) {
                    var _arr = ['成功', '已冲正', '调整为成功'];
                    if (_arr.indexOf(status) > -1) {
                        ifre = false; return false;
                    }
                    else if (status == '已报' || status == '待报') {
                        var dd = setTimeout(function () {
                            getLS(); clearTimeout(dd);
                        }, 1000);
                        ifrego = false;  return false;
                    }
                        //跳到失败页面
                    else {
                        action1964('/zsjy/app/recharge/error.html'); ifrego = false; return false;
                    }
                   
                }
            });
            if (!ifrego) { return;}
            if (ifre) {
                var dd = setTimeout(function () {
                    getLS(); clearTimeout(dd);
                }, 1000);
            }
            else {
                action1964('https://zx.zszq.com/xjt-transfer-sucess?_device=mobile'); return;
            }
        });
    }
});