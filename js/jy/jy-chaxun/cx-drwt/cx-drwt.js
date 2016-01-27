/// <reference path="../../../../lib/jquery/jquery.js" />
/// <reference path="../../../../lib/common/common.js" />
define(function (require, exports, module) {
    var $ = require('$');
    var slide = require('slide');
    var TZT = new (require('tzt'))($);
    var oTools = TZT.TOOLS;
    var myScroll;
    var nMaxCount = 1;
    var j_drwtlist = $('.j_drwtlist');
    $(function () {
        init();
    });
    function init() {
        oTools.setHeight($('#wrapper'), 40);
        action113(nMaxCount);
        myScroll = oTools.iscroll('#wrapper', function (type, fn) {
            if (type == 'more') {
                nMaxCount += 10;
                action113(nMaxCount, 'more', fn);
            }
            else {
                nMaxCount = 1;
                action113(nMaxCount, '', fn);
            }
        });
    }
    function action113(ncount, type, fn) {
        var oSend = {
            action: 113,
            MobileCode: '($MobileCode)',
            Token: '($Token)',
            Reqno: +new Date(),
            ReqlinkType: 1,
            StartPos: ncount,
            MaxCount: 10
        }
    TZT.getData(TZT.REQ.XML, oSend, function (oData) {
        var errormsg = oData.ERRORMESSAGE;
        if (errormsg == '查无记录!' || !oData.GRID0)
        {
            if (ncount == 1 || type != 'more') {
                j_drwtlist.html(TZT.nodatadom);
            }
            fn && fn(); return;
        }
        var sDom = '';
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
        $.each(oData.GRID0, function (i, item) {
            var aItem = item.split('|');
            //委托序号
            var sCONTACTINDEX = aItem[oData.CONTACTINDEX];
            //股票名称
            var sStockName = aItem[oData.STOCKNAMEINDEX];
            //委托时间
            var sWtTimer = aItem[oData.TIMEINDEX];
            sWtTimer = sWtTimer.substr(0, 2) + ':' + sWtTimer.substr(2, 2) + ':' + sWtTimer.substr(4, 2);
            //委托价格
            var sWtPrice = toPrice(aItem[oData.AMOUNTCJINDEX], 3);
            //成交价格
            var sCJPrice = toPrice(aItem[oData.TRANSPRICE], 3);
            //委托数量
            var sWT = aItem[oData.STOCKNUMINDEX];
            //成交数量
            var sCJ = aItem[oData.CJNUMINDEX];
            //买卖类别
            var sMMLB = aItem[oData.BUYDIRECTIONINDEX];
            //委托状态
            var sWTZT = aItem[oData.RESULTINDEX];
            //股票代码
            var sStockCode = aItem[oData.STOCKINDEX];
            var css = (sMMLB.indexOf('买入') > -1 ? "buy" : "sale");
            sDom += '<div class="list">' +
                '<div class="item item-one ' + css + '">' +
                    sMMLB +
                '</div>' +
                '<div class="item item-two">' +
                    '<p>' + sStockName + '</p>' +
                    '<p>' + sWtTimer + '</p>' +
                '</div>' +
                '<div class="item item-three">' +
                   '<p>' + sWtPrice + '</p>' +
                   ' <p>' + sCJPrice + '</p>' +
                '</div>' +
                '<div class="item item-four">' +
                    '<p>' + sWT + '</p>' +
                    '<p>' + sCJ + '</p>' +
                '</div>' +
               ' <div class="item item-five">' +
                   sWTZT +
               ' </div>' +
            '</div>';
        });
        if (type == 'more') {
            j_drwtlist.append(sDom);
        } else {
            j_drwtlist.html(sDom);
        }
        fn && fn();
    });
}
});