/*
 *@NOTICE:common.js作为全站公用文件，其主要功能为：
 	A:创建一个全局的命名空间，对常用的零散功能进行归类和管理
	B:对JQ类库以及宿主对象做适当的扩充
	C:针对部分TZT特有的方法进行管理扩充
 *@ALT：公共类会保持定期的更新，请勿擅自修改,如发现有BUG请联系开发人员
 *@author:YYY 1037159943@qq.com  13282131370
 *@version:v1.0
 *@结构说明：见同目录文档
*/
var TZT = {};

function fnTZT() {
	var
	//时间戳
	_tag  = new Date().getTime(),
	//前端资源管理
	_host = {
		DN:"http://127.0.0.1:81/",
		PACKAGE:"LIBRARY/package/",
		COMCSS:"LIBRARY/common/css/",
		COMJS:"LIBRARY/common/js/",
		COMIMG:"LIBRARY/common/img/",
		BASEJS:function(){var oTHIS = this; return (oTHIS.DN+oTHIS.COMJS+'common-min.js');},
		BASECSS:function(){var oTHIS = this; return (oTHIS.DN+oTHIS.COMCSS+'base-min.css');},
		CITYMESG:function(){var oTHIS = this; return (oTHIS.DN+oTHIS.COMJS+'cityMesg-min.js');}
	},
	_req = {
		XML:'/reqxml?', //请求服务器数据
		LOCAL:'/reqlocal?',//请求客户端数据
		BINARY:'/reqbinary?',//请求服务器文件数据
		SAVEMAP:'/reqsavemap?',//请求本地保存数据
		READMAP:'/reqreadmap?',//读取本地保存数据
		SAVEFILE:'/reqsavefile?',//请求本地保存文件
		READFILE:'/reqreadfile?',//读取本地保存文件
		SOFTTODO:'/reqsofttodo?',//设置本地数据
		LOADFILE:'reqloadfile?',//加载本地文件
		SIGNATURE:'reqsignature?',//请求签名数据
		TZTVEDIO:'/tztvideo?'//本地播放指定URL视频
	},
	_gowhere = {
		G1964:'http://action:1964/?',//关闭当前页面，打开新页面
		G10002:'http://action:10002/?',//关闭当前页面，返回前一页面
		G10049:'http://action:10049/?',//是否显示进度条
		G10050:'http://action:10050/?',//视频验证
		G10051:'http://action:10051/?',//拍照
		G10054:'http://action:10054/?',//下载并打开下载文件
		G10055:'http://action:10054/?',//微信分享
		G10061:'http://action:10061/?',//打开指定URL并定制右上角操作
		G10062:'http://action:10062/?',//获取GPS位置，并打开指定URL
		G10063:'http://action:10063/?',//调用个股查询界面，获取查询结果，并调用指定js返回
		G10064:'http://action:10064/?',//华泰-个人中心
		G10065:'http://action:10065/?',//华泰-商城
		G10066:'http://action:10066/?',//华泰-添加账户
		G10067:'http://action:10067/?',//华泰-切换账户
		G10068:'http://action:10068/?',//打开专题指定URI
		G10069:'http://action:10069/?',//华西-PK
		G2608:'http://action:10069/?',//华西-组合申购
		G2615:'http://action:10069/?',//华西-组合说明
		G10070:'http://action:10070/?',//银联支付
		G10071:'http://action:10070/?',//清理通知栏
		G10090:'http://action:10090/?'//调用客户端登陆界面
	},
	//常用附件类型判断
	_fileType = {
		'application/msword':'doc',
		'application/pdf':'pdf',
		'application/x-shockwave-flash':'swf',
		'application/zip':'zip',
		'audio/mpeg':'mp3',
		'audio/x-wav':'wav',
		'image/gif':'gif',
		'image/jpeg':'jpeg',
		'image/jpeg':'jpg',
		'image/png':'png',
		'text/css':'css',
		'text/html':'html',
		'text/htm':'htm',
		'text/plain':'txt'
	},
	//常用正则表达式集合
	_reg = {
	//中文姓名
	"NAME":/^[\u4e00-\u9fa5]{2,8}$/gi,
	
	//一个或多个空格
	"SPACE":/[\s\p{Zs}]{0,}/, 
	
	//手机号码验证
	"PHONE":/^1(33|42|44|46|48|49|53|80|81|89|30|31|32|41|43|45|55|56|85|86|34|35|36|37|38|39|40|47|50|51|52|57|58|59|82|83|87|88|77|76|84|78|79|70)[0-9]{8}$/,
	//六位数字验证
	"SIXNUM":/^\d{6}$/,
	//发证机关
	"ISSUING":/^[\u4e00-\u9fa5]{4,}/, 
	//6位长度密码（中英文字母加下划线）
	"PASSWORD":/^\w{6}$/,
	//QQ号码
	'QQ':/^[1-9][0-9]{4,12}$/,
	//邮箱地址
	"EMAIL":/^(\w)+(\.\w+)*@(\w)+((\.\w+)+)$/,
	//银行卡号
	"BANKNUM":/^\d{16,19}$/,
	//座机号码
	"TELNO":/^0\d{2,3}-?\d{7,8}-?(\d{1,6})?$/,
	//日期验证，格式为 20140221 ,2014/02/21,2014-02-21,2014.02.21
	"DATE":/^(?:(?:1[0-9]|[0-9]{2})[0-9]{2}([-/.]?)(?:(?:0?[1-9]|1[0-2])\1(?:0?[1-9]|1[0-9]|2[0-8])|(?:0?[13-9]|1[0-2])\1(?:29|30)|(?:0?[13578]|1[02])\1(?:31))|(?:(?:1[6-9]|[2-9][0-9])(?:0[48]|[2468][048]|[13579][26])|(?:16|[2468][048]|[3579][26])00)([-/.]?)0?2\2(?:29))$/,
	//HTML标签
	"HTMLTAG":/<[^>]*?>/g
	},
	_splitTag = {
		A:'@',		D:',',			F:';',		S:'|',		M:':',		Y1:'&',		Y2:'&&',	Q:'$'			
	},
	_baseVar = {
		//局部公用设备信息变量
		APP : navigator.appVersion,
		APPVERSION:navigator.appVersion.toLocaleLowerCase(),
		ISANDROID:(/android/i).test(navigator.appVersion),  
	    ISIOS:(/iphone|ipad/i).test(navigator.appVersion),  //isIDevice
	    ISPLAYBOOK: (/playbook/i).test(navigator.appVersion),  
	    ISTOUCHPAD :(/hp-tablet/i).test(navigator.appVersion),
		_PHONEEVENT : ['touchstart', 'touchmove', 'touchend', 'touchcancel'],//touch Event
		_MOUSEEVENT : ['mousedown', 'mousemove', 'mouseup', 'mouseup'],//mouse Event
		HASTOUCH:function (){ return( ('ontouchstart' in window) && !this.ISTOUCHPAD); },//检测是否有触摸{事件}对象
		//事件兼容性
		STARTEVENT:function(){return(this.HASTOUCH() ? this._PHONEEVENT[0] : this._MOUSEEVENT[0]);},
		MOVEEVENT:function(){return(this.HASTOUCH() ? this._PHONEEVENT[1] : this._MOUSEEVENT[1]);},
		ENDEVENT:function(){return(this.HASTOUCH() ? this._PHONEEVENT[2] : this._MOUSEEVENT[2]);},
		CANCELEVENT:function(){return(this.HASTOUCH() ? this._PHONEEVENT[3] : this._MOUSEEVENT[3]);}
	},
	_tools = {
		/*@保存信息到本地客户端
		 *@param obj {object} - 要保存的对象型数据 - 必要性 - Y
		 *@param fnSuccess {function} - 成功保存的回调函数 ，可接收一个Boolean类型参数 - 必要性 - N
		 *@return void
		*/
		saveMapMesg:function(obj,fnSccess){
			var sSendURL = '';
			for(var x in obj){
				sSendURL += x + "=" + obj[x] + "&";	
			}
			sSendURL = sSendURL.slice(0,-1);
			$.ajax({
				url:'/reqsavemap?' + encodeURI(sSendURL),
				success:function(oData){
					if(oData.ERRORNO === "0"){
						fnSccess && fnSccess(true);
					}else{
						fnSccess && fnSccess(false);
					}	
				}
			})
		},
		/*@读取本地客户端信息
		 *@param sArray {Array} - 要读取的信息群 - 必要性 - Y 
		 *@param fnSuccess {function} - 成功读取的回调函数 ，并把读取的对象型信息作为参数传入该函数 - 必要性 - N
		 *@return void
		*/
		readMapMesg:function(sArray,fnSuccess){
			var sSendURL = '',oThis = this;
			for(var x = 0 ; x < sArray.length ; x++){
				sSendURL += sArray[x] + "=" + "&"	;
			}
			sSendURL = sSendURL.slice(0,-1);	
			$.ajax({
				url:"/reqreadmap?"+sSendURL,
				success:function(oData){
						fnSuccess && fnSuccess(oData);
				}
			})
		},
		/*
		 *@保存信息到本地文件
		 *@param:aOdata [obj,obj]  要缓存的数据 对象型数组类型 或者 字符串 或者 数组类型 见如下说明
		 *@param:fileName  string  保存数据的模块名称 字符串类型
		 *@param:fnSuccess {function} 保存成功的回调函数
		 *@ALT 四种保存数据格式说明：
			//A 当保存数据为对象型数组时	[{"url":"http://action:10061" ,"img":"ad2.png"},{"name":"simon","age":23} ]
			//B 当保存数据为数组时	["banner","new","adver","version"]
			//C 当保存数据为对象型	{"age":23}
			//D 直接保存字符串信息	 'asdfa'
		*/
		saveFileMesg:function(saveMesg,fileName,fnSuccess){
			var 
				sMesgType = $.type(saveMesg),
				sFileType = $.type(fileName),
				TYPE='',SAVEDATA='';
			if( sMesgType=== "object"){ //C类型
				TYPE = 'C';
			}else if(sMesgType === "string"){
				if( sFileType === "function"){
					return false;//两种情况：传了参数1,3，或者参数2,3 都是非法参数
				}else if(sFileType == "string"){
					TYPE = 'D';
				}else{
					return false;//非法格式	
				}
			}else if(sMesgType == "array"){
				var aThisType = $.type(saveMesg[0]);
				if(aThisType === "object"){
					TYPE = 'A';
				}else{
					TYPE = 'B';	
				}	
			}
			if(TYPE && TYPE=='A'){
				for(var x  = 0 ; x < saveMesg.length ; x++){
					for(var p in saveMesg[x]){
						SAVEDATA	+= p + "|" + saveMesg[x][p]+"|";
					}
					SAVEDATA = SAVEDATA.slice(0,-1);
					SAVEDATA	+= ",";
				}
			}else if(TYPE && TYPE=='B'){
				SAVEDATA = saveMesg.toString();
			}else if(TYPE && TYPE=='C'){
				for(var x in saveMesg){
					SAVEDATA += x + '=' + saveMesg[x] + '&';
				}
			}else if(TYPE && TYPE=='D'){
				SAVEDATA = saveMesg;
			}else{
				return false;	
			}
			if(TYPE=='A' || TYPE=='C'){SAVEDATA = SAVEDATA.slice(0,-1);}
			SAVEDATA = TYPE + '$$' + SAVEDATA;
			//console.log(SAVEDATA);
			var sSendURL = "/reqsavefile?filename=" + fileName;
			$.ajax({
				url:sSendURL,
				type:"POST",
				data:encodeURI(SAVEDATA),
				success:function(oData){
					fnSuccess && fnSuccess(oData);
				}
			})
		},
		/*
		 *@读取本地缓存文件信息
		 *@param:fileName  string  读取文件的文件名
		 *@param:fnSuccess {function} 读取成功的回调函数
		*/
		readFileMesg:function (fileName,fnSuccess){
			var sSendURL = "/reqreadfile?filename=" + fileName;
			$.ajax({
				url:sSendURL,
				success:function(oData){
					oData && splits(oData);
				}
			})
			var MESG , TYPE,READDATA,SPLITDATA;
			function  splits(oData){
				MESG = decodeURI(oData).split('$$'); TYPE=MESG[0]; READDATA=MESG[1];
				if(TYPE=='A'){
					SPLITDATA = [];
					var aThisSplit = READDATA.split(',');
					for(var x = 0; x < aThisSplit.length ; x++ ){
						var oThis = {},aSecod = aThisSplit[x].split('|');
						for(var p = 0 ; p < aSecod.length ; p++){
							if(p%2==0){
								oThis[aSecod[p]] = aSecod[p+1];
								p++;
							}
						}
						SPLITDATA.push(oThis);
					}
				}else if(TYPE=='B'){
					SPLITDATA = READDATA.split(',');
				}else if(TYPE=='C'){
					SPLITDATA = {};
					var aThisSplit = READDATA.split('&');
					for(var x = 0 ; x < aThisSplit.length ; x++){
						var  aThis = aThisSplit[x].split('=');
						SPLITDATA[aThis[0]] = aThis[1];
					}
				}else if(TYPE=='D'){
					SPLITDATA = READDATA;
				}
				fnSuccess && fnSuccess(SPLITDATA);
			}
		},
		filterCdata:function (){
			str.replace(new RegExp(/\>\<\!\[CDATA\[/g),'').replace(/\]\]/g,'"');
		}
	},
	
	//针对宿主对象的一些扩展
	_expandHostOBj = function() {
			/*
			 *@数组去重
			 *@param  array{Array} - 要去重的数组
			 *@param  isHard {Boolean} - 是否开启严格模式，默认true
			 *@return void
			*/
			Array.prototype.ditto = function(array){
				if(array.length < 2){ return array;}
				var aNew = [array[0]];
				for(var x = 1;x < array.length ; x++){
					var i = 0;
					for(var p = 0 ; p < aNew.length ; p++){
						if(array[x] === aNew[p] ){
							i++;
						}  
					}
					if(i < 1){ aNew.push(array[x]);}
				}
				return aNew;
			}
		//Array.ditto = Array.prototype.ditto;
		String.prototype.wordCount = function(sContent,bIstrim){
			sContent = (sContent || "")
				.replace(/<br[^>]*?>/g, "**")	// 将换行符替换成一个双字节字符
				.replace(/<[^>]*?>/g, "")	// 过滤 HTML标签
				.replace(/[\r\n	]*/g, "")	// 过去换行和 tab 符
				.replace(/\&nbsp;/g, " ")	// 空格转换
				.replace(/[^\x00-\xff]/g, "**")	// 转换成双字节统计
				.replace(/\s/g,"")          //过滤空格
				.replace(/[\r\n]/g, "");         //过滤回车
			if (bIstrim) {
				sContent = $.trim(sContent);
			}
			// 使用双字节统计，并且小数向上取整。
			return sContent.length / 2 + 0.5 >> 0 ;
		}
		window.changeURL = function(str) {
			var app = window.navigator.appVersion;
			if (app.indexOf("windows phone") > 0) {
				window.external.notify(str);
			} else if (app.indexOf("iphone") > 0) {
				window.location.href = str;
			} else if (app.indexOf("android") > 0) {
				window.MyWebView.onJsOverrideUrlLoading(str);
			} else {
				window.location.href = str;
			}
		}
		
		/*
		 *touch绑定事件
		 *param obj { DOM OBJECT}
		 *param callback
		 */
		window.bindTouch=function(obj, callback) {
			obj.addEventListener(_baseVar.STARTEVENT(), function(e) {
				obj.bTouchBtn = true;
			}, false);
			obj.addEventListener(_baseVar.MOVEEVENT(), function(e) {
				obj.bTouchBtn = false;
			}, false);
			obj.addEventListener(_baseVar.ENDEVENT(), function(e) {
				if (obj.bTouchBtn) {
					callback();
				}
			}, false);
		}
		
		/*
		 *@notice模拟点击按钮时类似 a:hover 效果
		 *@param  id { string } 操作按钮的ID，或者CLASS，优先绑定ID
		 *@param className {string} 高亮的样式名
		 *@param fnClick { funciton } 点击后的触发函数
		 */
		
		window.btnActive = function (id, className, fnClick) {
			var OBJECT = null;
			if ($("#" + id).length > 0) {
				OBJECT = $("#" + id);
			} else if ($("." + id).length > 0) {
				OBJECT = $("." + id);
			} else {
				return false;
			}
			OBJECT.live(_baseVar.STARTEVENT() + " " + _baseVar.ENDEVENT(), function(oEvent) {
				if (oEvent.type == _baseVar.STARTEVENT()) {
					$(id).addClass(className);
				} else {
					$(id).removeClass(className);
					fnClick && fnClick();
				}
			});
		}
		
		/*
		 *@NOTICE：兼容性处理区域滚动效果
		 *@param elementID {string} 内容滚动区域的ID
		*/
		window.OnTouchScreen = function(elementID){
		  var elem, tx, ty;
		  if('ontouchstart' in document.documentElement ) {
				  if (elem = document.getElementById(elementID)) {
					  elem.style.overflow = 'hidden';
					  elem.ontouchstart = ts;
					  elem.ontouchmove = tm;
				  }
		  }
		  function ts( e ) {
			var tch;
			if(  e.touches.length == 1 ){
			  e.stopPropagation();tch = e.touches[ 0 ];
			  tx = tch.pageX;ty = tch.pageY;
			}
		  }
		  function tm( e ){
			var tch;
			if(  e.touches.length == 1 ){
			  e.preventDefault();e.stopPropagation();
			  tch = e.touches[ 0 ];this.scrollTop +=  ty - tch.pageY;ty = tch.pageY;
			}
		  }
		}
	},

	/*对JQ的扩展*/
	_expandJQuery = function() {
		var oExpends = {
			/*jsonp扩展
			 * @param sUrl{string} 请求的地址
			 * @param oData{object || undefine} 请求数据要传输的参数
			 * @param fnSuccess{function} 成功之后的回调函数
			 * @param oSetter{object || undefine} ajax请求的其它配置项
			 */
			jsonp : function(sUrl, oData, fnSuccess, oSetter) {
				/*第二种传递参数形式（参数连接在sUrl后面）*/
				if ($.isFunction(oData)) {
					fnSuccess = oData;
					oSetter = fnSuccess;
					oData = null;
				}
				var oConfig = $.extend({
					url : sUrl,
					data : oData,
					dataType : "jsonp",
					success : fnSuccess
				}, oSetter || {})
				return $.ajax(oConfig);
			},

			/*同步加载脚本
			 * @param sUrl {string} 脚本地址
			 * @param fnSuccess{function} 成功后的回调函数
			 * @param oSetter{object} ajax配置重写
			 */
			asyncGetScript : function(sUrl, fnSuccess, oSetter) {
				var oConfig = $.extend({
					url : sUrl,
					dataType : "script",
					cache : false, //不从缓存加载
					async : false, //同步加载
					success : fnSuccess
				}, oSetter || {});

				return $.ajax(oConfig);
			},

			/*加载脚本集合
			 * @param asUrl{array} 要加载的脚本地址数组
			 * @param fnSuccess{function} 成功后的回调函数
			 * @param oSetter{object} ajax配置重写
			 */
			getScripts : function(asUrl, fnSuccess, oSetter) {
				var oThis = this, thisUrl = [], abStatus = [];

				if (jQuery.type(asUrl) == "string") {
					thisUrl = [asUrl];
				} else {
					thisUrl = asUrl;
				}
				$.each(thisUrl, function(nIndex, sUrl) {
					abStatus[nIndex] = false;
					oThis.asyncGetScript(sUrl, function() {
						abStatus[nIndex] = true;
						checkLoad(fnSuccess);
						//验证每个文件是否都加载成功
					}, oSetter)
				})
				function checkLoad(fnSuccess) {
					for (var i = 0; i < abStatus.length; i++) {
						if (!abStatus[i]) {
							return;
						}
					}
					fnSuccess && fnSuccess();
				}

			},
			/*加载样式文件
			 * @param sUrl{string} 加载文件地址
			 * @param fnSuccess{function} 回调函数(该方法中回调函数始终执行，通过回调函数的参数来判断执行方式)
			 *  @param nTime{number} 超时时间，单位秒
			 */
			getStyle : function(sUrl, fnSuccess, nTime) {
				var nTime = nTime || 3, bIsLoad = false, nTimeout = setTimeout(function() {
					fnSuccess & fnSuccess(false);
					//超时模式
				}, nTime * 1000);
				return $('<link href="' + sUrl + '" rel="stylesheet" />').appendTo($("head")).on("load", function() {//该Link标签的加载事件
					clearTimeout(nTimeout);
					fnSuccess && fnSuccess(true);
					//成功模式
				})
			},

			//通用ajax请求出错处理
			 ajaxError:function(textStatus,fnErr){
				var oMessage = {
					"timeout" : "请求超时.",
					"datatypeErr" : "数据格式出错"
				};
				switch (textStatus) {
					case 'timeout':
						alert(oMessage.timeout);
						break;
					case 'dataerr':
						alert(oMessage.datatypeErr);
						break;
					default:
						break;
				}
				fnErr && fnErr();
				return false;
			},
			/*
			 *@notice 通用Ajax请求
			 *@params sRequestURL { string } 发起请求的地址
			 *@params oSendData { Object } 请求的参数
			 *@params fnSuccess { function  } 请求成功后的回调函数
			 *@params oConfig { Object } Ajax 的配置项
			 */
		getData:function(sRequestURL, oSendData, fnSuccess, oConfig) {//回调函数 cfunc
			var oThis = this;
			var oDefConfig = {
				type : "POST",
				url : sRequestURL,
				data : oSendData,
				contentType : "application/x-www-form-urlencoded;", //避免乱码
				success : function(oData) {
					fnSuccess && fnSuccess(oData);
					/*if (oData.ERRORNO < 0 && !(oData.ERRORMESSAGE == null || oData.ERRORMESSAGE == '')) {
						alert(oData.ERRORMESSAGE);
						return false;
					} else {
						fnSuccess && fnSuccess(oData);
					}*/
				},
				error : function(oErr){ oThis.ajaxError(oErr);}
			}, oAjaxParm = {}, oParam = oConfig || {};
			if (oParam) {
				delete oParam.url;
				delete oParam.success;
			}
			oAjaxParm = $.extend(oDefConfig, oParam);
			$.ajax(oAjaxParm);
		},
	
			/*把seajs的核心方法赋予扩展到JQ中,待开启状态*/
			/*use : seajs.use,
			add : define,*/
			/*字符串替换既定关键词
			 *@param sString{string} 被替换的字符串   TZT.HOST + "login.shtml?user={mail}&pwd = {pwd}"
			 *@param oData{object} 包含替关键字段的替换对象 {user : **** , pwd:****}
			 *@return sString{string}
			 */
			replaceString : function(sString, oData) {
				if (oData == null) {
					return sString;
				}
				for (x in oData) {
					sString = sString.replace(new RegExp("\\{" + x + "\\}", "g"), oData[x]);
				}
				return sString;
			},
			/*参数解析
			 * param sContent{string}  传入的参数字符串
			 * return Object 返回被解析的参数对象
			 */
			parsingParam : function(sContent) {
				var sContent = sContent || location.search.slice(1),sKey = '&&',nIndex = sContent.indexOf("?")
						thisStr 	=  (nIndex>= 0 && nIndex<sContent.indexOf("&&")) ? sContent.slice(nIndex + 1, sContent.length):sContent;
					
				if (thisStr.indexOf(sKey) < 0) {
					sKey = '&';
				}
				var asContent = thisStr.split(sKey), oContent = {};
				for (var x = 0; x < asContent.length; x++) {
					var aSnap = [];
					aSnap = asContent[x].split("=");
					if (aSnap.length > 2) {
						var 	
							sThisPar = asContent[x],nSign = sThisPar.indexOf("=");
						oContent[sThisPar.slice(0,nSign)] = sThisPar.slice(nSign+1,sThisPar.length);
					} else {
						oContent[aSnap[0]] = aSnap[1];
					}
				}
				return oContent;
			},
			/*
			 *@notice 获取url中的参数
			 *@param sParamName {string } 要获取的参数字段名 必传参数
			 *@param sURL { string }  获取字段值的源地址 可不传，默认为 window.location.search
			 */
			getUrlParameter : function(sParamName, sURL) {
				var oThis = this,sURL = sURL || location.search.slice(1);
				return ((oThis.parsingParam(sURL))[sParamName]);
			},
			/*
			 *获取两个两个数字间的随机数
			 *param firstNum {number} 一个数
			 *param lastNum {number} 另一个数
			 *return  {Number}
			 */
			getRandom : function(firstNum, lastNum) {
				var nChoices;
				if (lastNum > firstNum) {
					nChoices = lastNum - firstNum + 1;
				} else {
					nChoices = firstNum - lastNum + 1;
				}
				return Math.floor(Math.random() * nChoices + firstNum);
			},

			/*
			 *生成N位数的时间戳，默认6位，最大17位
			 * param nLength {Number} 时间戳的位数
			 * return sTimespoint {string}
			 */
			timesPoint : function(nLength) {
				var 
				oThis = this,
				nMixLen = 6,
				nRandom = 0
				nMaxLen = 17,
				sTimespoint = '',
				sTime = String(+new Date()), 
				LENGTHNUM = nLength || sTime.length;
				LENGTHNUM < nMixLen ? LENGTHNUM = nMixLen : LENGTHNUM;
				LENGTHNUM > nMaxLen ? LENGTHNUM = nMaxLen : LENGTHNUM;
				if (LENGTHNUM <= sTime.length) {//获取的长度小于时间戳长度，尾部截取
					sTimespoint = sTime.slice(0 - LENGTHNUM);
				} else {
					var nGap = LENGTHNUM - nMixLen, //计算补给长度
					nFirst = Math.pow(10, nGap - 1), nLash = Math.pow(10, nGap) - 1;
					nRandom = this.getRandom(nFirst, nLash);
					//获取补给长度等长的随机数
					sTimespoint = sTime + String(nRandom);
				}
				return sTimespoint;
			},
			/*检测标签是否拥有某属性
			 *param ElementName  { string }  标签名称
			 *param attrName { string } 属性名称
			 *return  Boolean
			 */
			hasAttr : function(ElementName, attrName) {
				if (ElementName == null || attrName == null) {
					return false;
				}
				return ( attrName in document.createElement(ElementName));
			},
			/*检测对象是否为JQ对象
			 * param oTester{object} 被检测的对象
			 * return Boolean
			 */
			isJQuery : function(oTester) {
				return $.isElement(oTester.get(0));
			},
			/*检测对象是否为为DOM对象
			 * param oTester{object} 被检测的对象
			 * return Boolean
			 */
			isElement : function(oTester) {
				var nodeType = oTester.nodeType, oDomNodeType = {
					elementNode : 1, //元素节点
					attributeNode : 2, //属性节点
					textNode : 3, //文本节点
					commentNode : 8, //注释节点
					documentNode : 9 //文档节点
				}, bIsElement = false;
				try {
					for (var x in oDomNodeType) {
						if (oDomNodeType[x] == nodeType) {
							bIsElement = true;
							break;
						}
					}
					return bIsElement;
				} catch (err) {
					return bIsElement;
				}
			},
			/*
			 *常规性数据类型检测
			 */
			isNumber : function(oTester) {
				return ($.type(oTester) === "number")
			},
			isString : function(oTester) {
				return ($.type(oTester) === "string")
			},
			isDate : function(oTester) {
				return ($.type(oTester) === "date")
			},
			isBoolean : function(oTester) {
				return ($.type(oTester) === "boolean")
			},
			isObject : function(oTester) {
				return ($.type(oTester) === "object")
			},
			isFunction : function(oTester) {
				return ($.type(oTester) === "function")
			},
			isUndefined : function(oTester) {
				return ($.type(oTester) === "undefined")
			},
			isArray : function(oTester) {
				return ($.type(oTester) === "array")
			},
			isNull : function(oTester) {
				return ($.type(oTester) === "null");
			},
			//检测一个对象是否是空对象
			isEmptyObj:function(OBJ){
					 var bIsEmpty = true , N = 0 ;
					 for(var x in OBJ){
					  x ? N++ : '' ;
					 }
					 N > 0 ? bIsEmpty = false : '' ;
					return bIsEmpty ;
			}
		}

		//对扩展进行合并
		$.extend(jQuery, oExpends);
		return _TZT;
	},

	/*
	 * seajs的配置项
	 * 具体配置参数参考：https://github.com/seajs/seajs/issues/262
	 */
	_setPackage = function() {
		if(!seajs) return false;
		seajs.config({
			//TZT系列插件的路径快捷方式
			alias : {
				"TZT":_host.DN+_host.PACKAGE
			},
			// 文件编码
			charset : 'utf-8'
		})
		return _TZT;
	};

	/*
	*全局命名空间TZT的内部对象
	*/
	var _TZT = {
		TAG:_tag, //时间戳
		HOST:_host,//常用地址
		REQ:_req,//常用请求标头
		REG:_reg,//正则表达式集
		SPLITTAG:_splitTag,//分隔符集
		FILETYPE:_fileType,
		GOWHERE:_gowhere,
		BASEVAR:_baseVar,
		TOOLS:_tools
	}
	//全局执行入口
	function reader() {
		TZT = _TZT;
		_expandHostOBj();		//宿主对象的扩展
		_expandJQuery();		//JQ的扩展方法
		//_setPackage();		//seajs的配置
	}
	reader();
}//fnTZT END

