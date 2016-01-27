/// <reference path="../../../lib/jquery/jquery.js" />
/// <reference path="../../../lib/common/common.js" />
define(function (require, exports, module) {
    var $ = require('$');
    var TZT = new (require('tzt'))($);
    var oTools = TZT.TOOLS;
    var myScroll;
    var nMaxCount = 1;
    var menu_id;
    var j_infolist = $('.j_infolist');
    $(function () {
        //去除客户端底部第五个tab红点
//        action1901tab5('0');
				changeURL('http://action:10071/?');
        init();
    });
    function init() {
        menu_id = TZT.getUrlParameter('menuid');
        action41046(nMaxCount);
        pageEvent();
        myScroll = oTools.iscroll('#wrapper', function (type, fn) {
            if (type == 'more') {
                nMaxCount += 10;
                action41046(nMaxCount, 'more', fn);
            }
            else {
                nMaxCount = 1;
                action41046(nMaxCount, '', fn);
            }
        });
    }
    function pageEvent() {
        //消息列表点击
        $('.j_infolist').delegate('.line', 'click', function () {
            var ainfo = $(this).attr('data-info').split('|');
            $(this).addClass('ccc');
            action10061('/zsjy/app/wd/wd-cxx/cxx-xxxq/cxx-xxxq.html?socid=' + ainfo[0] + '&type=' + ainfo[1],'&&secondtype=1');
        });
    }
    function action41046(nCount, type, fn) {
        var oSend= {
            action: "41046",
            uniqueid:'($tztuniqueid)',
            menu_id: '202',
            //account:'($account)',
            startpos: nCount,
            maxcount: 10
        };
        TZT.getData(TZT.REQ.XML, oSend, function (oData) {
            var sDom = '';
            if (!oData.GRID0 || oData.ERRORMESSAGE == '查无记录!') {
                if (nCount == 1 || type != 'more') {
                    j_infolist.html(TZT.nodatadom);
                }
                fn && fn(); return;
            }
            $.each(oData.GRID0, function (i, item) {
                var aItem = item.split("|");
                var socid = aItem[0];
                var type = aItem[4];
                var datetime = aItem[6];
                var date = datetime.substr(0, 8);
                var time = datetime.substr(8, 6);
                var title = aItem[2];
                var nowdate = new Date().Format('yyyyMMdd');
                var date_msg = (nowdate == date ? "" : date.substr(0, 4) + "-" + date.substr(4, 2) + "-" + date.substr(6, 2));
                //是否已读  0未读  1已读
                var isread = aItem[7];
                var css = isread == 0 ? "" : "ccc";
                sDom += ' <div class="line ' + css + '" data-info="' + socid + "|" + type + '">' +
           '<span class="info-type">['+aItem[8]+']</span>' +
           '<span>' + title + '</span>' +
           '<span class="timer">' + date_msg + ' &nbsp;&nbsp;&nbsp;' + time.substr(0, 2) + ':' + time.substr(2, 2) + ':' + time.substr(4, 2) + '</span>' +
       '</div>';
            });
            if (type == 'more') {
                j_infolist.append(sDom);
            } else {
                j_infolist.html(sDom);
            }
            fn && fn();
        });
    }
    window.clearmsg = function () {
        if (confirm('是否清空消息？')) {
            var oSend = {
                action: '41047',
                menu_id: '202',
                zxid: '!',
                uniqueid: '($tztuniqueid)',
                accounttype: 'ZJACCOUNT',
                account:'($account)'

            };
            TZT.getData(TZT.REQ.XML, oSend, function (oData) {
                alert('消息清空成功！');
                nMaxCount = 1;
                action41046(nMaxCount);
            });
        }
    }
});