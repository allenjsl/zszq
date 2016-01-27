define(function (require, exports, module) {
    var $ = require('$');
    var TZT = new (require('tzt'))($);
    var oTools = TZT.TOOLS;
    $(function () {
        init();
    });
    function init() {
        var version = TZT.getUrlParameter('version');
        $('.j_version').html(version);
        oTools.iscroll('#wrapper');
    }
});