/// <reference path="../../../../lib/jquery/jquery.js" />
/// <reference path="../../../../lib/common/common.js" />
define(function (require, exports, module) {
    var $ = require('$');
    var slide = require('slide');
    var TZT = new (require('tzt'))($);
    var oTools = TZT.TOOLS;
    var myScroll;
    var nMaxCount = 1;
    var j_lswt = $('.j_lswt');
    //url传参
    var urlParam = {
        begindate: '',
        enddate: ''
    };
    $(function () {
        urlParam.begindate = TZT.getUrlParameter('begindate');
        urlParam.enddate = TZT.getUrlParameter('enddate');
        init();
    });
    function init() {
        oTools.setHeight($('#wrapper'), 40);
        action5018(nMaxCount);
        myScroll = oTools.iscroll('#wrapper', function (type, fn) {
            if (type == 'more') {
                nMaxCount += 10;
                action5018(nMaxCount, 'more', fn);
            }
            else {
                nMaxCount = 1;
                action5018(nMaxCount, '', fn);
            }
        });
    }
    function action5018(nCount, type, fn) {
        var oSend = {
            action: 5018,
            MobileCode: '($MobileCode)',
            Token: '($Token)',
            Reqno: +new Date(),
            ReqlinkType: 1,
            StartPos: nCount,
            MaxCount: 10,
            BeginDate: urlParam.begindate,
            EndDate: urlParam.enddate
        };
        TZT.getData(TZT.REQ.XML, oSend, function (oData) {
            if (oData.ERRORMESSAGE == '查无记录!' || !oData.GRID0) {
                if (nCount == 1 || type != 'more') {
                    j_lswt.html(TZT.nodatadom);
                }
                fn && fn(); return;
            }
            var sDom = '';
            //oData.GRID0.shift();
            $.each(oData.GRID0, function (i, item) {
                var aItem = item.split('|');
                //交易类型
                var sBuyType = aItem[oData.TRANSTYPE];
                //委托时间
                var sWTTime = aItem[oData.DATEINDEX];
                //sWTTime = sWTTime.substr(0, 2) + ':' + sWTTime.substr(2, 2) + ':' + sWTTime.substr(4, 2);
                //股票名称
                var sStockName = aItem[oData.STOCKNAME];
                //委托价格
                var sWTPrice = (+aItem[oData.AMOUNTINDEX]).toFixed(3);
                //成交价格
                var sCJPrice = (+aItem[oData.TRANSPRICE]).toFixed(3);//无
                //委托数量
                var sWTCount = aItem[oData.ENTRNUMBER];
                //成交数量
                var sCJCount = aItem[oData.CLINCHQUANTITY];
                //状态
                var sStatus = aItem[oData.STATE];
                var css = sBuyType.indexOf('买入') > -1 ? "buy" : "sale";
                sDom += '<div class="list">' +
                '<div class="item item-one ' + css + '">' +
                    sBuyType +
                '</div>' +
                '<div class="item item-two">' +
                    '<p>' + sStockName + '</p>' +
                    '<p>' + sWTTime + '</p>' +
               ' </div>' +
               ' <div class="item item-three">' +
                  ' <p>' + sWTPrice + '</p>' +
                    '<p>' + sCJPrice + '</p>' +
                '</div>' +
                '<div class="item item-four">' +
                   '<p>' + sWTCount + '</p>' +
                    '<p>' + sCJCount + '</p>' +
                '</div>' +
                '<div class="item item-five">' +
                  sStatus +
                '</div>' +
            '</div>';
            });
            if (!sDom) {
                if (nCount == 1 || type != 'more') {
                    j_lswt.html(TZT.nodatadom);
                }
                fn && fn(); return;
            }
            if (type == 'more') {
                j_lswt.append(sDom);
            } else {
                j_lswt.html(sDom);
            }
            fn && fn();
        });
    }
});