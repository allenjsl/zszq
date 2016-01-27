/// <reference path="../../lib/jquery/jquery.js" />
/// <reference path="../../lib/common/common.js" />
define(function (require, exports, module) {
    var $ = require('$');
    var TZT = new (require('tzt'))($);
    var not = require('rednot');
    var oTools = TZT.TOOLS;
    $(function () {
        init();
    });
    function init() {
        showelement();
        pageEvent();
        oTools.iscroll('#wrapper');
    }

    function pageEvent() {
        //办业务
        $('.j_byw').on('click', function () {
            gochangeURL('/zsjy/app/wd/wd-byw/wd-byw.html');
        });
        //个人信息
        $('.j_grxx').on('click', function () {
            action10061('/zsjy/app/wd/wd-grxx/wd-grxx.html');
        });
        //赚金币
        $('.j_zjb').on('click', function () {
            action10061('/zsjy/app/wd/wd-zjb/wd-zjb.html');
        });
        //立即登录
        $('.j_loginnow').on('click', function () {
            action10090();
        });
        //查消息
        $('.j_cxx').on('click', function () {
            $('.j_mesgred').removeClass('new-info');
            actionfunc10061('/zsjy/app/wd/wd-cxx/wd-cxx.html', 'clearmsg()');
        });
    }
    function action187(fn) {
        var oSend = {
            action: 187,
            MobileCode: '($MobileCode)',
            Token: '($Token)',
            Reqno: +new Date(),
            ReqlinkType: 1
        };
        TZT.getData(TZT.REQ.XML, oSend, function (oData) {
            var aItem = oData.GRID0[1].split('|');
            //客户姓名
            var name = aItem[1];
            //性别
            var sex = aItem[3];
            var word = (sex == '男' ? "先生" : "女士");
            var hours = new Date().getHours();
            var welcome = '';
            if (hours <= 8 && hours >= 5) {
                welcome = '早上好，愿您今天有好心情！';
            }
            else if (hours < 18 && hours > 8) {
                welcome = '一次好的投资就是一个成功的契机！';
            }
            else if (hours < 23 && hours >= 18) {
                welcome = '让晚风吹走您一天的疲劳！';
            }
            else if (hours <= 4 || hours >= 23) {
                welcome = '夜深了，喝杯牛奶早些休息吧！';
            }
            $('.j_username').html(name + word);
            $('.j_welcome').html(welcome);
        });
    }
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
                    //总市值（股票市值）
                    var sZSZ = (+oData.MKTVAL_RMB).toFixed(2); //aItem[oData.MARKETVALUEINDEX];
                    //可用金额  
                    var sKYJE = (+aItem[oData.USABLEINDEX]).toFixed(2);
                    //可取余额
                    var sSQYE = (+aItem[oData.BALANCEINDEX]).toFixed(2);
                    //总资产
                    var sZZC = aItem[oData.TOTALASSETSINDEX];
                    //股票市值 除以 总资产(持仓百分比)
                    var precent = ((+sZSZ) / (+sZZC)).toFixed(2) * 100;
                    //最大百分比
                    var maxprecent = +precent;
                    start(maxprecent, '.j_ccbfb');
                    //    $('.j_ccbfb').html(startindex);
                    $('.j_zsz').html(sZSZ);
                    $('.j_kyje').html(sKYJE);
                    $('.j_kqye').html(sSQYE);
                    return false;
                }
            });
        });
    }
    var t1; var t2
    //画圆环方法
    function start(num, select) {
        $(".pie2").css("-webkit-transform", "rotate(0deg)");
        $(".pie1").css("-webkit-transform", "rotate(0deg)");
        if (num == 0) { $(select).html('0'); return; }
        clearInterval(t1); clearInterval(t2);
        var precent = num / (50 / 180);
        var i = 0;
        var count1 = 0;
        t1 = setInterval(function () {
            i = i + 2.4;
            count1++;
            $(".pie2").css("-webkit-transform", "rotate(" + i + "deg)");
            $(select).html((count1 / 75 * 50).toFixed(0));
            if (count1 >= 75 || i >= precent) {
                clearInterval(t1);
                var j = 0;
                var count2 = 0;
                if (num <= 50) {
                    return;
                }
                t2 = setInterval(function () {
                    j = j + 2.4;
                    count2++;
                    $(".pie1").css("-webkit-transform", "rotate(" + j + "deg)");
                    $(select).html((count2 / 75 * 50 + 50).toFixed(0));
                    if (count2 >= 75 || j >= (precent - 180)) {
                        clearInterval(t2);
                    }
                }, 1);
            }
        }, 1);
    }
    //判断是否登录显示不同的元素
    window.showelement = function () {
        //红点
        not.mesreadnot(function (type) {
            if (type) {
                $('.j_mesgred').addClass('new-info');
                tztsetrednot('33');
            } else {
                $('.j_mesgred').removeClass('new-info');
            }
        });
        var jNotLogin = $('.j_notlogina');
        var jLogin = $('.j_login');
        oTools.isLogin(function () {
            action187();
            action117();
            jNotLogin.hide();
            jLogin.show();
            oTools.getauthority(function (res) {
                if (res == '1' || res == '') { return; }
                //动态关闭tips
                oTools.readFileMesg('tipstime', function (oData) {
                    var day;
                    if (oData) {
                        day = oData.day;
                    }
                    else {
                        day = 'a';
                    }
                    var nowday = new Date().getDate();
                    if (day == nowday) { return; }
                    $('.j_tips').show();
                    oTools.saveFileMesg({ day: nowday }, 'tipstime', function () {
                        var height = $('.j_tips')[0].offsetHeight;
                        var setid = setTimeout(function () {
                            $('.j_tips').animate({
                                marginTop: '-' + height + 'px'
                            }, 1000, '', function () {
                                $('.j_tips').hide();
                            });
                        }, 2000);
                    });
                });
            });
        }, function () {
            jNotLogin.show();
            jLogin.hide();
        });
    }

});
function GoBackOnLoad() {
    showelement();
}