fnTZT();

/*-----------------------  以上部分为公共类库文件，下面部分为单个项目的公用部分 ---------------------*/
/*
 *@name bindHandler {fn} 绑定手势事件
*/
function bindHandler(JDom,colorLight,colorDeep){
	var JHand = JDom;
	JHand.on("touchstart",function(){
		JHand.css("background-color",colorDeep);
	})
	JHand.on("touchend",function(){
		JHand.css("background-color",colorLight);
	})
}
/*
 *@name footerPosition {fn} 给所有的页面添加按钮定位到底部的功能
*/
function footerPosition() {
	var nHeight = $(window).height() - ($(".header").outerHeight(true) || 0) - ($(".footer").outerHeight()||0);
	if (nHeight && nHeight > 0){$(".j_package").css("height", nHeight + "px");}
}

/*
* @intention 根据步骤码判断页面跳转
*/
var goWhereZck = function (stepsData, pos) {
	if (!stepsData) {return;}
	var pageObj = {
			0: 'STEP_ZRJC',
			1: 'STEP_GRXX',
			2: 'STEP_FXCP',
			3: 'STEP_XXSB',
			4: 'STEP_SFZP',
			5: 'STEP_TZJY',
			6: 'STEP_ZSCP',
			7: 'STEP_QSXY',
			8: 'STEP_SFCG',
			9: 'STEP_SZMM',
			10: 'STEP_SPJZ',
			11: 'STEP_SQTJ',
			12: 'STEP_KHJG'
		},
		pageUrl = {
			'STEP_ZRJC': 'openCheck.htm',
			'STEP_GRXX': 'idInfoConf.htm',
			'STEP_FXCP': 'test/riskTest.htm',
			'STEP_XXSB': 'idInfoApply.htm',
			'STEP_SFZP': 'upLoadPhoto.htm',
			'STEP_TZJY': 'investorEdu.htm',
			'STEP_ZSCP': 'knowledgeTest.htm',
			'STEP_QSXY': 'signAgree.htm',
			'STEP_SFCG': 'bankStorage.htm',
			'STEP_SZMM': 'setPswd.htm',
			'STEP_SPJZ': 'vedioVerify.htm',
			'STEP_SQTJ': 'commitRes.htm',
			'STEP_KHJG': 'creditAcc.htm'
		};
	if (typeof(pos) != 'undefined' && pos !== '') {
		var count = 0,
		    total = 0;
		for (var key in stepsData) {
			if (count < pos) {
			    count++;
			    total++;
			    continue;
			} else {
				if (stepsData[key] == 0) {
					changeURL('/rzrqkh/' + pageUrl[key]);
					return;
				} else {
					total++;
				}
				count++;
			}
		}
		if (total == count || total > count) {
			changeURL('/rzrqkh/commitRes.htm');
		}
	} else {
		for (var key in stepsData) {
			if (stepsData[key] == 0) {
				changeURL('/rzrqkh/' + pageUrl[key]);
				return;
			}
		}
		changeURL('/rzrqkh/commitRes.htm');
	}
	/*if (typeof(step) != 'undefined' && step != '') {
		changeURL('/rzrqkh/' + pageUrl[pageObj[step]]);
		return;
	}*/
}

