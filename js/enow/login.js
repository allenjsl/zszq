/// <reference path="../../lib/jquery/jquery.js" />
/// <reference path="../../lib/common/common.js" />
define(function (require, exports, module) {
    var $ = require('$');
    var TZT = new (require('tzt'))($);
    var oTools = TZT.TOOLS;
	var v = 1.0;

	var canvas = document.querySelector('canvas');
	var context = canvas.getContext('2d');

	context.font = '20px Verdana'; // 字体大小和字体名

	var lineHeight = 15; // 行高
	var backLength = 4;
	var keyYOffsets = { };
	var keyAOffsets = { };
	var backSpeed = 10000 + parseInt(100 * Math.random());
	var keySpeed = 12000 + parseInt(100 * Math.random());
	var key = '';
	var randomchar = '0123456789';
	var jsonzhanghaos = [];
	
    $(function () {
        init();
    	pageEvent();
//        oTools.iscroll('#wrapper');
    });
	
    /**
     * 初始化页面内容
     */
    function init() {
//    	initcanvas(randomText(randomchar, backLength);
    	Checking.init();

    	oTools.readFileMesg('normallogin', function(oData) {
//        	alert(JSON.stringify(oData))
    		//上一次登录帐号
    		$('#username').val(oData.yonghuming);
    		//历史登陆账号
    		if (oData.jsonzhanghaos) {
    			jsonzhanghaos = oData.jsonzhanghaos.split('|');
    			GetZhangHaos(jsonzhanghaos);
    		}
    		//是否记住账号
    		if (oData.jizhuzhanghao == '1') {
    			$('#jizhuzhanghao s').toggleClass('fxk_on');
    		}
    	});
    }
	/**
	 * 初始化页面事件
	 */
    function pageEvent() {
//    	setInterval(function() {
//    		render(Number(new Date), context);
//    	}, 100);
    	
    	$('canvas').on('click', function() {
//    		initcanvas(randomText(randomchar, backLength));
    		Checking.init();
    	});
    	$("#jizhuzhanghao").on('click',function () {
    		$(this).find('s').toggleClass('fxk_on');
    	})
    	$('#find').on('click',function () {
    		action10061('/zsjy/app/login/findpassword.html')
    	})
    	$('#register').on('click',function () {
    		action1964('/zsjy/register2.html');
    	})
    	$('#login').on('click',function () {
    		var _username = $('#username').val();
    		var _password = $('#password').val();
    		var _checkcode = $('#checkcode').val();

    		if (_username.length==0) {
    			alert('请输入用户名');
    			return false;
    		}
    		if (_password.length==0) {
    			alert('请输入密码');
    			return false;
    		}
    		if (_checkcode.length==0) {
    			alert('请输入验证码');
    			return false;
    		}
    		if (!Checking.check()) {
//    		if (_checkcode!=key) {
    			alert('请输入正确的验证码');
    			return false;
    		}
    		$('canvas').trigger('click');
    		login(_username,_password);
    	})
    	$('#toggle').on('click',function (event) {
    		if (event.target==this&&jsonzhanghaos.length>0) {
				if ($(this).is('.T_jiantou')) {
					$(this).attr('class', 'B_jiantou');
				} else {
					$(this).attr('class', 'T_jiantou');
				}
    			$('#zhanghao').slideToggle('fast');
    		}
    	})
    	$('#username,#password,#checkcode').on('focus', function() {
    		var _this = $(this);
    		var _that = _this.closest('ul').find('.radius');
    		var _del = '<i class="radius"></i>';
    		_that.remove();
    		$(_del).insertAfter(_this).on('click', function() {
    			_this.val('').focus();
    		})
    	});
    	$(':not(#toggle)').on('click',function (event) {
			if (event.target==this&&$('#zhanghao').is(':visible')) {
				$('#toggle').trigger('click');				
			}
    	})
    }
	function DoSet(_o,_event) {
		if (_event.target == _o) {
			var _index = $(_o).index();
			$('#username').val(jsonzhanghaos[_index]);
			GetZhangHaos(jsonzhanghaos);
			$('#toggle').trigger('click');
		}
	}
	function DoDelete(_o,_event) {
		if (_event.target == _o) {
			var _index = $(_o).closest('li').index();
			if (confirm('确定要删除：' + jsonzhanghaos[_index] + '的信息记录么？')) {
				jsonzhanghaos.splice(_index, 1);
				GetZhangHaos(jsonzhanghaos);
			}
		}
	}
	function GetZhangHaos(_jsonzhanghaos) {
		var _zhanghaos = '';
		$(_jsonzhanghaos).each(function(i,value) {
			_zhanghaos += '<li>' + value + '<i class="radius"></i></li>';
//			_zhanghaos += '<li ' + (value == $('#username').val() ? 'class="on"' : '') + '>' + value + '<i class="radius"></i></li>';
		});
		$('#zhanghao ul').html(_zhanghaos);
    	$('#zhanghao ul li i').on('click',function (event) {
    		DoDelete(this, event);
    	})
    	$('#zhanghao ul li').on('click',function (event) {
    		DoSet(this, event);
    	})
	}
	/**
	 * 登录
	 * @param {String} _username 用户名
	 * @param {String} _password 密码
	 */
	function login(_username,_password) {
		var _oSend = {
			action: 31004,
			merid: "applogin",
			bizcode: "app.login",
			timestamp: TZT.TAG,
			req_id: Math.random(),
			v: v,
			charset: "utf-8",
			sign_type: "rsa",
			format: "json",
			data: JSON.stringify({username:_username,password:_password})
		};

		TZT.getData(TZT.REQ.XML, _oSend, function(oData) {
			oData.BINDATA = JSON.parse(oData.BINDATA);
			oData.BINDATA.data = JSON.parse(oData.BINDATA.data);
			if (oData.BINDATA.state!='0') {
				alert(oData.BINDATA.message);
				return;
			}
			if (oData.BINDATA.data.errno != "0") {
				alert(oData.BINDATA.data.msg);
			}
			else {
				if ($('#jizhuzhanghao s').hasClass('fxk_on')) {
					if ($.inArray(_username,jsonzhanghaos)>=0) {
						oTools.saveFileMesg({
								jizhuzhanghao: '1', 
								yonghuming: _username,
								realname:oData.BINDATA.data.dataset[0].realname,
								fundid:oData.BINDATA.data.dataset[0].fundid,
								jsonzhanghaos:jsonzhanghaos.join('|')
							},'normallogin', function(oData) {});
					} else {
						jsonzhanghaos.push(_username);
						oTools.saveFileMesg({
								jizhuzhanghao: '1',
								yonghuming: _username,
								realname:oData.BINDATA.data.dataset[0].realname,
								fundid: oData.BINDATA.data.dataset[0].fundid,
								jsonzhanghaos: jsonzhanghaos.join('|')
							}, 'normallogin', function(oData) {});
					}
				}
				else {
					oTools.saveFileMesg({
							jizhuzhanghao: '',
							yonghuming: _username,
							realname: oData.BINDATA.data.dataset[0].realname,
							fundid: oData.BINDATA.data.dataset[0].fundid,
							jsonzhanghaos: jsonzhanghaos.join('|')
						}, 'normallogin', function(oData) {});
				}
				oTools.saveMapMesg({ 
						userid: oData.BINDATA.data.dataset[0].userid, 
						username: oData.BINDATA.data.dataset[0].username,
						realname: oData.BINDATA.data.dataset[0].realname,
						usertype:oData.BINDATA.data.dataset[0].usertype,
						mobileno:oData.BINDATA.data.dataset[0].mobile,
						fundid:oData.BINDATA.data.dataset[0].fundid,
						custid:oData.BINDATA.data.dataset[0].custid,
						isnormallogin:1
					}, function() {
						//判断是否资金帐号登录
						if (oData.BINDATA.data.dataset[0].fundid) {
							changeURL('http://action:10090/?logintype=1&&loginkind=1&&quittrade=1&&account='+_username+'&&password='+_password+'&&showpagetype=1');
//		                    var _oSend = {
//			                    Action: 100,
//			                    accounttype: 'ZJACCOUNT',
//		                    	YybCode:'23552',//中山证券营业部代码：23552
//		                    	account:_username,
//		                    	password:_password,
//                                Reqno: +new Date()
//		                    };
//							var _oSend = {
//			                    Action: 10090,
//			                    logintype: 1,
//		                    	loginkind:1,
//								quittrade:1,
//		                    	account:_username,
//		                    	password:_password,
//								showpagetype:1
//		                    };

//							//TZT.REQ.XML    TZT.GOWHERE.G10090
//		                    TZT.getData('/reqlocal?',_oSend,function (oData) {
////		                    	alert(JSON.stringify(oData));
		                    	action10002();
//		                    });
						}
						else {
							action10002();
						}
				});
			}
		});
	}
    /**
     * 绘制旋转的文字
     * @param {CanvasRenderingContext2D} context 上下文
     * @param {String} text 文本
     * @param {Number} x 中心坐标 x
     * @param {Number} y 中心坐标 y
     * @param {Number} angle 角度，单位弧度
     */
    function rotateText(context, text, x, y, angle) {
      if (!context) {
        return;
      }

      context.save(); // 保存上次的风格设置
      context.textAlign = 'center'; // 横向居中
      context.textBaseline = 'middle'; // 纵向居中
      context.translate(x, y); // 修改坐标系原点
      context.rotate(angle); // 旋转
      context.strokeText(text, 0, 0); // 绘制文本
      context.restore(); // 恢复上次的风格设置
    }
    /**
     * 随机字符串
     * @param{String} chars 字符串
     * @param{Number} len 长度
     */
    function randomText(chars, len) {
      var result = '';
      for (var i = 0; i < len; i++) {
        result += chars.charAt(parseInt(chars.length * Math.random()));
      }
      return result;
    }
    /**
     * 初始化验证码
     * @param {String} value 验证码字符串
     */
	function initcanvas(value) {
		key = String(value).toUpperCase();
		
		context.fillStyle = '#FFFFFF';
		context.fillRect(0, 0, canvas.width, canvas.height);
		context.fillStyle = '#000000';
        context.textAlign = 'center'; // 横向居中
        context.textBaseline = 'middle'; // 纵向居中
        context.strokeText(value, 30, 18); // 绘制文本
        context.restore(); // 恢复上次的风格设置

//		for (var i = 0; i < key.length; i++) {
//			keyYOffsets[i] = Math.random() * lineHeight / 2;
//			keyAOffsets[i] = 0.05 - Math.random() * 0.1;
//		}
	}
    /**
     * 绘制动态验证码
     * @param {Number} now 当前时间戳
     * @param {CanvasRenderingContext2D} context 上下文
     */
	function render(now, context) {
		context.fillStyle = '#FFFFFF';
		context.fillRect(0, 0, canvas.width, canvas.height);
		context.fillStyle = '#000000';

		// 绘制 key
		var tick = now % keySpeed;
		var keyCharWidth = canvas.width / key.length;
		for (var i = 0; i < key.length; i++) {
			var tx = keyCharWidth + (((canvas.width - keyCharWidth) / key.length) * i) % canvas.width;
			var ty = Math.cos(now / 1000) * Math.PI * keyYOffsets[i];
			rotateText(context, key[i], tx,
				canvas.height / 2 - ty, Math.cos(now / 1000) * Math.PI * 0.1 + keyAOffsets[i]);
		}
	}
});


