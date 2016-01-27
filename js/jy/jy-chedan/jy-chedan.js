/// <reference path="../../../lib/jquery/jquery.js" />
/// <reference path="../../../lib/common/common.js" />
define(function (require, exports, module) {
    var $ = require('$');
    var TZT = new (require('tzt'))($);
    var oTools = TZT.TOOLS;
    var dialog = TZT.dialog;
    //页面缓存数据
    var oCache = {};
    //当前选中项
    var current = {};
    var myScroll;
    var nMaxCount = 1;
    var j_drwtlist = $('.j_drwtlist');
    $(function () {
        init();
    });
    function init() {
        oTools.setHeight($('#wrapper'), 40);
        action152(nMaxCount);
        pageEvent();
        myScroll = oTools.iscroll('#wrapper', function (type, fn) {
            if (type == 'more') {
                nMaxCount += 10;
                action152(nMaxCount, 'more', fn);
            }
            else {
                nMaxCount = 1;
                action152(nMaxCount, '', fn);
            }
        });
    }
    function pageEvent() {
        //委托列表点击事件
        j_drwtlist.delegate('.list', 'click', function () {
            //var wtzt = $(this).find('.j_wtzt').html();
            //if (wtzt == '已撤') { return;}
            var id = $(this).attr('data-id');
            current = oCache[id];
            $('.j_stockname').html(current.StockName + ':');
            $('.j_stockcode').html(current.StockCode);
            $('.j_buytype').html(current.MMLB);
            $('.j_wtjg').html(current.WtPrice);
            $('.j_wtsl').html(current.WT);
            $('.j_cjsl').html(current.CJ);
            var content = (current.StockName + ':' + current.StockCode + '\r\n'
                + '买卖方向' + ':' + current.MMLB + '\r\n'
                + '委托价格' + ':' + current.WtPrice + '\r\n'
                  + '委托数量' + ':' + current.WT + '\r\n'
                  + '成交数量' + ':' + current.CJ + '\r\n'
                  +'您是否确定撤单？'
                );
            if (confirm(content)) {
                action401(current.CONTACTINDEX, function () {
                    $('div[data-id="' + current.CONTACTINDEX + '"]').remove();
                    alert('撤单成功！');
                    //action152();
                });
            }
            //dialog.open($('.j_dialig'));
        });
        //弹出窗确定按钮
        $('.j_agree').on('click', function () {
            dialog.close();
            //action401(current.CONTACTINDEX, function () {
            //    $('div[data-id="' + current.CONTACTINDEX + '"]').remove();
            //    //action152();
            //});
        });
        //弹出窗取消按钮
        $('.j_closetip').on('click', function () {
            dialog.close();
        });
    }
    //查询单日委托
    function action152(ncount,type,fn) {
        var oSend = {
            action: 152,
            MobileCode: '($MobileCode)',
            Token: '($Token)',
            Reqno: +new Date(),
            ReqlinkType:1,
            StartPos: ncount,
            MaxCount: 10
        }
        TZT.getData(TZT.REQ.XML, oSend, function (oData) {
            var errormsg = oData.ERRORMESSAGE;
            if (errormsg == '查无记录!' ||!oData.GRID0)
            {
                if (ncount == 1 || type != 'more') {
                    j_drwtlist.html(TZT.nodatadom);
                } fn && fn(); return;
            }
            var sDom = '';
            //oData.GRID0.shift();
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
                var sWtPrice = aItem[oData.AMOUNTCJINDEX];
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
                //缓存页面数据
                oCache[sCONTACTINDEX] = {
                    StockCode:sStockCode,
                    StockName: sStockName,
                    MMLB: sMMLB,
                    WtPrice: sWtPrice,
                    WT: sWT,
                    CJ: sCJ,
                    CONTACTINDEX: sCONTACTINDEX
                };
                sDom += '<div class="list" data-id="' + sCONTACTINDEX + '">' +
                '<div class="item item-one">' +
                    '<p class="name">' + sStockName + '</p>' +
                   ' <p class="time">' + sWtTimer + '</p>' +
                '</div>' +
               ' <div class="item item-two">' +
                    sWtPrice +
               ' </div>' +
                '<div class="item item-three">' +
                    '<p>' + sWT + '</p>' +
                   ' <p>' + sCJ + '</p>' +
                '</div>' +
                '<div class="item item-four">' +
                    '<p>' + sMMLB + '</p>' +
                   ' <p class="j_wtzt">' + sWTZT + '</p>' +
                '</div>' +
                '<div class="item item-five">' +
                   ' 撤单' +
                '</div>' +
            '</div>';
            });
            if (type == 'more') {
                j_drwtlist.append(sDomCC);
            } else {
                j_drwtlist.html(sDom);
            }
            fn && fn();
           
        });
    }
    //委托撤单
    function action401(id, fu) {
        var oSend = {
            action: 111,
            MobileCode: '($MobileCode)',
            Token: '($Token)',
            Reqno: +new Date(),
            ContactID: id,
            ReqlinkType: 1
        };
        TZT.getData(TZT.REQ.XML, oSend, function (oData) {
            fu && fu();
        });
    }
});