/*
* @intention 获取步骤码
*/
var getSteps = function(steps) {
	if (steps == 0) {
		return {'STEP_ZRJC': 0};
	} else if (steps == 1) {
		if (bOpenPass) {// STEP_SQTJ--commitRes.htm STEP_KHJG--creditAcc.htm
			return {'STEP_SQTJ': 0};
		} else {
			return {'STEP_KHJG': 0};
		}
	}
	var stepsObj = {};
	var	stepsArr = steps.slice(0, -1).split('|');
	for (var i = 0, len = stepsArr.length; i < len; i++) {
		var stepField = stepsArr[i],
			spltIndex = stepField.indexOf('='),
			stepName = $.trim(stepField.substring(0, spltIndex)),
			stepCode = $.trim(stepField.substring(spltIndex+1));
		stepsObj[stepName] = stepCode;
	}
	// 按页面顺序对步骤码排序
	var stepsCopy = $.extend(stepsObj, {});
	var pageArr = ['STEP_ZRJC', 'STEP_GRXX', 'STEP_FXCP', 'STEP_XXSB', 'STEP_SFZP', 'STEP_TZJY', 'STEP_ZSCP', 'STEP_QSXY', 'STEP_SFCG', 'STEP_SZMM', 'STEP_SPJZ'],
		orderStep = {};
	for (var i = 0, len = pageArr.length; i < len; i++) {
		var curStep = pageArr[i];
		for (var key in stepsCopy) {
			if (key == curStep) {
				orderStep[curStep] = stepsCopy[key];
				delete stepsCopy[key];
			}
		}
	}
	return orderStep;
}

