/// <reference path="../../../../lib/jquery/jquery.js" />
/// <reference path="../../../../lib/common/common.js" />
define(function (require, exports, module) {
    var $ = require('$');
    var TZT = new (require('tzt'))($);
    $(function () {
        init();
    });
    function init() {
        timer();
        pageEvent();
    }
    function pageEvent() {
        //游戏说明
        $('.j_yxsm').on('click', function () {
            action10061('/zsjy/app/wd/wd-zjb/zjb-cdp/cdp-sm/cdp-sm.html');
        });
    }
    //倒计时
    function timer() {
        var ts = (new Date(2015, 3, 8, 12, 56, 0)) - (new Date());//计算剩余的毫秒数  
        var dd = parseInt(ts / 1000 / 60 / 60 / 24, 10);//计算剩余的天数  
        var hh = parseInt(ts / 1000 / 60 / 60 % 24, 10);//计算剩余的小时数  
        var mm = parseInt(ts / 1000 / 60 % 60, 10);//计算剩余的分钟数  
        var ss = parseInt(ts / 1000 % 60, 10);//计算剩余的秒数  
        dd = checkTime(dd);
        hh = checkTime(hh);
        mm = checkTime(mm);
        ss = checkTime(ss);
        var sHH = '' + hh;
        $('.j_hho').html(sHH[0]);
        $('.j_hht').html(sHH[1]);
        var sMM = '' + mm;
        $('.j_mmo').html(sMM[0]);
        $('.j_mmt').html(sMM[1]);
        var sSS = '' + ss;
        $('.j_sso').html(sSS[0]);
        $('.j_sst').html(sSS[1]);
        if (sHH == '00' && sMM == '00' && sSS == '00') { return;}
        var setid = setTimeout(function () { timer(); clearTimeout(setid); }, 1000);
    }
    function checkTime(i) {
        if (i < 10) {
            i = "0" + i;
        }
        return i;
    }
});