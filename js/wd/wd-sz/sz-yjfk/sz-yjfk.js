/// <reference path="../../../../lib/jquery/jquery.js" />
/// <reference path="../../../../lib/jquery/jquery-cmd.js" />
define(function (require, exports, module) {
    var $ = require('$');
    var TZT = new (require('tzt'))($);
    $(function () {
        init();
    });
    function init() {
        pageEvent();
    }
    function pageEvent() {
        $('.tel').on('click', function () {
            changeURL('http://tel:4001022011');
        });
        $('.j_submit').on('click', function () {
            var lynr = $('.j_lynr').val();
            if (!lynr) {
                alert('反馈内容不能为空！'); return;
            }
            actionsaveKHLY(lynr);
        });
        //限制字数
        $('.j_lynr').on('input', function () {
            var content = $(this).val();
            var length = TZT.wordCount(content, false);
            if (length > 200) {
                while (length > 200) {
                    content = content.substr(0, content.length - 1);
                    length = TZT.wordCount(content, false);
                }
                $(this).val(content)
                length = 200;
            }
            $('.j_wordcount').html(length+'/200');
        });
    }
    function actionsaveKHLY(lynr) {
        TZT.TOOLS.getLocalMesg(['account', 'UserName'], function (oData) {
            var oSend = {
                action: 46148,
                func: 'saveKHLY',
                khid: oData.ACCOUNT||'',
                khxm: oData.USERNAME||'',
                lynr: encodeURIComponent(lynr) 
            };
            TZT.getData(TZT.REQ.XML, oSend, function (oData) {
                alert('提交成功!'); $('.j_lynr').val('');
            });
        });
    }
});