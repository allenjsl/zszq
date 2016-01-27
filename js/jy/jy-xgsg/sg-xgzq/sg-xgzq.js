/// <reference path="../../../../lib/jquery/jquery.js" />
/// <reference path="../../../../lib/common/common.js" />
define(function (require, exports, module) {
    var $ = require('$');
    var TZT = new (require('tzt'))($);
    var oTools = TZT.TOOLS;
    var begindate = '';
    var enddate = new Date().Format('yyyyMMdd');
    var j_zqlist = $('.j_zqlist');
    var myScroll;
    var nMaxCount = 1;
    $(function () {
        init();
    });
    function init() {
        var now = new Date();
        //结束时间就是今天
        enddate = now.Format('yyyyMMdd');
        //开始时间提前一个月
        begindate = new Date(now.setMonth(now.getMonth() - 1)).Format('yyyyMMdd');
        oTools.setHeight(j_zqlist, 40);
        action349(nMaxCount);
        myScroll = oTools.iscroll('#wrapper', function (type, fn) {
            if (type == 'more') {
                nMaxCount += 10;
                action349(nMaxCount, 'more', fn);
            }
            else {
                nMaxCount = 1;
                action349(nMaxCount, '', fn);
            }
        });
    }
    function action349(ncount, type, fn) {
        var oSend = {
            action: 349,
            MobileCode: '($MobileCode)',
            Token: '($Token)',
            Reqno: +new Date(),
            ReqlinkType: 1,
            StartPos: ncount,
            MaxCount: 10,
            BEGINDATE: begindate,
            ENDDATE: enddate
        };
        TZT.getData(TZT.REQ.XML, oSend, function (oData) {
            var errormsg = oData.ERRORMESSAGE;
            if (errormsg == '查无记录!' || !oData.GRID0)
            {
                if (ncount == 1 || type != 'more') {
                    j_zqlist.html(TZT.nodatadom);
                } fn && fn(); return;
            }
            var sDom = '';
            oData.GRID0.shift();
            $.each(oData.GRID0, function (i,item) {
                var aItem = item.split('|');
                //股票名称
                var sStockName = aItem[oData.STOCKNAME];
                //股票代码
                var sStockCode = aItem[oData.STOCKCODE];
                //中签数量
                var sZQCount = aItem[oData.TICKETNUMBER];
                //中签日期
                var sZQDate = aItem[oData.TICKETDATE];
                sDom += '<div class="list">' +
                '<div class="item item-one">' +
                    '<p class="name">' + sStockName + '</p>' +
                    '<p class="time">' + sStockCode + '</p>' +
                '</div>' +
                '<div class="item item-two">' +
                  sZQCount +
                '</div>' +
                '<div class="item item-three">' +
                    sZQDate +
                '</div>' +
            '</div>';
            });
            if (type == 'more') {
                j_zqlist.append(sDomCC);
            } else {
                j_zqlist.html(sDom);
            }
            fn && fn();
        });
    }
});