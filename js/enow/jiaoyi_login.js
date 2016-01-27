/// <reference path="../../../lib/jquery/jquery.js" />
/// <reference path="../../../lib/common/common.js" />
define(function (require, exports, module) {
    var $ = require('$');
    var TZT = new (require('tzt'))($);
    var not = require('rednot');
    var oTools = TZT.TOOLS;
	var myScroll;
    $(function () {
//    	Pie.Go(65)
//    	draw(0.65)
        init();
    });
    function init() {
        oTools.setHeight($('#wrapper'), 80);
        myScroll=oTools.iscroll('#wrapper');
        showelement();
        pageEvent();
        ShowNews();
    }
    function pageEvent() {
        //撤单入口
        $('.j_chedan').on('click', function () {
            action12340();
        });
        //持仓入口
        $('.j_chicang').on('click', function () {
            action12342();
        });
        //查询入口
        $('.j_chaxun').on('click', function () {
            action12303();
        });
        //买入入口
        $('.j_buy').on('click', function () {
            action12310();
        });
        //卖出入口
        $('.j_sale').on('click', function () {
            action12311();
        });
        //银证转账入口
        $('.j_yzzz').on('click', function () {
            action12330();//12302
        });
        //融资融券入口
        $('.j_rzrq').on('click', function () {
            action15001();
        });
        //打新股入口
        $('.j_dxg').on('click', function () {
            gochangeURL('/zsjy/app/jy/jy-xgsg/jy-xgsg.html');
        });
        //好产品入口
        $('.j_hcp').on('click', function () {
            alert('敬请期待');
        });
        //个股期权入口
        $('.j_ggqq').on('click', function () {
            alert('敬请期待');
        });
        //理财商城
        $('.j_lcsc').on('click', function () {
    		action10061("/zsjy/lcsc.html");
        });
        //现金通入口
        $('.j_xjt,.kaitong').on('click', function () {
            oTools.savexjtck(function () {
                gotoxjt();
            });
        });
    }
	/*
	var canvas = document.getElementById("canvas");
	var ctx = canvas.getContext("2d");
	var devicePixelRatio = window.devicePixelRatio || 1;
    var backingStorePixelRatio = ctx.webkitBackingStorePixelRatio ||
                                 ctx.mozBackingStorePixelRatio ||
                                 ctx.msBackingStorePixelRatio ||
                                 ctx.oBackingStorePixelRatio ||
                                 ctx.backingStorePixelRatio || 1;


    var ratio = devicePixelRatio / backingStorePixelRatio;
	var W = canvas.width;
	var H = canvas.height;
	var deg, new_deg, dif;
	var loop, re_loop;
	var text, text_w;

	function initcanvas() {
		ctx.clearRect(0, 0, W, H);
		ctx.beginPath();
		ctx.strokeStyle = "#e7e7e7";
		ctx.lineWidth = 5;
		ctx.arc(W / 2, H / 2, 45, 0, Math.PI * 2);
		ctx.stroke();

		var r = deg * Math.PI / 180;
		// 创建圆形渐变
		var gr = ['#e55126', '#e7e7e7'];
		var ga = 0, // gradient direction angle; 0 by default
		    gd = [
		    	100 / 2 * (1 - Math.cos(ga)), // x0
		    	100 / 2 * (1 + Math.sin(ga)), // y0
		    	100 / 2 * (1 + Math.cos(ga)), // x1
		    	100 / 2 * (1 - Math.sin(ga))  // y1
		    ];
		var lg = ctx.createLinearGradient.apply(ctx, gd);
		
		for (var i = 0; i < gr.length; i++) {
			var color = gr[i],
			    pos = i / (gr.length - 1);

			if ($.isArray(color)) {
				pos = color[1];
				color = color[0];
			}

			lg.addColorStop(pos, color);
		}

		ctx.beginPath();
		ctx.lineCap = 'round';
		ctx.strokeStyle = lg;
//		ctx.strokeStyle = "#e55126";
		ctx.lineWidth = 5;
		ctx.arc(W / 2, H / 2, 45, 0 - 90 * Math.PI / 180, r - 90 * Math.PI / 180);
		ctx.stroke();

		ctx.fillStyle = "#f00";
		ctx.font = "30px Helvetica Neue LT Pro";
		text = Math.floor(deg / 360 * 100) + "%";
		text_w = ctx.measureText(text).width;
		ctx.fillText(text, W / 2 - text_w / 2, H / 2 + 5);
		
		ctx.font = "bold 15px 黑体";
		ctx.fillText("持仓", 35, H / 2 + 22);
	}
	function draw(_r) {
//			var _r = 0.54;
		deg = 0; new_deg = 0; dif = 0;
		new_deg = Math.round(_r * 360);
//		dif = new_deg - deg;
		loop = setInterval(to, 0);//1000 / dif
	}
	function to() {
		if (deg == new_deg) {
			clearInterval(loop);
		}
		if (deg <= new_deg) {
			deg++;
		} else {
			deg--;
		}
		initcanvas();
	}
	*/
    function action117() {
        var oSend = {
            action: '117',
            MobileCode: '($MobileCode)',
            Token: '($Token)',
            Reqno: +new Date(),
            ReqlinkType: 1,
            StartPos: 0,
            MaxCount: 1000
        };
        TZT.getData(TZT.REQ.XML, oSend, function (oData) {
            oData.GRID2.shift();
            $.each(oData.GRID2, function (i, item) {
                var aItem = item.split('|');
                var coinTyoe = aItem[oData.CURRENCYINDEX];
                if (coinTyoe == '人民币') {
                    //总市值（股票市值）
                    var sZSZ = (+oData.MKTVAL_RMB).toFixed(2); //aItem[oData.MARKETVALUEINDEX];
                    //可用金额  
                    var sKYJE = (+aItem[oData.USABLEINDEX]).toFixed(2);
                    //可取余额
                    var sSQYE = (+aItem[oData.BALANCEINDEX]).toFixed(2);
                    //总资产
                    var sZZC = aItem[oData.TOTALASSETSINDEX];
                    //股票市值 除以 总资产(持仓百分比)
                    var precent = (sZZC==0?0:((+sZSZ) / (+sZZC))).toFixed(2) * 100;
                    //最大百分比
                    var maxprecent = +precent;
//                	draw(sZZC == 0 ? 0 : (sZSZ / sZZC));//sZSZ/sZZC
                    //    $('.j_ccbfb').html(startindex);
                    $('#total').html(sZZC);
                    $('#gupiao').html(sZSZ);
                    $('#keyong').html(sKYJE);
                    $('#kequ').html(sSQYE);
                	Pie.Go(maxprecent)
                    return false;
                }
            });
        });
    }
	//判断是否登录显示不同的元素
    function showelement(){
        var jLogin = $('.jiaoyi_top');
        oTools.isLogin(function () {
            action117();
            oTools.getauthority(function (res) {
                if (res == '1' || res == '') { return; }
                //动态关闭tips
                oTools.readFileMesg('tipstime', function (oData) {
                    var day;
                    if (oData) {
                        day = oData.day;
                    }
                    else {
                        day = 'a';
                    }
                    var nowday = new Date().getDate();
                    if (day == nowday) { return; }
                    $('.j_tips').show();
                    oTools.saveFileMesg({ day: nowday }, 'tipstime', function () {
                        var height = $('.j_tips')[0].offsetHeight;
                        var setid = setTimeout(function () {
                            $('.j_tips').animate({
                                marginTop: '-' + height + 'px'
                            }, 1000, '', function () {
                                $('.j_tips').hide();
                            });
                        }, 10000);
                    });
                });
            });
            jLogin.show();
        	myScroll.refresh();
        }, function () {
            jLogin.hide();
        	myScroll.refresh();
        });
    }
    function ShowNews(){
        oTools.getLocalMesg(['jyloginflag'], function (oData) {
            if (oData.JYLOGINFLAG == '0' || oData.JYLOGINFLAG=='1') { return; }
            //是否显示现金通收益红点
            oTools.isshowxjtsy(function (type2) {
                //如果有新股显示用点
                not.isread(function (type) {
                    if (type) {
                        $('<em class="radius"></em>').appendTo('.jy_icon03');
                    	tztsetrednot('32');
                    }
                    else {
                        if (!type2) {
                            action1901tab4('0');
                        }
                        $('.jy_icon03 em').remove();
                    }
                });
            });
        })
    }
	function GetMessage() {
		showelement();
		ShowNews();
	}
	window.GoBackOnLoad = function () {
		showelement();
		ShowNews();
	}
})

