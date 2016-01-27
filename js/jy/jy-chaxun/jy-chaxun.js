/// <reference path="../../../lib/jquery/jquery.js" />
/// <reference path="../../../lib/common/common-cmd.js" />
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
        //单日成交入口
        $('.j_drcj').on('click', function () {
            action10061('/zsjy/app/jy/jy-chaxun/cx-drcj/cx-drcj.html');
        });
        //单日委托入口
        $('.j_drwt').on('click', function () {
            action10061('/zsjy/app/jy/jy-chaxun/cx-drwt/cx-drwt.html');
        });
        //成交历史入口
        $('.j_cjls').on('click', function () {
            action12383();
        });
        //历史委托入口
        $('.j_lswt').on('click', function () {
            action12385();
        });
        //交割单入口
        $('.j_jgd').on('click', function () {
            action12380();
        });
    }
});