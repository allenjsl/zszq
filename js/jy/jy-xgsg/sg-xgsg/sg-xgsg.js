/// <reference path="../../../../lib/jquery/jquery.js" />
/// <reference path="../../../../lib/common/common.js" />
define(function (require, exports, module) {
    var $ = require('$');
    var TZT = new (require('tzt'))($);
    var oTools = TZT.TOOLS;
    var j_buyprice = $('.j_buyprice');
    var oCache = {};
    var j_ksgxg = $('.j_ksgxg');
    var j_price = $('.j_price');
    var j_xgrllist = $('.j_xgrllist');
    var j_kyzj = $('.j_kyzj');
    //加减数量
    var j_addornot = $('.j_addornot');
    var currentcode = '';
    var myScroll;
    var currentpage = 1;
    var oAccount = {};
    $(function () {
        oTools.getLocalMesg(['AccountList'], function (oData) {
            var aAccount = oData.ACCOUNTLIST.split('|');
            for (var z = 0; z < aAccount.length-1; z = z + 3) {
                if (aAccount[z] == 'SHACCOUNT') {
                    oAccount['shname'] = 'SHACCOUNT';
                    oAccount['shacc'] = aAccount[z + 1];
                }
                else {
                    oAccount['szname'] = 'SZACCOUNT';
                    oAccount['szacc'] = aAccount[z + 1];
                }
            }
            init();
        });
    });
    function init() {
        action117();
        action46106(currentpage);
        pageEvent();
        oTools.setHeight($('#wrapper'), 299);
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
    function pageEvent() {
        //
        j_ksgxg.on('change', function () {
            var code = $(this).val();
            currentcode = code;
            var oStockInfo = oCache[code];
            var sctype = oStockInfo.type;
            j_price.html(oStockInfo.price);
            j_buyprice.val('');
            //上交所
            if (sctype == '83') {
                j_addornot.find('.j_quato').html('1000');
            }
            else {
                j_addornot.find('.j_quato').html('500');
            }
        });
        //添加500或较少500
        j_addornot.on('click', function () {
            var type = $(this).attr('data-type');
            var buymoney = +j_buyprice.val();
            var maxchange =(+$(this).find('.j_quato').html());
            var res=0;
            if (typeof buymoney == 'number') {
                if (type == '-') {
                    var val = buymoney - maxchange;
                    if (val <=0) {
                        res = 0;
                    } else {
                        res = val;
                    }
                }
                else {
                    var val = buymoney + maxchange;
                    res = val;
                }
                var max = oCache[currentcode].purchase;
                if (res > max) {
                    res = max;
                }
                j_buyprice.val(res);
            }
            else {
                alert('输入金额有误！');
            }
        });
        //申购
        $('.j_sg').on('click', function () {
            //股票代码
            var code = j_ksgxg.val();
            var gu = +$('.j_buyprice').val();
            if (!oCache[code]) { alert('无可申购新股!'); return; };
            //上市类型  83上交所    90深交所
            var type = oCache[code].type;
            //最小申购额度
            var mingu = (type == '83' ? 1000 : 500);
            if (isNaN(gu)) {
                alert('委托数量有误！'); return;
            }
            if (gu < mingu) {
                alert('委托数量不能小于' + mingu + '股！'); return;
            }
            if (gu % mingu != 0) {
                alert('委托数量必须为' + mingu + '股的整数倍！'); return;
            }
            var currenttype = oCache[code].type;
            var WTaccount = '';
            var WTaccounttype = '';
            if (currenttype == '83') {
                WTaccount = oAccount.shacc;
                WTaccounttype = oAccount.shname;
            }
            else {
                WTaccount = oAccount.szacc;
                WTaccounttype = oAccount.szname;
            }
            var oSend = {
                action: 110,
                MobileCode: '($MobileCode)',
                Token: '($Token)',
                Reqno: +new Date(),
                WTAccount: WTaccount,
                WTAccountType: WTaccounttype,
                StockCode: code,
                Price: oCache[code].price,
                ReqlinkType: 1,
                CommBatchEntrustInfo:'1',
                Direction: 'B',
                PriceType:'0',
                Volume: gu
            }
            TZT.getData(TZT.REQ.XML, oSend, function (oData) {
                action117();
                alert('新股委托成功！');
            });
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
            maxcount:10
        };
        TZT.getData(TZT.REQ.XML, oSend, function (oData) {
            function toPrice(price, pointsize) {
                if (price == '') {
                    return '';
                }
                if (price.substr(0, 1) == '.') {
                    price = '0' + price;
                }
                return (+price).toFixed(pointsize);
            };
            if (oData.GRID3) {
                var sDom = '';
                //可申购新股
                $.each(oData.GRID3, function (i, item) {
                    var aItem = item.split('|');
                    //申购代码
                    var stockcode = aItem[oData.SGDMINDEX];
                    //股票名称
                    var stockname = aItem[oData.STOCKNAMEINDEX];
                    //发行价
                    var price = toPrice(aItem[oData.PRICEINDEX],2);
                    //申购日期
                    var date = aItem[oData.DATESINDEX];
                    //上市类型  83上交所   90深交所
                    var sctype = aItem[oData.TYPEINDEX];
                    //申购上限
                    var purchase = +aItem[oData.SGSXINDEX];
                    sDom += '<option value="' + stockcode + '">' + '&nbsp;&nbsp;&nbsp;' + stockcode + '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' + stockname + '</option>';
                    oCache[stockcode] = {
                        stockcode: stockcode,
                        stockname: stockname,
                        price: price,
                        date: date,
                        type: sctype,
                        purchase:purchase
                    };
                });
                j_ksgxg.html(sDom);
                j_ksgxg.change();
            }
            var sDom2 = '';
            if (oData.ERRORMESSAGE == '查无记录!' || !oData.GRID2) {
                if (nCount == 1 || type != 'more') {
                    j_xgrllist.html(TZT.nodatadom);
                }
                fn && fn(); return;
            }
            $.each(oData.GRID2, function (i,item) {
                var aItem = item.split('|');
                //申购代码
                var stockcode = aItem[oData.SGDMINDEX];
                //股票名称
                var stockname = aItem[oData.STOCKNAMEINDEX];
                //发行价
                var price = toPrice(aItem[oData.PRICEINDEX],2);
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
                    j_xgrllist.html(TZT.nodatadom);
                }
                fn && fn(); return;
            }
            if (type == 'more') {
                j_xgrllist.append(sDom2);
            } else {
                j_xgrllist.html(sDom2);
            }
            fn && fn();
        });
        
    }
    //查询可用资金
    function action117() {
        var oSend = {
            action: '117',
            MobileCode: '($MobileCode)',
            Token: '($Token)',
            Reqno: +new Date(),
            ReqlinkType: 1,
            StartPos: 0,
            MaxCount: 1000
        };
        TZT.getData(TZT.REQ.XML, oSend, function (oData) {
            oData.GRID2.shift();
            $.each(oData.GRID2, function (i, item) {
                var aItem = item.split('|');
                var coinTyoe = aItem[oData.CURRENCYINDEX];
                if (coinTyoe == '人民币') {
                    //可用金额  
                    var sKYJE = aItem[oData.USABLEINDEX];
                    j_kyzj.html(sKYJE);
                    return false;
                }
            });
        });
    }
});