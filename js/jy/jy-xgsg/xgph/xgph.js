/// <reference path="../../../../lib/jquery/jquery.js" />
/// <reference path="../../../../lib/common/common.js" />
define(function (require, exports, module) {
    var $ = require('$');
    var TZT = new (require('tzt'))($);
    var oTools = TZT.TOOLS;
    var j_xgphlist = $('.j_xgphlist');
    var begindate = '';
    var enddate = new Date().Format('yyyyMMdd');
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
        oTools.setHeight($('#wrapper'), 40);
        action7102(nMaxCount);
        myScroll = oTools.iscroll('#wrapper', function (type, fn) {
            if (type == 'more') {
                nMaxCount += 10;
                action7102(nMaxCount, 'more', fn);
            }
            else {
                nMaxCount = 1;
                action7102(nMaxCount, '', fn);
            }
        });
    }
    function action7102(ncount, type, fn) {
        var oSend = {
            action: 7102,
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
                    j_xgphlist.html(TZT.nodatadom);
                } fn && fn(); return;
            }
            var sDom = '';
            $.each(oData.GRID0, function (i, item) {
                var aItem = item.split("|");
                //股票名称
                var sStockName = aItem[oData.STOCKNAME];
                //股票代码
                var sStockCode = aItem[oData.STOCKCODE];
                //申购数量（配号数量）
                var sSGCount = aItem[oData.DISTRIBUTIONNUMBER];
                //起始配号
                var sQSPH = aItem[oData.DISTRIBUTIONSTART];
                //申购日期（配号日期）
                var sSGRQ = aItem[oData.DISTRIBUTIONDATE];
                sDom += '<div class="list">' +
                '<div class="item item-one">' +
                    '<p class="name">' + sStockName + '</p>' +
                    '<p class="time">' + sStockCode + '</p>' +
               ' </div>' +
               ' <div class="item item-two">' +
                    sSGCount +
               ' </div>' +
                '<div class="item item-three">' +
                   sQSPH +
               ' </div>' +
               ' <div class="item item-four">' +
                  sSGRQ +
                '</div>' +
           ' </div>';
            });
            if (type == 'more') {
                j_xgphlist.append(sDomCC);
            } else {
                j_xgphlist.html(sDom);
            }
            fn && fn();
        });
    }
});