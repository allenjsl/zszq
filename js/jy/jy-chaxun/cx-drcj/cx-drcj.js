/// <reference path="../../../../lib/jquery/jquery.js" />
/// <reference path="../../../../lib/common/common.js" />
define(function (require, exports, module) {
    var $ = require('$');
    var slide = require('slide');
    var TZT = new (require('tzt'))($);
    var oTools = TZT.TOOLS;
    var myScroll;
    var nMaxCount = 1;
    var j_drcjlist = $('.j_drcjlist');
    $(function () {
        init();
    });
    function init() {
        oTools.setHeight($('#wrapper'), 40);
        action114(nMaxCount);
        myScroll = oTools.iscroll('#wrapper', function (type, fn) {
            if (type == 'more') {
                nMaxCount += 10;
                action114(nMaxCount, 'more', fn);
            }
            else {
                nMaxCount = 1;
                action114(nMaxCount, '', fn);
            }
        });
    }
    //当日成交
    function action114(ncount, type, fn) {
        var oSend = {
            action: '114',
            MobileCode: '($MobileCode)',
            Token: '($Token)',
            Reqno: +new Date(),
            ReqlinkType: 1,
            StartPos: ncount,
            MaxCount: 10
        };
        TZT.getData(TZT.REQ.XML, oSend, function (oData) {
            var errormsg = oData.ERRORMESSAGE;
            if (errormsg == '查无记录!'|| !oData.GRID0)
            {
                if (ncount == 1 || type != 'more') {
                    j_drcjlist.html(TZT.nodatadom);
                }
                fn && fn(); 
                return;
            }
            //oData.GRID0.shift();
            function toPrice(price, pointsize){
            	if(price == ''){
            		return '';
            	}
            	if(price.substr(0, 1) == '.'){
            		price = '0' + price;
            	}
            	return (+price).toFixed(pointsize);
            };
            var sDom = '';
            $.each(oData.GRID0, function (i, item) {
                var aItem = item.split('|');
                //交易类型  买  卖
                var sTransType = aItem[oData.TRANSTYPE];
                //股票名称
                var sStockName = aItem[oData.STOCKNAME];
                //成交时间
                var sCJTimer = aItem[oData.CLOSTIME];
                sCJTimer = sCJTimer.substr(0, 2) + ':' + sCJTimer.substr(2, 2) + ':' + sCJTimer.substr(4, 2);
                //成交价
                var sCJPrice = toPrice(aItem[oData.TRANSPRICE], 3);
                //成交量
                var sCJCount = aItem[oData.CJSTOCKNUMINDEX];
                //成交额
                var sCJE = aItem[oData.TURNOVER];
                var css = (sTransType.indexOf('买入') > -1 ? "buy" : "sale");
                sDom += '<div class="list">' +
                '<div class="item item-one ' + css + '">' +
                    sTransType +
                '</div>' +
                '<div class="item item-two">' +
                    '<p>' + sStockName + '</p>' +
                    '<p>' + sCJTimer + '</p>' +
                '</div>' +
                '<div class="item item-three">' +
                   sCJPrice +
               ' </div>' +
               ' <div class="item item-four">' +
                    sCJCount +
                '</div>' +
                '<div class="item item-five">' +
                    sCJE +
                '</div>' +
            '</div>';
            });
            if (type == 'more') {
                j_drcjlist.append(sDomCC);
            } else {
                j_drcjlist.html(sDom);
            }
            fn && fn();
        });
    }
});