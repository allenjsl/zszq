define(function (require, exports, module) {
    var $ = require('$');
    var TZT = new (require('tzt'))($);
    var oTools = TZT.TOOLS;
    $(function () {
        init();
    });
    function init() {
        document.getElementById('j_call').onclick = function () {
            changeURL('http://tel:4001022011/');
        };
        oTools.iscroll('#wrapper');
    }
});