/// <reference path="../../../lib/jquery/jquery.js" />
/// <reference path="../../../lib/common/common.js" />
define(function (require, exports, module) {
    var $ = require('$');
    var slide = require('slide');
    var TZT = new (require('tzt'))($);
    var oTools = TZT.TOOLS;
    var myScroll;
    var nMaxCount = 1;
    var pagetype = '';//0 1 有值隐藏
    var j_cclist = $('.j_cclist');
    var currentstockcode;
    $(function () {
        init();
    });
    function init() {
        var slider = slide($('#d-slide')[0], {
            auto: 0,
            continuous: true,
            callback: function (pos) {
                $('#J_position li').eq(pos).addClass('on').siblings().removeClass();
            }
        });
        pagetype = TZT.getUrlParameter('type');
        if (pagetype) {
            $('.j_acc').hide();
            oTools.setHeight($('#wrapper'), 42);
        } else {
            oTools.setHeight($('#wrapper'), 188);
        }
        action117(nMaxCount, function () { });
        pageEvent();
        //myScroll = oTools.iscroll('#wrapper', function (type,fn) {
        //    if (type=='more') {
        //        nMaxCount += 10;
        //        action117(nMaxCount,'more',fn);
        //    }
        //    else {
        //        nMaxCount = 1;
        //        action117(nMaxCount,'',fn);
        //    }
        //});
    }
    function pageEvent() {
        j_cclist.delegate('.list', 'click', function () {
            var stockcode = $(this).attr('data-code');
            currentstockcode = stockcode;
            if (pagetype) {
                if (pagetype == '0') {
                    action12310(stockcode);
                }
                else {
                    action12311(stockcode);
                }
            }
            else {
                $(this).toggleClass('showoperate');
                if (!$(this).hasClass('showoperate')) {
                    $('.j_operate').hide();
                }
                else {
                    j_cclist.find('.list').removeClass('showoperate');
                    $(this).addClass('showoperate');
                    $(this).after($('.j_operate'));
                    $('.j_operate').show();
                }
            }
        });
        $('.j_refresh').on('click', function () {
            $('.j_operate').hide();
            $('body').append($('.j_operate'));
            norefreshloading();
        });
        $(document).delegate('.o-item-item', 'click', function () {
            var type = $(this).attr('data-type');
            if (type == 'buy') {
                action12310(currentstockcode);
            }
            else if (type == 'sale') {
                action12311(currentstockcode);
            }
            else {
                actionstock(currentstockcode);
            }
        });
    }
    //查询持仓
    function action117(nCount, type,fn) {
        var oSend = {
            action: '117',
            MobileCode: '($MobileCode)',
            Token: '($Token)',
            Reqno: +new Date(),
            ReqlinkType: 1,
            StartPos: nCount,
            MaxCount: 10000000
        };
        TZT.getData(TZT.REQ.XML, oSend, function (oData) {
            var GRID2 = oData.GRID2;
            var GRID0 = oData.GRID0;
            GRID2.shift();
            //总资产
            var oZYK = {};
            //币种
            $.each(GRID2, function (i, it) {
                var aIt = it.split('|');
                //币种 人民币  美元 港币
                var type = aIt[oData.CURRENCYINDEX];
                var jsname = '';
                //总盈亏
                var sZyk;
                if (type == '人民币') {
                    jsname = 'rmb';
                    sZyk = oData.TOTALYK_RMB;
                    $('.j_rmbzsz').html((+oData.MKTVAL_RMB).toFixed(2));
                }
                else if (type == '美元') {
                    jsname = 'my';
                    sZyk = oData.TOTALYK_USD;
                    $('.j_myzsz').html((+oData.MKTVAL_USD).toFixed(2) );
                }
                else if (type == '港币') {
                    jsname = 'gb';
                    sZyk = oData.TOTALYK_HK;
                    $('.j_gbzsz').html((+oData.MKTVAL_HK).toFixed(2) );
                }
                sZyk = (+sZyk).toFixed(2);
                //总资产
                var sZzc = aIt[oData.TOTALASSETSINDEX];
                //总市值
                var sZsz = aIt[oData.MARKETVALUEINDEX];
                //可取
                var sKq = aIt[oData.BALANCEINDEX];
                //可用
                var sKy = aIt[oData.USABLEINDEX];
                //当日参考盈亏
                var sDrckyk = aIt[oData.KYINDEX];
                oZYK[jsname] = +sZzc;
                $('.j_' + jsname + 'zzc').html(sZzc);
                //$('.j_' + jsname + 'zsz').html(sZsz);
                if (sZyk < 0) {
                    $('.j_' + jsname + 'zyk').removeClass('profit');
                    $('.j_' + jsname + 'zyk').addClass('loss');
                }
                else if (sZyk>0) {
                    $('.j_' + jsname + 'zyk').removeClass('loss');
                    $('.j_' + jsname + 'zyk').addClass('profit');
                }
                $('.j_' + jsname + 'zyk').html(sZyk);
                $('.j_' + jsname + 'kq').html(sKq);
                $('.j_' + jsname + 'ky').html(sKy);
                //$('.j_' + jsname + 'dryk').html(sDrckyk);
            });
            //GRID0.shift();
            var sDomCC = '';
            action127(function (oRet) {
                //当日无流水
                if (oRet.ERRORMESSAGE == '查无记录!') {

                }
                else {
                    oRet.GRID0.shift();
                    $.each(oRet.GRID0, function (i, item) {
                        var aItem = item.split('|');
                        //交易时间
                        var o_date = aItem[oData.TRANSFERDATE];
                        //var nowdate = new Date().Format('yyyyMMdd');
                        //if (nowdate != o_date) { return; }
                        //币种
                        var s_bz = aItem[oData.MONEYINDEX];
                        //业务类型
                        var s_type = aItem[oData.BUSINESSTYPE];
                        //转账金额
                        var s_money = +aItem[oData.TRANSFERAMOUNT];
                        var s_res = aItem[oData.TRANSFERSTATE];
                        var _arr = ['成功', '已冲正', '调整为成功'];
                        if (_arr.indexOf(s_res) == -1) { return;}
                        //币种key
                        var key = '';
                        if (s_bz == '人民币') {
                            key = 'rmb';
                        }
                        else if (s_bz == '美元')
                        {
                            key = 'my';
                        }
                        else if (s_bz == '港币') {
                            key = 'gb';
                        }
                        oZYK[key] = (oZYK[key] - s_money);
                        //if (s_type == '转入') {
                        //    oZYK[key] = (oZYK[key] - s_money);
                        //}
                        //else {
                        //    oZYK[key] = (oZYK[key] + s_money);
                        //}
                        
                    });
                }
                //昨日总资产
                    zrzyk(function (oGet) {
                        if (!oGet.GRID2) {

                        } else {
                            var zrzzcbz = oGet.GRID2[0].split('|')[0];
                            var zrzzc = +oGet.GRID2[0].split('|')[1];
                            if (zrzzcbz == '0') {
                                oZYK.rmb = (oZYK.rmb - zrzzc).toFixed(2);
                            }
                            else if (zrzzcbz == '1') {
                                oZYK.gb = (oZYK.gb - zrzzc).toFixed(2);
                            }
                            else if (zrzzcbz == '2') {
                                oZYK.my = (oZYK.my - zrzzc).toFixed(2);
                            }
                        }
                        //人民币当日盈亏
                        var j_rmbdryk = $('.j_rmbdryk');
                        //港币当日盈亏
                        var j_gbdryk = $('.j_gbdryk');
                        //美元当日盈亏
                        var j_mydryk = $('.j_mydryk');
                        j_rmbdryk.removeClass('profit');
                        j_rmbdryk.removeClass('loss');
                        j_gbdryk.removeClass('profit');
                        j_gbdryk.removeClass('loss');
                        j_mydryk.removeClass('profit');
                        j_mydryk.removeClass('loss');
                        if (oZYK.rmb) {
                            j_rmbdryk.html((+oZYK.rmb).toFixed(2));
                            if (+oZYK.rmb > 0) {
                                j_rmbdryk.addClass('profit')
                            } else {
                                j_rmbdryk.addClass('loss')
                            }
                        }
                        if (oZYK.rmb == 0) { j_rmbdryk.html('0'); }
                        if (oZYK.gb) {
                            j_gbdryk.html((+oZYK.gb).toFixed(2));
                            if (+oZYK.gb > 0) {
                                j_gbdryk.addClass('profit')
                            } else {
                                j_gbdryk.addClass('loss')
                            }
                        }
                        if (oZYK.gb == 0) { j_gbdryk.html('0'); }
                        if (oZYK.my) {
                            j_mydryk.html((+oZYK.my).toFixed(2));
                            if (+oZYK.my > 0) {
                                j_mydryk.addClass('profit')
                            } else {
                                j_mydryk.addClass('loss')
                            }
                        }
                        if (oZYK.my == 0) { j_mydryk.html('0'); }
                    });

            });
            if (!GRID0 || oData.ERRORMESSAGE == '查无记录!') {
                if (nCount == 1 || type!='more') {
                    j_cclist.html(TZT.nodatadom);
                }
                fn && fn(); return;
            }
            //持仓
            $.each(GRID0, function (i, item) {
                var aItem = item.split('|');
                var sStockCode = aItem[oData.STOCKINDEX];
                //股票名称
                var sStockName = aItem[oData.STOCKNAMEINDEX];
                //市值
                var sSZ = aItem[oData.MARKETVAL];
                //盈亏
                var sYingkui = aItem[oData.YKINDEX];
                //盈亏率
                var sYingkuilv = aItem[oData.STOCKVALUEINDEX];
                //持仓
                var sChicang = aItem[oData.SHARESVAL];
                //可用
                var sKeyong = aItem[oData.STOCKAVAILABLEINDEX];
                //成本
                var sChengben = aItem[oData.KEEPPRICEINDEX];
                //现价
                var sXianjia = aItem[oData.PRICEVAL];
                var css = ((+sYingkui) >= 0 ? "prolit" : "loss");
                sDomCC += '<div data-code="' + sStockCode + '" class="list ' + css + '">' +
              ' <div class="item item-one">' +
                 '<p class="name">' + sStockName + '</p>' +
                 '<p class="time">' + sSZ + '</p>' +
              '</div>' +
               '<div class="item item-two">' +
                   '<p class="name">' + sYingkui + '</p>' +
                   '<p class="time">' + sYingkuilv + '%</p>' +
              ' </div>' +
               '<div class="item item-three">' +
                   '<p>' + sChicang + '</p>' +
                   '<p>' + sKeyong + '</p>' +
               '</div>' +
              ' <div class="item item-four">' +
                  ' <p>' + sChengben + '</p>' +
                   '<p>' + sXianjia + '</p>' +
              ' </div>' +
           '</div>';
            });
            if (type == 'more') {
                j_cclist.append(sDomCC);
            } else {
                j_cclist.html(sDomCC);
            }
            fn && fn();
        });
    }
    //委托买入
    function action12310(stockcode) {
        changeURL('http://action:12310/?stockcode=' + stockcode);
    }
    //委托卖出
    function action12311(stockcode) {
        changeURL('http://action:12311/?stockcode=' + stockcode);
    }
    function actionstock(stockcode) {
        changeURL("http://stock:" + stockcode);
    }
    //单日转账流水
    function action127(fn) {
        var oSend = {
            action: 127,
            MobileCode: '($MobileCode)',
            Token: '($Token)',
            Reqno:+new Date(),
            ReqlinkType: 1
        };
        TZT.getData(TZT.REQ.XML, oSend, function (oRet) {
            fn && fn(oRet);
        });
    }
    //昨日总盈亏
    function zrzyk(fn) {
        var oSend = {
            action: '46148',
            func: 'searchKHZZC',
            fundAccount: '($account)'
        };
        TZT.getData(TZT.REQ.XML, oSend, function (oGet) {
            fn && fn(oGet);
        });
    }
    window.norefreshloading = function () {
        action117(nMaxCount);
    }
});