/// <reference path="../../../../lib/jquery/jquery.js" />
/// <reference path="../../../../lib/common/common.js" />
define(function (require, exports, module) {
    var $ = require('$');
    var slide = require('slide');
    var TZT = new (require('tzt'))($);
    var oTools = TZT.TOOLS;
    var j_sgrllist = $('.j_sgrllist');
    var myScroll;
    var currentpage = 1;
    $(function () {
        init();
    });
    function init() {
        action46106(currentpage);
        oTools.setHeight($('#wrapper'), 40);
        myScroll = oTools.iscroll('#wrapper', function (type, fn) {
            if (type == 'more') {
                currentpage += 1;
                action46106(currentpage, 'more', fn);
            }
            else {
                currentpage = 1;
                action46106(currentpage, '', fn);
            }
        });
    }
    function action46106(nCount, type, fn) {
        var oSend = {
            action: 46106,
            MobileCode: '($MobileCode)',
            Token: '($Token)',
            Reqno: +new Date(),
            ReqlinkType: 1,
            nPage: nCount,
            maxcount: 10
        };
        TZT.getData(TZT.REQ.XML, oSend, function (oData) {
            if (oData.ERRORMESSAGE == '查无记录!' || !oData.GRID2) {
                if (nCount == 1 || type != 'more') {
                    j_sgrllist.html(TZT.nodatadom);
                }
                fn && fn(); return;
            }
            function toPrice(price, pointsize){
            	if(price == ''){
            		return '';
            	}
            	if(price.substr(0, 1) == '.'){
            		price = '0' + price;
            	}
            	return (+price).toFixed(pointsize);
            };
            var sDom2 = '';
            $.each(oData.GRID2, function (i, item) {
                var aItem = item.split('|');
                //申购代码
                var stockcode = aItem[oData.SGDMINDEX];
                //股票名称
                var stockname = aItem[oData.STOCKNAMEINDEX];
                //发行价
                var price = toPrice(aItem[oData.PRICEINDEX], 2);
                //申购日期
                var date = aItem[oData.DATESINDEX].replaceAll('-', '/');
                var sgdate = +new Date(date).Format('yyyyMMdd');
                var nowdate = +new Date().Format('yyyyMMdd');
                if (sgdate >= nowdate) {
                    sDom2 += '<div class="list">' +
                    '<div class="item item-one">' +
                        '<p class="name">' + stockname + '</p>' +
                        '<p class="time">' + stockcode + '</p>' +
                    '</div>' +
                    '<div class="item item-two">' +
                       price +
                    '</div>' +
                   ' <div class="item item-three">' +
                       date +
                   ' </div>' +
               ' </div>';
                }
            });
            if (!sDom2) {
                if (nCount == 1 || type != 'more') {
                    j_sgrllist.html(TZT.nodatadom);
                }
                fn && fn(); return;
            }
            if (type == 'more') {
                j_sgrllist.append(sDom2);
            } else {
                j_sgrllist.html(sDom2);
            }
            fn && fn();
        });

    }
});