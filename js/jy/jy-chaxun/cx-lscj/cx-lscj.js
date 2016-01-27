/// <reference path="../../../../lib/jquery/jquery.js" />
/// <reference path="../../../../lib/common/common.js" />
define(function (require, exports, module) {
    var $ = require('$');
    var slide = require('slide');
    var TZT = new (require('tzt'))($);
    var oTools = TZT.TOOLS;
    var myScroll;
    var nMaxCount = 1;
    var j_lscj = $('.j_lscj');
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
        action115(nMaxCount);
        myScroll = oTools.iscroll('#wrapper', function (type, fn) {
            if (type == 'more') {
                nMaxCount += 10;
                action115(nMaxCount, 'more', fn);
            }
            else {
                nMaxCount = 1;
                action115(nMaxCount, '', fn);
            }
        });
    }
    function action115(nCount, type, fn) {
        var oSend = {
            action: 115,
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
                    j_lscj.html(TZT.nodatadom);
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
                //方向
                var sBuyType = aItem[oData.TRANSTYPE];
                //成交时间
                var sWTTimer = aItem[oData.CLOSINGDATE];
                //sWTTimer = sWTTimer.substr(0, 2) + ':' + sWTTimer.substr(2, 2) + ':' + sWTTimer.substr(4, 2);
                //股票名称
                var sStockName = aItem[oData.STOCKNAME];
                //成交价格
                var sCJPrice = toPrice(aItem[oData.TRANSPRICE], 3);
                //委托数量
                var sWTCount = aItem[oData.ENTRNUMBER];
                //成交数量
                var sCJCount = aItem[oData.CLINCHQUANTITY];
                //成交额
                var sCJE = toPrice(aItem[oData.CLINCHAMOUNT], 2);//无
                var css = sBuyType.indexOf('买入') > -1 ? "buy" : "sale";
                var fontsize = sBuyType.length >= 6 ? "size" : "";
                sDom += '<div class="list">' +
                '<div class="item item-one ' + css +' '+ fontsize + '">' +
                   sBuyType +
                '</div>' +
                '<div class="item item-two">' +
                    '<p>' + sStockName + '</p>' +
                    '<p>' + sWTTimer + '</p>' +
                '</div>' +
                '<div class="item item-three">' +
                   sCJPrice +
                '</div>' +
                '<div class="item item-four">' +
                   sCJCount +
                '</div>' +
                '<div class="item item-five">' +
                   sCJE +
                '</div>' +
           ' </div>';
            });
            if (type == 'more') {
                j_lscj.append(sDom);
            } else {
                j_lscj.html(sDom);
            }
            fn && fn();
           
        });
    }
});