var Pie= {
	Go:function (_value) {
		$('.pie_progress').asPieProgress('reset');
		$('.pie_progress').asPieProgress('go',_value);
	}
}

/*
window.CanvasSketch = {
	vesion: "1.0.0",		
	author: "Gao",
};

CanvasSketch.lastId = 0;
//取得id。
CanvasSketch.getId = function (preString) {
	CanvasSketch.lastId += 1;
	return preString + CanvasSketch.lastId;
}

//图形的范围
CanvasSketch.Bounds = function (x1, y1, x2, y2) {
	this.leftBottom = new CanvasSketch.Position(x1, y1);
	this.rigthTop = new CanvasSketch.Position(x2, y2);
	this.leftTop = new CanvasSketch.Position(x1, y2);
	this.rightBottom = new CanvasSketch.Position(x2, y1);
	this.left = x1;
	this.right = x2;
	this.bottom = y1;
	this.top = y2;
}

//位置信息类
CanvasSketch.Position = function (x, y) {
	this.x = x;
	this.y = y;
}

//大小类
CanvasSketch.Size = function (w, h) {
	this.w = w;
	this.h = h;
}

//矢量图形的默认样式
CanvasSketch.defaultStyle = function () {
	this.fill = true;
	this.stroke = true;
	this.pointRadius = 5;
	this.fillOpacity = 0.6;
	this.strokeOpacity = 1;
	this.fillColor = "red";
	this.strokeColor = "black";
}

//图层类
function Layer(div) {
    var style = div.style;
    var size = new CanvasSketch.Size(parseInt(style.width), parseInt(style.height));
    this.size = size;
    this.div = div;    
    this.maxBounds = new CanvasSketch.Bounds(-size.w / 2, -size.h / 2, size.w / 2, size.h / 2);
    this.bounds = new CanvasSketch.Bounds(-size.w / 2, -size.h / 2, size.w / 2, size.h / 2);
    this.zoom = 100;
    this.vectors = {};
    //加入矢量图形的总个数。
    this.vectorsCount = 0;
    //创建一个渲染器。
    this.renderer = new Canvas(this);
}

Layer.prototype.addVectors = function (vectors) {
    this.renderer.lock = true;
    for(var i = 0, len = vectors.length; i < len; i++) {
        if(i == len-1) {this.renderer.lock = false;}
        this.vectors[vectors[i].id] = vectors[i];
        this.drawVector(vectors[i]);
    }
    this.vectorsCount += vectors.length;
}

Layer.prototype.drawVector = function (vector) {
    if(!vector.style) {
        style = new CanvasSketch.defaultStyle();
    }
    this.renderer.drawGeometry(vector.geometry, style);
}

function Vector(geometry, attributes) {
    this.id = CanvasSketch.getId("vector");
    this.geometry = geometry;
    if(attributes) {
        this.attributes = attributes;
    }
}

function Geometry(){
    this.id = CanvasSketch.getId("geomtry_");
}

//bounds属性定义了当前Geometry外接矩形范围。
Geometry.prototype.bounds = null;

//定义Geometry的id属性。
Geometry.prototype.id = null;

//定义对bounds基类克隆的方法
Geometry.prototype.clone = function () {
    return new Geometry();
}

//销毁当前的Geometry
Geometry.prototype.destroy = function () {
    this.bounds = null;
    this.id = null;
}

function Point(x, y) {
    Geometry.apply(this, arguments);
    this.x = x;
    this.y = y;
}

Point.prototype = new Geometry();
//point类的横坐标。
Point.prototype.x = null;
//point类的纵坐标。
Point.prototype.y = null;

//得到点的范围。
Point.prototype.getBounds = function () {
    if(!this.bounds) {
        var x = this.x;
        var y = this.y;
        this.bounds = new CanvasSketch.Bounds(x, y, x, y);
        return this.bounds;
    } else {
        return this.bounds;
    }
}

//clone方法。
Point.prototype.clone = function () {
    return new Point(this.x, this.y);
}

function Canvas (layer) {
	this.canvas = document.createElement("canvas");
	this.context = this.canvas.getContext("2d");
	this.lock = true;
	this.layer = layer;
	this.setSize(layer.size);
	this.geometrys = {};
	layer.div.appendChild(this.canvas);
}
	
Canvas.prototype.setSize = function(size){
	this.canvas.width = size.w;
	this.canvas.height = size.h;
	this.canvas.style.width = size.w + "px";
	this.canvas.style.height = size.h + "px";
}
	
Canvas.prototype.drawGeometry = function(geometry, style){
	this.geometrys[geometry.id] = [geometry, style];
	//如果渲染器没有被锁定则可以进行重绘。
	if(!this.lock){
		this.redraw();
	}
}
	
Canvas.prototype.redraw = function(){
	this.context.clearRect(0, 0, this.layer.size.w, this.layer.size.h);
	var geometry;
	if(!this.lock){
		for(var id in this.geometrys){
			if(this.geometrys.hasOwnProperty(id)){
				geometry = this.geometrys[id][0];
				style = this.geometrys[id][1];
				this.draw(geometry, style, geometry.id);
			}			
		}
	}	
}
	
Canvas.prototype.draw = function(geometry, style, id){
	if(geometry instanceof Point){
		this.drawPoint(geometry, style, id);
	}
	//{todo} 我们在这里判断各种矢量要素的绘制。		
}

Canvas.prototype.drawPoint = function(geometry, style, id){
	var radius = style.pointRadius;
	var twoPi = Math.PI*2;
	var pt = this.getLocalXY(geometry);
	//填充
	if(style.fill) {
		this.setCanvasStyle("fill", style)
		this.context.beginPath();
		this.context.arc(pt.x, pt.y, radius, 0, twoPi, true);
		this.context.fill();
	}
	//描边
	if(style.stroke) {
		this.setCanvasStyle("stroke", style)
		this.context.beginPath();
		this.context.arc(pt.x, pt.y, radius, 0, twoPi, true);
		this.context.stroke();
	}
	this.setCanvasStyle("reset");
}

Canvas.prototype.setCanvasStyle = function(type, style) {
	if (type === "fill") {     
		this.context.globalAlpha = style['fillOpacity'];
		this.context.fillStyle = style['fillColor'];
	} else if (type === "stroke") {  
		this.context.globalAlpha = style['strokeOpacity'];
		this.context.strokeStyle = style['strokeColor'];
		this.context.lineWidth = style['strokeWidth'];
	} else {
		this.context.globalAlpha = 0;
		this.context.lineWidth = 1;
	}
}

Canvas.prototype.getLocalXY = function(point) {
	var resolution = this.layer.zoom / 100;
	var extent = this.layer.bounds;
	var x = (point.x * resolution + (-extent.left * resolution));
	var y = ((extent.top * resolution) - point.y * resolution);
	return new CanvasSketch.Position(x, y);
}
*/