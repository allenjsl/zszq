define(function (require, exports, module) {
    var $ = require('$');
    var slide = require('slide');
    var TZT = new (require('tzt'))($);
    var oTools = TZT.TOOLS;
    var myScroll;
    var nMaxCount = 1;
    var j_list = $('.j_list');
    $(function () { init(); });
    function init() {
        actionsearchKHZZLS(nMaxCount);
        //myScroll = oTools.iscroll('#wrapper', function (type, fn) {
        //    if (type == 'more') {
        //        nMaxCount += 10;
        //        actionsearchKHZZLS(nMaxCount, 'more', fn);
        //    }
        //    else {
        //        nMaxCount = 1;
        //        actionsearchKHZZLS(nMaxCount, '', fn);
        //    }
        //});
        myScroll = oTools.iscroll('#wrapper');
    }
    function actionsearchKHZZLS(nCount, type, fn) {
        //var oSend = {
        //    action: 46148,
        //    func: 'searchKHZZLS',
        //    fundAccount: '($account)',
        //    start: nCount,
        //    limit: 10
        //}
        var oSend = {
            action: 127,
            MobileCode: '($MobileCode)',
            Token: '($Token)',
            reqno: +new Date(),
            Startpos: 0,
            MaxCount: 1000
        };
        TZT.getData(TZT.REQ.XML, oSend, function (oData) {
            if (oData.ERRORMESSAGE == '查无记录!' || !oData.GRID0) {
                j_list.html(TZT.nodatadom);
                fn && fn(); return;
            }
            var sDom = '';
            oData.GRID0.shift();
            $.each(oData.GRID0, function (i, item) {
                var aItem = item.split('|');
                //转账类型  中文
                var o_type = aItem[oData.BUSINESSTYPE];// == "转入" ? "银行转证券" : "证券转银行";
                //交易时间
                var o_date = aItem[oData.TRANSFERDATE];
                //var nowdate = new Date().Format('yyyyMMdd');
                //if (nowdate != o_date) { return;}
                //时间
                var o_time = aItem[oData.TRANSFERTIME]; 
                if (o_time.length == 7) {
                    o_time = '0' + o_time;
                }
                //发生金额
                var money = (+aItem[oData.TRANSFERAMOUNT]).toFixed(2);
                var css = money > 0 ? "yl" : "ks";
                sDom += '<div class="line">' +
            '<span class="o-type">' + o_type + '</span>' +
            '<span class="o-date">' + o_date.substr(0, 4) + '-' + o_date.substr(4, 2) + '-' + o_date.substr(6, 2) + '  ' + o_time.substr(0, 2) + ':' + o_time.substr(2, 2) + ':' + o_time.substr(4, 2) + '</span>' +
            '<span class="money ' + css + '">' + money + '</span>' +
            '<span class="type">' + aItem[oData.TRANSFERSTATE] + '</span>' +
        '</div>';
            });
            if (type == 'more') {
                j_list.append(sDom);
            } else {
                j_list.html(sDom);
            }
            fn && fn();
            myScroll.refresh();
        }, { BlockErr: true });
    }
});