/// <reference path="../../../../lib/jquery/jquery.js" />
/// <reference path="../../../../lib/common/common.js" />
define(function (require, exports, module) {
    var $ = require('$');
    var TZT = new (require('tzt'))($);
    $(function () {
        init();
    });
    function init() {
        action5014();
    }
    //新股申购额度
    function action5014() {
        var oSend = {
            action: 5014,
            MobileCode: '($MobileCode)',
            Token: '($Token)',
            Reqno: +new Date(),
            ReqlinkType: 1,
            StartPos: 0,
            MaxCount: 1000
        };
        TZT.getData(TZT.REQ.XML, oSend, function (oData) {
            oData.GRID0.shift();
            $.each(oData.GRID0, function (i,item) {
                var aItem = item.split('|');
                //市场类别
                var markettype = aItem[oData.MARKET];
                var quota = aItem[oData.CUSTOMERAMOUNTS];
                if (markettype == '深A') {
                    $('.j_sz').html(quota+'股');
                }
                else if (markettype == '沪A') {
                    $('.j_sh').html(quota + '股');
                }
            });
        });
    }
    
});