/**
 * @description :js生成验证码(仿原生)，经测试通过Android, IOS 浏览器
 * @author : 柳刚强 2015.08.23
 */
var Checking = {};

Checking = {
	$ : function(id) {
		return document.getElementById(id);
	},

    //随机数字的颜色值，对应值来自原生客户端
	color : ['#A83A90', '#144D7B', '#A54D0D', '#301069', '#24114D', '#FC0080',
			'#96151D', '#06007D', '#587D9A', '#FD4600', '#0A4700'],
	cacheValue : null,// 缓存画布上的值,比对时用
	// 初始化
	init : function() {
		
			this.drawCanvas();

	},

	// 根据html canvas生成验证码
	drawCanvas : function() {
		var canvas = this.$("myCanvas");// 获得画布
		var context = canvas.getContext("2d");
		this.drawBgColor(context,canvas.width, canvas.height);// 画验证码背景 和 干扰线
		this.drawText(context,canvas.width, canvas.height);// 像图片上写验证码
	},
	/**
	 * @description : 画背景
	 * @param {}
	 *            context : 画布上下文，相当于graphics
	 */
	drawBgColor : function(context,width,height) {

		context.fillStyle = '#cfcfcf';  //背景颜色
		context.fillRect(0, 0, width, height);
		
		for(i=0; i<3+this.getBigRandom(3);i++)  //画随机干扰线
		{
			context.strokeStyle = this.getRandomColor();
			context.lineWidth = 1.0;
			context.beginPath();  
			context.moveTo(this.getBigRandom(20), this.getBigRandom(height));  
			context.lineTo(20+this.getBigRandom(width-20), this.getBigRandom(height));  
			context.closePath();
			// 将这条线绘制到 canvas 上  
			context.stroke(); 
		}
		
	},

	/**
	 * @description : 画文字
	 * @param {}
	 *            context
	 */
	drawText : function(context,width,height) {
		var x = (width - 4*20 )/2;
		var y = height /2  + 12;
	    var y1 ;

		context.font = "bold 15pt Calibri";
		context.textAlign = "center";
		context.fillStyle = this.getRandomColor();
		var newText = this.getRandomDigit(4);
		this['cacheValue'] = newText;
		for (i=0; i<4 ; i++)  //一个一个数字画,每个上下浮动，颜色随机
		{
			context.fillStyle = this.getRandomColor();
			y1 =  y + this.getBigRandom(10) - this.getBigRandom(10);
		//	alert(y1);
			context.fillText(newText[i], x+15*i+16, y1-5);  //上下浮动
		}
		
	},

	/**
	 * 获得随机颜色
	 * 
	 * @return {}String : HEX
	 */
	getRandomColor : function() {
		var len = this.color.length, random = this.getBigRandom(len);
		return this['color'][random];
	},

	/**
	 * @description :根据scale以内的随机整数
	 * @param {}
	 *            scale : 随机数边界
	 * @return {} : Number
	 */
	getBigRandom : function(scale) {
		return Math.floor(Math.random() * (scale || 10));
	},

	/**
	 * @description : 获得画布上的字符串,数字的随机组合
	 * 
	 * @param {}
	 *            length :字符串位数
	 * @return {} :String
	 */
	getRandomDigit : function(length) {
		var result = [];
		var arr = this.getDigit();
		for (var i = 0; i < length; i++) {
			result.push(arr[this.getBigRandom(10)]);
		}
		return result.join("");

	},

	/**
	 * 获得0～9的数组
	 * 
	 * @return {}Array[Number]
	 */
	getDigit : function() {
		var arr = [];
		for (var i = 0; i < 10; i++) {
			arr.push(i);
		}
		return arr;
	},

	

	// 判断
	check : function() {
		var chkValue = this['cacheValue'].toUpperCase();
		var inputValue = this.$('checkcode').value.toUpperCase();
		// alert(chkValue+"\n"+inputValue);
		return (chkValue == inputValue);
	}
}