/*
* @intention 提示框
* @athor zck
* @time 2015-03-12 11:45am
*/
function alertZck(option) {
	var nodeName = ['alertMask', 'alertMain', 'alertTitle', 'alertCnt', 'alertPara', 'cnclBtnA', 'confBtnA'],
		nodeObj = ['MASK', 'MAIN', 'TTL', 'CNT', 'PARA', 'CNCL', 'CONF'],
		NODE = {},
		opts = {
			type: '',
			msg: '暂无提示信息',
			cnclText: '取消',
			confText: '确定'
		};
	var stopFlag = true;
	option = $.extend(opts, option);
	function creatDom() {
		var	sMask = '<div id="alertMask"></div>',
			dubleBtn = '<div id="footer"><p><span class="btn" id="cnclBtnA">'+option.cnclText+'</span><span class="btn" id="confBtnA">'+option.confText+'</span></p></div>',
			sglBtn = '<div id="footer"><p><span class="btn sglBtn" id="confBtnA">'+option.confText+'</span></p></div>',
			/*sFoot = option.type == 'confirm' ? dubleBtn : sglBtn,*/
			sFoot = option.type == 'confirm' ? dubleBtn : (option.type == 'alert' ? sglBtn : ''),
			sMain = '<div id="alertMain" class="clear">'
						+ '<p id="alertTitle">提示</p>'
						+ '<div id="alertCnt">'
							+ '<p id="alertPara">'
							+ '</p>'
						+ '</div>'
						+ sFoot
					+ '</div>',
			sDom = sMask + sMain;
		removeDom();
		$(document.body).append(sDom);
		selDomObj();
		addMsg();
		bindEvent();
		refixMaskHgt();
		revisionPos();
	}
	// DOM节点如果存在，清除
	function removeDom() {
		if ($('#alertMask').length) $('#alertMask').remove();
		if ($('#alertMain').length) $('#alertMain').remove();
	}
	// 选择DOM节点
	function selDomObj() {
		for (var i = 0, len = nodeObj.length; i < len; i++) {
			NODE[nodeObj[i]] = $('#' + nodeName[i]);
		}
	}
	// 显示提示信息
	function addMsg() {
		$('#alertPara').html(option.msg);
	}
	// 绑定按钮事件
	function bindEvent() {
		NODE.CNCL.on('click', function() {
			option.cnclFn&&option.cnclFn();
			closeAlert();
		});
		NODE.CONF.on('click', function() {
			option.confFn&&option.confFn();
			closeAlert();
		});
		NODE.MASK.on('click', function() {
			closeAlert();
		});
	}
	// 修正遮罩层的高度
	function refixMaskHgt() {
		var winHgt = $(window).height(),
			docHgt = $(document.body).height();
		if (winHgt > docHgt) {
			NODE.MASK.css('height', winHgt + 'px');
		} else {
			NODE.MASK.css('height', docHgt + 'px');
		}
	}
	// 修正提示框在窗口中的位置
	function revisionPos() {
		NODE.MAIN.css({
			left: (window.innerWidth - NODE.MAIN.outerWidth(true)) * 0.5,
			top: ($(document.body).height() - NODE.MAIN.outerHeight(true)) * 0.5
		});
	}
	// 禁止触屏滑动--废弃
	function disMove() {
		document.addEventListener("touchmove",function(e) {
			if(stopFlag){
				e.preventDefault();
				e.stopPropagation();
			}
		}, false);
	}
    // 关闭对话框
    function closeAlert() {
    	$('#alertMask').remove();
    	$('#alertMain').remove();
    }
	creatDom(); 
}
