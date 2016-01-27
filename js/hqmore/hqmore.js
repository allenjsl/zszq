define(function (require, exports, module) {
    var $ = require('$');
    var TZT = new (require('tzt'))($);
    var oTools = TZT.TOOLS;
    $(function () {
        init();
    });
    function init() {
        pageEvent();
        oTools.iscroll('#wrapper');
    }
    //
    function action10075(hqmenuitem, subitemspos) {
        var params = 'isblock=0&&hqmenuitem=' + hqmenuitem;
        if (subitemspos) {
            if (hqmenuitem == 1701 || hqmenuitem == 70101) { subitemspos = ''; }
            params += '&&subitemspos=' + subitemspos;
        }
        changeURL('http://action:10075/?' + params);
    }
    function pageEvent() {
        $('.b-line span').on('click', function () {
            var aInfo = $(this).attr('data-info').split('|');
            if (aInfo[0]) {
                action10075(aInfo[0], aInfo[1]);
            }
        });
    }
});