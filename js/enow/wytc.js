/// <reference path="../../lib/jquery/jquery.js" />
/// <reference path="../../lib/common/common.js" />
define(function (require, exports, module) {
    var $ = require('$');
    var slide = require('slide');
    var TZT = new (require('tzt'))($);
    var oTools = TZT.TOOLS;
    var myScroll;
	var isnormallogin='',code = '',name='';
	var accounttype = '';
	var pagenum = 1;
    //配置信息
    var oConfig = oTools.config;
	$(function() {
		init();
		pageEvent();
	});
    function init() {
//        oTools.iscroll('#wrapper1');
        oTools.setHeight($('#wrapper2'), 40);
    	oTools.readMapMesg(['isnormallogin', 'username', 'fundid', 'realname'], function(oData) {
    		isnormallogin = oData.ISNORMALLOGIN;
    		//判断是否登录：有登录取登录信息，未登录取最近一次登录信息
    		if (isnormallogin != '1') {
//    			oTools.readFileMesg('normallogin', function(oData) {
//    				name = oData.realname;
//    				if (oData.fundid!='null'&&oData.fundid) {
//    					code = oData.fundid;
//    					accounttype = 1;
//    				} else {
//    					code = oData.yonghuming;
//    					accounttype = 2;
//    				}
//    				gettclist(pagenum);
//    			})
    			oTools.getLocalMesg(['yonghuming','realname','fundid'], function(oData) {
//    				alert(JSON.stringify(oData))
    				name = oData.REALNAME;
    				if (oData.FUNDID!='null'&&oData.FUNDID) {
    					code = oData.FUNDID;
    					accounttype = 1;
    				} else {
    					code = oData.YONGHUMING;
    					accounttype = 2;
    				}
    				gettclist(pagenum);
    			})
    		} else {
    			name = oData.REALNAME;
    			if (oData.FUNDID.length > 0) {
    				code = oData.FUNDID;
    				accounttype = 1;
    			} else {
    				code = oData.USERNAME;
    				accounttype = 2;
    			}
    			gettclist(pagenum);
    		}
    	});  	
        myScroll = oTools.iscroll('#wrapper2', function (type, fn) {
            if (type == 'more') {
                pagenum += 1;
                gettclist(pagenum, 'more', fn);
            }
            else {
                pagenum = 1;
                gettclist(pagenum, '', fn);
            }
        });
    }
    function pageEvent() {
    	$("li[data-class='tab_biaoti']").on('click',function() {
    		var _index = $("li[data-class='tab_biaoti']").index(this);
    		$("li[data-class='tab_biaoti']").removeClass("active").addClass("normal");
    		$(this).addClass("active");
    		$("div[data-class='tab_neirong']").hide();
    		$("div[data-class='tab_neirong']").eq(_index).show();
    	});
    	$('#tcCnt').on('input', function() {
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
    		$('#zishu').html(length);
    	});
    	$('#tijiao').on('click', function() {
    		var _c = $('#tcCnt').val();
            if (!_c) {
                alert('吐槽内容不能为空！'); return;
            }
    		tijiao(_c);
    	});
        $('.tel').on('click', function () {
            changeURL('http://tel:4001022011');
        });
    }
	function gettclist(ncount, type, fn) {
		if (isnormallogin!='1') {
			$('#tclist').html('<div class="nodatalist">抱歉，您需要登录后才可以看到我的吐槽记录及小鹿的回复哦！</div>');
			return;
		}
    	var _oSend = {
    		action: 46122,
    		CODE: code,
    		PAGENUM: ncount,
    		PAGESIZE: 10
    	};

    	TZT.getData(TZT.REQ.XML, _oSend, function(oData) {
            var errormsg = oData.ERRORMESSAGE;
            if (errormsg == '查无记录!'|| !oData.GRID0)
            {
                if (ncount == 1 || type != 'more') {
                    $('#tclist').html(TZT.nodatadom);
                }
                fn && fn(); 
                return;
            }
            var sDom = '';
            $.each(oData.GRID0, function (i, item) {
                var aItem = item.split('|');
                //添加时间
                var _adddate = aItem[1];
                //吐槽内容
                var _content = aItem[2];
            	//回复状态
            	var _status = aItem[3];
            	//回复时间
                var _ansdate = aItem[4];
            	//回复内容
                var _anscontent = aItem[5];

            	sDom += '<li>' +
	            	    '    <div class="my_txt">' +
		            	'        <p class="title">' +
			            '            我的吐槽<span class="floatR">' + _adddate + '</span></p>' +
				        '        <p class="cont">' +
					    '            ' + decodeURIComponent(_content)  + '</p>' +
						'    </div>' +
							(_status=='2'?'':(
						'    <div class="hf_txt">' +
						'        <p class="title">' +
						'            小鹿回复：<span class="floatR">' + decodeURIComponent(_ansdate) + '</span></p>' +
						'        <p class="cont">' +
						'            ' + _anscontent + '</p>' +
						'    </div>' +
						'</li>'));
            });
            if (type == 'more') {
                $('#tclist').append(sDomCC);
            } else {
                $('#tclist').html(sDom);
            }
            fn && fn();
    	});
	}
	function tijiao(_neirong) {
		var _oSend = {
			action: 46121,
			CODE: code,
			NAME: name,
			ACCOUNT_TYPE: accounttype,
			CONTENT: encodeURIComponent(_neirong)
		};

		TZT.getData(TZT.REQ.XML, _oSend, function(oData) {
			if (oData.ERRORNO != "1") {
				alert(oData.ERRORMESSAGE);
			} else {
				alert('吐槽成功');
				$('#tcCnt').val('');
				$("li[data-class='tab_biaoti']").eq(1).trigger('click');
				pagenum = 1;
                gettclist(pagenum);
			}
		});
	}
	window.GetMessage=function () {
		window.location.reload();
	}

	window.GoBackOnLoad = function () {
		window.location.reload();
	}
});