api = 'http://88.8.8.167:10411/api';

//自动缩放
(function($, document, undefined){
	$.init = function(){
		var	rate = $(window).width()/640;
		$('[name="viewport"]').attr('content','width=640,initial-scale='+ rate +',maximum-scale='+ rate +',minimum-scale='+ rate +',user-scalable=no,target-densitydpi=device-dpi');
	}
})(jQuery, document);

//ajaxgo
(function($, document, undefined){
	/**
     * 兼容本地demo的ajax方法
     * @method ajaxgo
     * @since p56
     * @param {string} url 请求链接
     * @param {function} [fn] 方法
     * @param {number|string|object} [demo] 测试数据
     * @param {object} [data] 数据
     * @param {string} [method=post] 请求方式
     * @param {string} [datatype=json] 返回数据的格式
     * @return {none}
     */
    window.ajaxgo = function(_url, fn, demo, _data, _method, _datatype, _crossDomain, _err){
        fn = fn || Fn;
		var	_err = _err || function(){},
			_dataType = _dataType || 'json',
			_crossDomain = (_crossDomain === true?true:false);
        _url == 'javascript:;' ? fn(demo) : $.ajax({
			url : _url,
			success : fn,
			data : _data,
			type : _method,
			dataType : _dataType,
			error : _err,
			crossDomain : _crossDomain
		});
    };
})(jQuery, document);

/**
 * cookie读/写
 * @method $.cookie
 * @since 1.0.0
 * @param {string} name 名称
 * @param {string} [value] 值
 * @param {number} [expires] 有效期, 单位: 天
 * @param {string} [path] 服务器路径
 * @param {string} [domain] 域名
 * @param {bool} [secure] https安全传输
 * @return {string|none}
 * @example $.cookie(name, value, expires, path, domain, secure);
 */
 (function($, document, undefined){
	$.cookie = function(name, value, expires, path, domain, secure){
		var arr, cookie,
			d = new Date();

		if(value === undefined){
			arr = document.cookie.match(new RegExp('(^| )' + name + '=([^;]*)(;|$)'));
			return arr ? unescape(arr[2]) : '';
		}else{
			cookie = name + '=' + escape(value);
			cookie += expires ? ';expires=' + d.toGMTString(d.setDate(d.getDate() + expires)) : '';
			cookie += path ? ';path=' + path : '';
			cookie += domain ? ';domain=' + domain : '';
			cookie += secure ? ';secure' : '';
			document.cookie = cookie;
		}
	};
})(jQuery, document);

//公用结构加载
(function($, document, undefined){
	$.foot = function(){
		var	_foot = '<div class="k-footer">'+
						'<div class="icons">'+
							'<a href="https://m.diankego.com"><img class="logo2" src="./images/k-dg-footerLogo2.png" /></a>'+
							'<img class="logo1" src="./images/k-dg-footerLogo.png" />'+
							'<div class="border"></div>'+
						'</div>'+
						'<div class="phone">'+
							'<a href="tel:07715313896">'+
								'<img src="./images/k-dg-phone.png" />'+
							'</a>'+
						'</div>'+
						'<div class="txtBox">'+
							'<p>Copyright © 2007-2014 广西电科版权所有</p>'+
							'<p>桂B2-20130019 | 桂ICP备14007476号</p>'+
						'</div>'+
					'</div>';
		$('body').append(_foot);
	};
	$.returnTop = function(){
		var	_top = '<a href="javascript:;" class="k_returnTop J_k_returnTop">'+
						'<div class="bg"></div>'+
						'<div class="txt"><i></i>顶部</div>'+
					'</a>';
		$('body').append(_top);
	}
})(jQuery, document);

//触摸事件
(function($, document, undefined){
	var $doc	= $(document),
		Fn		= function(){},
		touch	= function(target, start, move, end){
			this.$target = $(target);
			this.start = start || Fn;
			this.move = move || Fn;
			this.end = end || Fn;
			this.init();
		}
	touch.prototype = {
		init: function(){
			var _this = this;
			this.$target.on('touchstart', function(e){
				var __this	= this,
					e		= e.originalEvent,
					touche = e.touches[0],
					startX	= touche.pageX,
					startY	= touche.pageY,
					offsetX	= 0,
					offsetY	= 0;
				$doc.on('touchmove', function(e){
					var e		= e.originalEvent,
						touche	= e.touches[0];
					offsetX = touche.pageX - startX;
					offsetY = touche.pageY - startY;
					return _this.move.call(__this, e, offsetX, offsetY);
				}).on('touchend touchcancel', function(e){
					var isClick = !offsetX && !offsetY;
					$(this).off('touchmove touchend touchcancel');
					return _this.end.call(__this, offsetX, offsetY, isClick, e);
				});
				return _this.start.call(__this, e, startX, startY);
			});
		},
	};
	$.fn.xtouch = function(end, move, start){
		return this.each(function(){
			new touch(this, start, move, end);
		});
	};
	$.fn.mclick = function(fn){
		return this.xtouch(function(x, y, isClick, e){
			isClick && (fn || Fn).call(this, e) === false && e.preventDefault();
		});
	}
})(jQuery, document);

//翻转手机触发重新初始化
(function($, document, undefined){
	$(window).bind('orientationchange',function(e){
		setTimeout(function(){
			$.init();
		},300)
	});
})(jQuery, document);

//轮播图交互
(function($, document, undefined){
	$.lun = function(bool,_shadow){
		if(!$('.J-k-lun').length)return false;
		var	$box	=	$('.J-k-lun'),
			$ul		=	$box.find('ul.ad'),
			$li		=	$ul.find('li'),
			$btn	=	null,
			_bool	=	(bool == undefined?true:bool),
			winH	=	0,
			runX	=	0,
			center	=	0,
			s		=	0,
			_index	=	0,
			shadow	=	(_shadow == undefined? 0.2 : _shadow),//留白系数
			timeBox,_run,timer,_html;
		($._loadLun = function(){
			winH = $(window).width();
			$li.width(winH);
			$ul.width($li.length*$li.width()).css({'transform': 'translate3d(0, 0, 0)','transition-duration':'0.3s'});
			center = +$li.width()*25/100;
		})();

		(_html = function(){
			var	_html = '<ul class="index">';
			for(var i=0,max=$li.length; i<max; i++){
				_html += '<li'+ (i==0?' class="active"':'') +'></li>';
			}
			_html += '</ul>';
			$box.append(_html);
			$btn	=	$box.find('ul.index li');
		})();

		//计时函数
		if(_bool){
			(timeBox = function(){
				timer	=	setTimeout(function(){
					_index>=$li.length-1?_index=0:_index++;
					_run(_index);
				},3000);
			})();
		}

		//运动函数
		_run = function(index){
			s	=	-_index*$li.width();
			$ul.css('transition-duration','0.3s');
			$ul.css('transform','translate3d('+ s +'px, 0, 0)');
			$btn.eq(index).addClass('active').siblings().removeClass('active');
			_bool && timeBox();
		};

		$('[data-name="touch"]').xtouch(function(x, y, isClick){
			if(!isClick){
				if(runX<0 && Math.abs(runX)>center){
					_index>=$li.length-1?_index=$li.length-1:_index++;
				}else if(runX>0 && runX>center){
					_index<=0?_index=0:_index--;
				}
				_run(_index);
			}
		}, function(e, x, y){
			s	=	-_index*$li.width()+x;
			runX = x;
			if(_index <= 0 && x>0){
				s > winH*shadow? s = winH*shadow :'';
			}else if(_index >= $li.length-1 && x<0){
				s < -_index*$li.width()-winH*shadow? s = -_index*$li.width()-winH*shadow : '';
			};
			$ul.css('transform','translate3d('+ s +'px, 0, 0)');
			if(!(Math.abs(y) > 20 && Math.abs(x) < 20)){
				e.preventDefault();//修复安卓微信对touchmove表现不佳的问题
			}
		},function(e, x, y){
			clearTimeout(timer);
			$ul.css('transition-duration','0s');
		});

		$(window).bind('orientationchange',function(e){
			setTimeout(function(){
				$._loadLun();
			},300)
		});
	};
})(jQuery, document);

//主页交互
(function($, document, undefined){
	if(!$('.J-k-homePage').length)return false;
	var	lazyLoad,
		on	=	0,
		firLoad = 0,
		_page	= 0,
		lazyOff = 0;

	//主页html加载
	(function(){
		$.homePage = function(fn){
			var	fn	=	fn || function(){},
				_homePage = '<div class="k-searchBanner" data-name="searchBanner">'+
								'<a class="icon" href="/search.html"><img src="./images/k-dg-logo.png"/></a>'+
								'<a href="/search.html" class="inputBox">'+
									'<div class="goSearch">搜索商品/店铺</div>'+
									'<i></i>'+
								'</a>'+
							'</div>';
			_homePage += '<div class="k-homePage">'+
								'<div class="lun J-k-lun" data-name="touch">'+
									'<ul class="ad">';
				window.ajaxgo(api+'/home',function(d){
					if(+d.status){
						for(var i=0,max=d.data.lun.length; i<max; i++){
							var	data1	=	d.data.lun[i];
							_homePage += '<li><a href="'+ (data1.Url?data1.Url:'javascript:;') +'"><img src="'+ data1.Thumbnails +'" /></a></li>';
						}
						_homePage +=		'</ul>'+
										'</div>'+
										'<ul class="iconPage">'+
											'<li>'+
												'<a href="/search.html?type=0&key=""">'+
													'<img src="./images/k-dg-pageIcon1.png" />'+
													'<p>商品</p>'+
												'</a>'+
											'</li>'+
											'<li>'+
												'<a href="/search.html?type=1&key=""">'+
													'<img src="./images/k-dg-pageIcon2.png" />'+
													'<p>店铺</p>'+
												'</a>'+
											'</li>'+
											'<li>'+
												'<a href="/activities.html">'+//活动列表页href
													'<img src="./images/k-dg-pageIcon3.png" />'+
													'<p>活动</p>'+
												'</a>'+
											'</li>'+
											'<li>'+
												'<a href="/map.html">'+//地图页href
													'<img src="./images/k-dg-pageIcon4.png" />'+
													'<p>地图</p>'+
												'</a>'+
											'</li>'+
										'</ul>'+
									'</div>';
						if(d.data.starShop.length){
							_homePage +='<div class="k-startShop">'+
											'<div class="title auto">'+
												'<a class="fr" href="/search.html?type=1"><span>更多</span></a>'+
												'五星店铺'+
											'</div>'+
											'<ul class="shopList">';
							for(var j=0,max=d.data.starShop.length; j<max; j++){
								var data2 = d.data.starShop[j];
								_homePage += '<li><a href="'+ ('/store.html?id='+data2.Store.Id) +'" class="auto">'+
												'<img src="./images/zwt_180_180.jpg" data-src="'+ (data2.Store.Logo.length?data2.Store.Logo:'./images/k-shop-normal.jpg') +'" width="180" height="180" class="fl" />'+
												'<div class="auto txtBox">'+
													'<div class="name">'+ data2.Store.Name +'</div>'+
													'<div class="place">' + data2.Store.Sfid + 'F_' + data2.Store.Snname + '</div>'+
													'<div class="main">主营：'+ data2.Store.Brands +'</div>'+
												'</div>'+
											  '</a></li>';
							}
							_homePage +=	'</ul></div>';
						};
						if(d.data.hotGoods.length){
							_homePage +=	'<div class="k-hotGoods">'+
												'<div class="title"><del>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</del>热门商品<del>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</del></div>'+
												'<ul class="goodsList" data-name="goodsList">';
							for(var k=0,max=d.data.hotGoods.length; k<max; k++){
								var	data3 = d.data.hotGoods[k];
								_homePage += '<li>'+
											'<a href="'+ ('/product.html?id='+data3.Product.Id) +'" class="auto">'+
												'<img src="./images/zwt_180_180.jpg" data-src="'+ data3.Product.Thumb +'" width="180" height="180" class="fl" />'+
												'<div class="auto txtBox">'+
													'<div class="name">'+ data3.Product.Name +'</div>'+
													'<div class="deputy">'+ data3.Product.Store.Name +'</div>'+
													'<div class="price auto"><div class="fr">'+ data3.Product.Store.Sfid+ 'F_' +data3.Product.Store.Snname.split(",")[0] +'</div>'+ (+data3.Product.Price != 0?'参考价：<span>￥'+data3.Product.Price/100+'</span>':'到店询价') +'</div>'+
												'</div>'+
											'</a>'+
										'</li>';
							}
							if(k >= 30){
								_homePage += '</ul><div class="lazyLoad J-k-lazyLoad">点击加载更多</div></div>';
							}
						}
						$('body').prepend(_homePage);
						$.returnTop();
						fn();
					}
				},{'status':'1','message':'XXX','data':{'lun':[{'href':'javascript:;','src':'./images/k-dg-footerLogo.png'},{'href':'javascript:;','src':'./images/k-dg-footerLogo.png'},{'href':'javascript:;','src':'./images/k-dg-footerLogo.png'},{'href':'javascript:;','src':'./images/k-dg-footerLogo.png'}],'starShop':[{'src':'./images/k-dg-footerLogo.png','name':'八嘎八嘎','place':'1F_A102、A102、A102、A102','main':'Lenovo、华硕、thinkpad、小米，苹果、三星'},{'src':'./images/k-dg-footerLogo.png','name':'八嘎八嘎','place':'1F_A102、A102、A102、A102','main':'Lenovo、华硕、thinkpad、小米，苹果、三星'}],'hotGoods':[{'href':'javascript:;','src':'./images/k-dg-footerLogo.png','name':'八嘎八嘎','fu':'八嘎八嘎八嘎八嘎','place':'1F_A102','price':'233'},{'href':'javascript:;','src':'./images/k-dg-footerLogo.png','name':'八嘎八嘎','fu':'八嘎八嘎八嘎八嘎','place':'1F_A102','price':'233'}]}},{},'get','json',true,function(){
					$('body').append(api);
				});
		};
	})();

	//动态商品加载
	$(document).on('click','.J-k-lazyLoad',function(){
		if(on)return false;
		var	$this	=	$(this),
			out,
			i;
		$this.html('正在努力加载<span></span>');
		out = function(){
			var	_html = '';
			if(i<6){
				i++;
				for(var	j=0; j<i; j++){
					_html += '.';
				}
			}else{
				i=0;
				_html = '';
			};
			$this.find('span').html(_html);
			setTimeout(out,500);
		};
		out();
		on = 1;
		lazyLoad();
	}).on('scroll',function(){
		var	$banner	=	$('[data-name="searchBanner"]');
		if(firLoad == 1 && $('.k-footer').length && (+$('.k-footer').offset().top-$(window).height())<= $(window).scrollTop()){
			lazyLoad();
		}
	});

	lazyLoad = function(){
		if(lazyOff)return false;
		lazyOff = 1;
		_page++;
		window.ajaxgo(api+'/home',function(d){
			var	_html = '';
			if(+d.status){
				if(!d.data.hotGoods.length)return false;
				for(var i=0,max=d.data.hotGoods.length; i<max; i++){
					var	data = d.data.hotGoods[i];
					_html += '<li>'+
								'<a href="'+ ('/product.html?id='+data.Product.Id) +'" class="auto">'+
									'<img src="./images/zwt_180_180.jpg" data-src="'+ data.Product.Thumb +'" width="180" height="180" class="fl" />'+
									'<div class="auto txtBox">'+
										'<div class="name">'+ data.Product.Name +'</div>'+
										'<div class="deputy">'+ data.Product.Store.Name +'</div>'+
										'<div class="price auto"><div class="fr">'+ data.Product.Price +'</div>'+ (+data.Product.Price != 0?'参考价：<span>￥'+data.Product.Price/100+'</span>':'到店询价') +'</div>'+
									'</div>'+
								'</a>'+
							'</li>';
				};
				firLoad = 1;
				$('[data-name="goodsList"]').append(_html);
				lazyOff = 0;
				window.kPreLoad();
				if($('.J-k-lazyLoad').length)$('.J-k-lazyLoad').remove();
			}
		},{'status':'1','message':'XXX','data':[{'name':'八嘎八嘎你是大八嘎','fu':'八嘎八嘎你是八嘎','price':'666','place':'1F_A102','src':'./images/k-dg-footerLogo.png','href':'javascript:;'},{'name':'八嘎八嘎你是大八嘎','fu':'八嘎八嘎你是八嘎','price':'到店询价','place':'1F_A102','src':'./images/k-dg-footerLogo.png','href':'javascript:;'}]},{'page':_page},'get');
	}
})(jQuery, document);

//懒加载
(function($, document, undefined){
	var kPreLoad;
	(kPreLoad = function(){
		$image	=	$('img[data-src]');
		for(var	i=0; i<$image.length; i++){
			var	$img	=	$image.eq(i);
			if($img.offset().top<$(window).scrollTop()+$(window).height() && $img.offset().top + $img.parent().height() >$(window).scrollTop()){
				$img.attr('src',$img.attr('data-src')).removeAttr('data-src');
			}
		}
	})();
	window.kPreLoad	=	kPreLoad;
	$(window).scroll(kPreLoad);
})(jQuery, document);

//获取网址json
(function($, document, undefined){
	$.urlJson = function(){
		var	url		= location.search,
			json	= {};
		if(url.indexOf("?") != -1){
			var	arr	=	url.substr(1).split('&');
			for(var i=0,max=arr.length; i<max; i++){
				json[arr[i].split('=')[0]] = decodeURI(arr[i].split('=')[1]);
			};
		};
		return json;
	}
})(jQuery, document);

//搜索页交互
(function($, document, undefined){
	if(!$('.J-k-search').length)return false;
	var	hasTxt,searchType,pullCookic,writeCookie,lazyLoad,lazyLoadShop,closeTan,searchHeight,
		_type	= 0,
		_key	= '',
		_floor	= 0,
		_page	= 0,
		urlJson = $.urlJson(),
		on	=	0,
		firLoad = 0,
		clickArrow = 0,
		searchList	= 0,
		lazyOff	= 0;

	//搜索页结构加载
	(function(){
		$.sarchPage = function(){
			var	_search,
				_floor,
				_goodsList,
				_shopList,
				_initsearch,
				_empty,
				lastInit,
				_headErr;

			//搜索公用头部HTML拼接
			_headErr = function(d,fn){
				var fn	=	fn || function(){},
					_html = '<form class="k-searchBanner2'+ (urlJson.type == undefined?'':' fixed') +'" data-name="k-goSearch">'+
								'<div class="inputBox auto">'+
									'<button type="submit" class="search fr J-k-goSearch">搜索</button>'+
									'<a href="javascript:history.go(-1);" class="back fl"><img src="./images/k-dg-search-arrow.png" /></a>'+
									'<div class="auto searchBox">'+
										'<div class="checkout">'+
											'<a href="javascript:;" data-name="searchType">'+
												'<span style="display:none;">商品</span>'+
												'<span style="display:none;">店铺</span>'+
											'</a>'+
											'<i></i>'+
											'<input type="hidden" data-type="search" value="'+ (urlJson.type == undefined?'0':urlJson.type) +'" />'+
										'</div>'+
										'<input type="text" data-name="keyWord" value="'+ (urlJson.key == undefined?'':urlJson.key) +'" placeholder="'+ (d == ''?"":d.data[0].Name) +'" />'+
										'<a href="javascript:;" class="del" data-name="delKey" style="display:none;"></a>'+
									'</div>'+
								'</div>'+
							'</form>';
				$('body').prepend(_html);
				_type	=	$('[data-type="search"]').val();
				fn();
			};

			//搜索页公用头部
			_search = function(fn){
				var	fn	=	fn || function(){};
				window.ajaxgo(api+'/seekhot',function(d){
					if(+d.status){
						_headErr(d,fn);
					}
				},{},{},'get','json','',function(){
					_headErr('',fn);
				});
			};

			//楼层
			_floor = function(){
				var	_html = '<div class="k-floor">'+
								'<a href="javascript:;" style="display:block;" class="title" data-name="k-floor"><span>楼层</span><i></i></a>'+
								'<ul data-name="k-floorList">'+
									'<li><a href="/search.html?key='+ urlJson.key +'&type='+ urlJson.type +'"><span>全部</span></a></li>'+
									'<li><a href="/search.html?key='+ urlJson.key +'&type='+ urlJson.type +'&floor=1"><span>1F</span>品牌形象馆、科技体验店</a></li>'+
									'<li><a href="/search.html?key='+ urlJson.key +'&type='+ urlJson.type +'&floor=2"><span>2F</span>时尚电子、数字生活馆</a></li>'+
									'<li><a href="/search.html?key='+ urlJson.key +'&type='+ urlJson.type +'&floor=3"><span>3F</span>电脑、数码、办公设备、车载产品</a></li>'+
									'<li><a href="/search.html?key='+ urlJson.key +'&type='+ urlJson.type +'&floor=4"><span>4F</span>DIY乐园、安防系统、教育设备</a></li>'+
									'<li><a href="/search.html?key='+ urlJson.key +'&type='+ urlJson.type +'&floor=5"><span>5F</span>网络设备、办公耗材、手机城</a></li>'+
									'<li><a href="/search.html?key='+ urlJson.key +'&type='+ urlJson.type +'&floor=6"><span>6F</span>维修城&美食城</a></li>'+
								'</ul>'+
							'</div>'+
							'<a href="javascript:;" class="k-floorBg J-k-floorBg" style="display:none;"></a>';
				$('body').append(_html);
				$('[data-name="k-floorList"] li').eq(urlJson.floor == undefined?0:urlJson.floor).addClass('active');
			};

			//搜索结果为空
			_empty = function(){
				$('body').append('<div class="k-emptyList"><img src="./images/k-dg-list-empty.png"/></div>');
			};

			//商品搜索结果页
			_goodsList = function(fn){
				var	fn	=	fn || function(){},
					_html = '<div class="k-hotGoods k-searchGoods">'+
								'<ul class="goodsList" data-name="goodsList">';
				window.ajaxgo(api+'/search',function(d){
					if(+d.status){
						if(d.data.length){
							for(var i=0,max=d.data.length; i<max; i++){
								var	data = d.data[i];
								_html += '<li>'+
											'<a href="'+ ('/product.html?id='+data.Id) +'" class="auto">'+
												'<img src="./images/zwt_180_180.jpg" data-src="'+ data.Thumb +'" width="180" height="180" class="fl" />'+
												'<div class="auto txtBox">'+
													'<div class="name">'+ data.Name +'</div>'+
													'<div class="deputy">'+ data.Store.Name +'</div>'+
													'<div class="price auto">'+
														'<div class="fr">'+ data.Store.Sfid+ 'F_' +data.Store.Snname.split(",")[0] +'</div>'+ (+data.Price != 0?'参考价：<span>￥'+data.Price/100+'</span>':'到店询价')+
													'</div>'+
												'</div>'+
											'</a>'+
										'</li>';
							}
							if(i >= 30){
								_html	+=		'</ul>'+
												'<a href="javascript:;" class="lazyLoad J-k-lazyLoad">点击加载更多</a>'+
											'</div>';
							};
							_floor();
							$('body').append(_html);
							window.kPreLoad();
							$.foot();
						}else{
							_floor();
							_empty();
							$.foot();
						}
						_search(fn);
					}
				},{'status':'1','message':'XXX','data':[{'name':'八嘎八嘎你是大八嘎','fu':'八嘎八嘎你是八嘎','price':'666','place':'1F_A102','src':'./images/k-dg-footerLogo.png','href':'javascript:;'},{'name':'八嘎八嘎你是大八嘎','fu':'八嘎八嘎你是八嘎','price':'到店询价','place':'1F_A102','src':'./images/k-dg-footerLogo.png','href':'javascript:;'}]},{'type':urlJson.type,'key':urlJson.key,'floor':urlJson.floor},'get');
			};

			//店铺搜索结果页
			_shopList = function(fn){
				var	fn	=	fn || function(){},
					_html = '<div class="k-startShop k-searchShop">'+
								'<ul class="shopList" data-name="goodsList">';
				window.ajaxgo(api+'/search',function(d){
					if(+d.status){
						if(d.data.length){
							for(var i=0,max=d.data.length; i<max; i++){
								var	data = d.data[i];
								_html += '<li><a href="'+ ('/store.html?id='+data.Id) +'" class="auto">'+
												'<img src="./images/zwt_180_180.jpg" data-src="'+ (data.Logo?data.Logo:'./images/k-shop-normal.jpg') +'" width="180" height="180" class="fl" />'+
												'<div class="auto txtBox">'+
													'<div class="name">'+ data.Name +'</div>'+
													'<div class="place">' + data.Sfid + 'F_' + data.Snname + '</div>'+
													'<div class="main">主营：'+ data.Brands +'</div>'+
												'</div>'+
											  '</a></li>';
							}
							if(i >= 30){
								_html	+=		'</ul>'+
												'<a href="javascript:;" class="lazyLoad J-k-lazyLoad" data-type="shop">点击加载更多</a>'+
											'</div>';
							}
							_floor();
							$('body').append(_html);
							window.kPreLoad();
							$.foot();
						}else{
							_floor();
							_empty();
							$.foot();
						}
						_search(fn);
					}
				},{'status':'1','message':'XXX','data':[/*{'name':'八嘎八嘎你是大八嘎','main':'Lenovo、华硕、thinkpad、小米，苹果、三星','price':'666','place':'1F_A102','src':'./images/k-dg-footerLogo.png','href':'javascript:;'},{'name':'八嘎八嘎你是大八嘎','main':'Lenovo、华硕、thinkpad、小米，苹果、三星','price':'666','place':'1F_A102','src':'./images/k-dg-footerLogo.png','href':'javascript:;'}*/]},{'type':urlJson.type,'key':urlJson.key,'floor':urlJson.floor},'get');
			};

			//搜索页起始页
			_initsearch = function(fn){
				var	fn	=	fn || function(){},
					_html = '<div class="k-hotSearch J-k-hotSearch">'+
								'<div class="title">热门搜索</div>'+
								'<ul class="auto">';
				window.ajaxgo(api+'/seekhot',function(d){
					if(+d.status){
						for(var i=1,max=d.data.length; i<max; i++){
							var	data = d.data[i];
							_html += '<li><a href="javascript:;">'+ data.Name +'</a></li>';
						}
						_html	+=		'</ul>'+
									'</div>'+
									'<div class="k-history J-k-history" style="display:none;">'+
										'<div class="title">搜索历史</div>'+
										'<ul class="auto" data-name="historyList">'+
										'</ul>'+
									'</div>';
						_search(fn);
						$('body').append(_html);
					}
				},{'status':'1','message':'XXX','data':['八嘎1号','八嘎2号','八嘎3号','八嘎4号','八嘎5号']},{},'get');
			};

			lastInit = function (){
				hasTxt();
				searchType();
				pullCookic();
				searchHeight();
			};

			if(urlJson.type == undefined){
				_initsearch(lastInit);
			}else if(urlJson.type == '0'){
				_goodsList(lastInit);
			}else if(urlJson.type == '1'){
				_shopList(lastInit);
			}
		};
	})();

	//页面加载判断页面高度以计算楼层弹窗高度
	(searchHeight = function(){
		var	$li	=	$('[data-name="k-floorList"] li');
		if(+$(window).height() <= 498){
			searchList = +$(window).height()-171;
		}else{
			searchList = $li.outerHeight()*$li.length;
		};
		if($li.parent().attr('data-status') == "on"){
			closeTan(true);
			closeTan(false);
		}
	})();

	//手机翻转从新计算弹窗高度
	$(window).bind('orientationchange',function(e){
		setTimeout(function(){
			searchHeight();
		},300)
	});

	$(document).on('submit','[data-name="k-goSearch"]',function(){//搜索写入cookie
		var	$input	=	$('[data-name="keyWord"]');
		if(!$input.val().length){
			$input.val($input.attr('placeholder'));
		}
		writeCookie($('[data-name="keyWord"]').val());
		return false;
	}).on('input','[data-name="keyWord"]',function(){//输入判断
		hasTxt();
	}).on('click','[data-name="delKey"]',function(){//删除输入
		$(this).prev().val('').focus();
	}).on('click','[data-name="searchType"]',function(){//切换搜索类型
		var	$this	=	$(this),
			$val	=	$this.siblings('input[type="hidden"]'),
			val		=	+$val.val();
		val >= ($this.find('span').length-1)? val=0 : val++;
		_type = val;
		$val.val(val);
		searchType();
	}).on('click','.J-k-hotSearch a, .J-k-history a',function(){
		writeCookie($(this).text());
	}).on('click','[data-name="k-floor"]',function(){
		var	$this	=	$(this),
			$list	=	$('[data-name="k-floorList"]');
		if(clickArrow%2 == 0){
			closeTan(false);
		}else{
			closeTan(true);
		}
		clickArrow++;
	}).on('click','.J-k-floorBg',function(){
		clickArrow++;
		closeTan(true);
	}).on('click','[data-name="k-floorList"] li',function(){
		$(this).addClass('active').siblings().removeClass('active');
		clickArrow++;
		closeTan(true);
	}).on('webkitTransitionEnd','[data-name="k-floorList"]',function(){
		if(clickArrow%2 == 0){
			$('.J-k-floorBg').hide();
		}
	});

	//关闭弹窗
	closeTan = function(bool){
		var	$list	=	$('[data-name="k-floorList"]'),
			$title	=	$('[data-name="k-floor"]'),
			$bg		=	$('.J-k-floorBg'),
			$body	=	$('body');
		if(bool){//关闭
			$title.find('i').removeClass('active');
			$list.css({'transition':'all 0.4s','height':'0'}).attr('data-status','off');
			$body.css('overflow-y','auto');
		}else{//打开
			$title.find('i').addClass('active');
			$list.css({'transition':'all 0.4s','height':searchList}).attr('data-status','on');
			$bg.show();
			$body.css('overflow-y','hidden');
		}
	};

	//加载判断搜索是否有值
	hasTxt = function(){
		var	$key	=	$('[data-name="keyWord"]');
		$key.next()[$key.val().length?'show':'hide']();
	};

	//加载判断默认搜索类型
	searchType = function(){
		var	$type	=	$('[data-name="searchType"]'),
			val		=	$type.siblings('input[type="hidden"]');
		$type.find('span').eq(+val.val()).show().siblings().hide();
	};

	//cookie写入方法
	writeCookie = function(_val){
		var	_history	=	[],
			_href		=	'',
			arr			=	[],
			json		=	{};
		if(_val.replace(/\s/g,'').length){
			if(!$.cookie('historyKey').length){
				$.cookie('historyKey',_val);
			}else{
				_history = $.cookie('historyKey').split(',');
				_history.unshift(_val);
				for(var	i=0,max=_history.length-1; i<=max; i++){
					if(!json[_history[i]] && _history[i] != ""){
						arr.push(_history[i]);
						json[_history[i]] = 1;
					}
				}
				$.cookie('historyKey',arr);
			};
		}
		_key = _val;
		_href = location.href.substring(0,location.href.indexOf("?"));
		location.href = _href + "?key="+ _key +"&type=" + _type/*+"&floor="+(urlJson.floor == undefined?0:urlJson.floor)*/;
	};

	//刷新页面加载cookie
	pullCookic = function(){
		var	data = $.cookie('historyKey').split(',');
		if(data != ''){
			var	_html = '';
			data.length > 10 ? data = data.slice(0,10) : '';
			for(var i=0,max=data.length-1; i<=max; i++){
				_html += '<li><a href="javascript:;">'+ data[i] +'</a></li>';
			}
			$('[data-name="historyList"]').empty().append(_html).parents('.k-history').show();
			$.cookie('historyKey',data);
		}else{
			$('[data-name="historyList"]').parents('.k-history').remove();
		}
	};

	//动态商品加载
	$(document).on('click','.J-k-lazyLoad',function(){
		if(on)return false;
		var	$this	=	$(this),
			out,
			i;
		$this.html('正在努力加载<span></span>');
		out = function(){
			var	_html = '';
			if(i<6){
				i++;
				for(var	j=0; j<i; j++){
					_html += '.';
				}
			}else{
				i=0;
				_html = '';
			};
			$this.find('span').html(_html);
			setTimeout(out,500);
		};
		out();
		on = 1;
		if(+urlJson.type == 1){
			lazyLoadShop();
		}else if(+urlJson.type == 0){
			lazyLoad();
		}
	}).on('scroll',function(){
		if(firLoad == 1 && $('.k-footer').length && (+$('.k-footer').offset().top-$(window).height())<= $(window).scrollTop()){
			if(+urlJson.type == 1){
				lazyLoadShop();
			}else if(+urlJson.type == 0){
				lazyLoad();
			}
		}
	});

	//动态加载商品
	lazyLoad = function(){
		if(lazyOff)return false;
		lazyOff = 1;
		_page++;
		window.ajaxgo(api+'/search',function(d){
			var	_html = '';
			if(+d.status){
				if(!d.data.length)return false;
				for(var i=0,max=d.data.length; i<max; i++){
					var	data = d.data[i];
					_html += '<li>'+
								'<a href="'+ ('/product.html?id='+data.Id) +'" class="auto">'+
									'<img src="./images/zwt_180_180.jpg" data-src="'+ data.Thumb +'" width="180" height="180" class="fl" />'+
									'<div class="auto txtBox">'+
										'<div class="name">'+ data.Name +'</div>'+
										'<div class="deputy">'+ data.Store.Name +'</div>'+
										'<div class="price auto"><div class="fr">'+ data.Store.Sfid+ 'F_' +data.Store.Snname.split(",")[0] +'</div>'+ (+data.Price != 0?'参考价：<span>￥'+data.Price/100+'</span>':'到店询价') +'</div>'+
									'</div>'+
								'</a>'+
							'</li>';
				};
				firLoad = 1;
				$('[data-name="goodsList"]').append(_html);
				lazyOff = 0;
				window.kPreLoad();
				if($('.J-k-lazyLoad').length)$('.J-k-lazyLoad').remove();
			}
		},{'status':'1','message':'XXX','data':[{'name':'八嘎八嘎你是大八嘎','fu':'八嘎八嘎你是八嘎','price':'666','place':'1F_A102','src':'./images/k-dg-footerLogo.png','href':'javascript:;'},{'name':'八嘎八嘎你是大八嘎','fu':'八嘎八嘎你是八嘎','price':'到店询价','place':'1F_A102','src':'./images/k-dg-footerLogo.png','href':'javascript:;'}]},{'key':urlJson.key,'type':'0','page':_page},'get');
	};

	//动态加载店铺
	lazyLoadShop = function(){
		if(lazyOff)return false;
		lazyOff = 1;
		_page++;
		window.ajaxgo(api+'/search',function(d){
			var	_html = '';
			if(+d.status){
				if(!d.data.length)return false;
				for(var i=0,max=d.data.length; i<max; i++){
					var	data = d.data[i];
					_html += '<li><a href="'+ ('/store.html?id='+data.Id) +'" class="auto">'+
									'<img src="./images/zwt_180_180.jpg" data-src="'+ data.Logo +'" width="180" height="180" class="fl" />'+
									'<div class="auto txtBox">'+
										'<div class="name">'+ data.Name +'</div>'+
										'<div class="place">' + data.Sfid + 'F_' + data.Snname + '</div>'+
										'<div class="main">主营：'+ data.Brands +'</div>'+
									'</div>'+
								  '</a></li>';
				};
				firLoad = 1;
				$('[data-name="goodsList"]').append(_html);
				lazyOff = 0;
				window.kPreLoad();
				if($('.J-k-lazyLoad').length)$('.J-k-lazyLoad').remove();
			}
		},{'status':'1','message':'XXX','data':[{'name':'八嘎八嘎你是大八嘎','main':'Lenovo、华硕、thinkpad、小米，苹果、三星','price':'666','place':'1F_A102','src':'./images/k-dg-footerLogo.png','href':'javascript:;'},{'name':'八嘎八嘎你是大八嘎','main':'Lenovo、华硕、thinkpad、小米，苹果、三星','price':'666','place':'1F_A102','src':'./images/k-dg-footerLogo.png','href':'javascript:;'}]},{'key':urlJson.key,'type':'1','page':_page},'get');
	};
})(jQuery, document);

//回到顶部
(function($, document, undefined){
	//滑动出现返回顶部
	var	scrollFn	=	null,
		timer,timer2;
	$(document).on("scroll",function(){
		var	scroll = $(document).scrollTop();
		//!$('.J_k_returnTop').hasClass('active') && $('.J_k_returnTop').css('display','block').addClass('active');
		clearTimeout(timer);
		$('.J_k_returnTop').show().stop(true).animate({'opacity':'1'});
		timer = setTimeout(function(){
			clearTimeout(timer2);
			if(scroll == $(document).scrollTop()){
				timer2 = setTimeout(function(){
					$('.J_k_returnTop').stop(true).animate({'opacity':'0'},function(){
						$(this).hide();
					});
				},3000)
			}
		},300);
	});
	/*$('.ios_fixed').on("scroll",function(){
		clearTimeout(scrollFn);
		$('.J-j-top').stop(true).animate({opacity:'1'},300,function(){
			scrollFn = setTimeout(function(){
				$('.J-j-top').stop().animate({opacity:'0'},300);
			},3000);
		});
	});*/

	$(document).on('click','.J_k_returnTop',function(){
		/*$('html,body,.ios_fixed')*/$('html,body').animate({'scrollTop':'0'});
		return false;
	});

})(jQuery, document);

//xiewulong
var apiX				= '/api/',
	defaultStoreLogo	= '/images/x-store-header-logo.jpg',
	defaultStoreThumb	= '/images/x-store-header-bg.jpg',
	priceNullWord		= '到店询价';

//顶部固定交互
(function($, window, document){
	if(!$('.J-x-topbar').length)return;
	var $topbar	= $('.J-x-topbar');
	$(window).on('scroll', function(){
		$topbar[$(this).scrollTop() ? 'addClass' : 'removeClass']('x-topbar-static');
	});
})(jQuery, window, document);

//生成缩略图路径
(function($, window, document){
	$.addThumbSuf = function(url, suf){
		var urls	= url.split('.'),
			suffix	= urls.pop();
		urls[urls.length - 1] += '_' + suf;
		urls.push(suffix);
		return urls.join('.');
	};
})(jQuery, window, document);

//活动列表页
(function($, window, document, undefined){
	var $win		= $(window),
		$doc		= $(document),
		activities	= function($activities){
			this.$activities = $activities;
			this.$ul = $activities.find('ul');
			this.$more = $activities.find('.x-list-more');
			this.$null = $activities.find('img.null');
			this.init();
		};
	activities.prototype = {
		init: function(){
			this.getData();
			$.foot();
			this.setEvents();
		},
		getData: function(){
			var _this = this;
			if(this.tag){
				return false;
			}
			this.tag = 1;
			$.ajax({
				url: apiX + 'activity',
				data: {page: this.page},
				method: 'get',
				dataType: 'json',
				success: function(d){
					if(+ d.status){
						_this.data = d.data;
						_this.data = [];
						_this.createHtml();
					}
				}
			});
		},
		createHtml: function(){
			var i, len, activity, StartAt, EndAt,
				html	= [],
				time	= + new Date();
			for(i = 0, len = this.data.length; i < len; i++){
				activity = this.data[i];
				StartAt = new Date(activity.StartAt * 1000);
				EndAt = new Date(activity.EndAt * 1000);
				html.push('<li><a href="/activity.html?id=' + activity.Id + '"' + (time > (activity.EndAt * 1000) ? ' class="expired"' : '') + '><b><img src="' + activity.Img + '" width="180" height="180" /></b><h3>' + activity.Name + '</h3><p>活动：' + StartAt.getFullYear().toString() + '/' + (StartAt.getMonth() + 1) + '/' + StartAt.getDate() + '~' + EndAt.getFullYear().toString() + '/' + (EndAt.getMonth() + 1) + '/' + EndAt.getDate() + '</p><span>' + activity.Site + '</span></a></li>');
			}
			this.$ul.append(html.join(''));
			if(len < 20){
				this.$more.remove();
				if(!this.$ul.find('li').length){
					this.$null.show();
				}
			}else{
				this.$more.css('display', 'block');
				this.page = (this.page || 1) + 1;
				this.tag = 0;
			}
		},
		setEvents: function(){
			var _this		= this,
				h_footer	= $('.k-footer').height();
			$doc.on('click', this.$more, function(){
				if(!_this.scrollLoading){
					_this.$more.html('正在努力加载...');
					_this.getData();
					_this.scrollLoading = true;
				}
			});
			$win.on('scroll', function(){
				_this.scrollLoading && $win.scrollTop() + $win.height() > $doc.height() - h_footer && _this.getData();
			});
		}
	};
	$.fn.activities = function(){
		new activities(this);
	};
})(jQuery, window, document);

//活动详情页
(function($, window, document, undefined){
	var qs			= $.urlJson(),
		activity	= function($activity){
			this.$activity = $activity;
			this.id = qs.id;
			if(!this.id){
				this.back();
			}
			this.init();
		};
	activity.prototype = {
		init: function(){
			this.getData();
		},
		getData: function(){
			var _this = this;
			$.ajax({
				url: apiX + 'activity/' + this.id,
				method: 'get',
				dataType: 'json',
				success: function(d){
					if(+ d.status){
						_this.data = d.data;
						_this.createHtml();
					}else{
						_this.back();
					}
				},
				error: function(){
					_this.back();
				}
			});
		},
		createHtml: function(){
			var html	= [],
				StartAt	= new Date(this.data.StartAt * 1000),
				EndAt	= new Date(this.data.EndAt * 1000);
			html.push('<div class="imgs"><img src="' + this.data.AImg + '" width="100%" /></div>');
			html.push('<div class="time">活动时间：' + StartAt.getFullYear().toString() + '/' + (StartAt.getMonth() + 1) + '/' + StartAt.getDate() + '~' + EndAt.getFullYear().toString() + '/' + (EndAt.getMonth() + 1) + '/' + EndAt.getDate() + '</div>');
			html.push('<div class="address">' + this.data.Site + '</div>');
			html.push('<div class="desc"><h3>活动详情</h3><div class="rich-text">' + this.data.Content + '</div></div>');
			this.$activity.html(html.join(''));
			$.foot();
		},
		back: function(){
			window.history.back() || window.location.replace('/');
		}
	};
	$.fn.activity = function(){
		new activity(this);
	};
})(jQuery, window, document);

//店铺详情页
(function($, window, document, undefined){
	var $win	= $(window),
		$doc	= $(document),
		qs		= $.urlJson(),
		store	= function(){
			this.$header = $('.J-x-store-header');
			this.$desc = $('.J-x-store-desc');
			this.$products = $('.J-x-products');
			this.$ul = this.$products.find('ul');
			this.$more = this.$products.find('.x-list-more');
			this.id = qs.id;
			if(!this.id){
				this.back();
			}
			this.init();
		};
	store.prototype = {
		init: function(){
			this.getData();
			this.getProducts();
			$.foot();
			this.setEvents();
		},
		getData: function(){
			var _this = this;
			$.ajax({
				url: apiX + 'store/' + this.id,
				method: 'get',
				dataType: 'json',
				success: function(d){
					if(+ d.status){
						_this.data = d.data;
						_this.createHtml();
					}else{
						_this.back();
					}
				},
				error: function(){
					_this.back();
				}
			});
		},
		getProducts: function(){
			var _this = this;
			if(this.tag){
				return false;
			}
			this.tag = 1;
			$.ajax({
				url: apiX + 'product',
				data: {sid: this.id, page: this.page},
				method: 'get',
				dataType: 'json',
				success: function(d){
					if(+ d.status){
						_this.products = d.data;
						_this.createProducts();
					}
				},
			});
		},
		createHtml: function(){
			var i,
				header		= [],
				desc		= [],
				products	= [],
				unstars		= 5 - this.data.Statu;
			header.push('<div class="bg"><img src="' + (this.data.Thumbnails || window.defaultStoreThumb) + '" width="100%" /></div>');
			header.push('<div class="info"><b><img src="' + (this.data.Logo || window.defaultStoreLogo) + '" width="100%" height="100%" /></b><p>' + this.data.Name + '</p></div>');
			header.push('<div class="stars"><span class="pros">商品：' + this.data.ProCount + '</span><span>星级：</span>');
			for(i = 0; i < this.data.Statu; i++){
				header.push('<strong class="on"></strong>');
			}
			for(i = 0; i < unstars; i++){
				header.push('<strong></strong>');
			}
			header.push('</div></div>');
			desc.push('<a href="/map.html?sid=' + this.data.Id + '" class="pos">' + this.data.Sfid + 'F_' + this.data.Snname + '<b></b><i></i></a>');
			desc.push('<div class="desc"><strong>店铺主营</strong><p>' + this.data.Brands + '</p></div></div>');
			this.$header.html(header.join(''));
			this.$desc.html(desc.join(''));
		},
		createProducts: function(){
			var i, len, product,
				html = [];
			for(i = 0, len = this.products.length; i < len; i++){
				product = this.products[i];
				html.push('<li><a href="/product.html?id=' + product.Id + '"><b><img src="' + $.addThumbSuf(product.Thumb, '500_500') + '" width="100%" /></b><p>' + product.Name + '</p>' + (product.Price ? '<strong>￥' + (product.Price / 100) + '</strong>' : '<span>' + priceNullWord + '</span>') + '</a></li>');
			}
			this.$ul.append(html.join(''));
			if(len < 30){
				this.$more.remove();
			}else{
				this.$more.css('display', 'block');
				this.page = (this.page || 1) + 1;
				this.tag = 0;
			}
		},
		setEvents: function(){
			var _this		= this,
				h_footer	= $('.k-footer').height();
			$doc.on('click', this.$more, function(){
				if(!_this.scrollLoading){
					_this.$more.html('正在努力加载...');
					_this.getProducts();
					_this.scrollLoading = true;
				}
			});
			$win.on('scroll', function(){
				_this.scrollLoading && $win.scrollTop() + $win.height() > $doc.height() - h_footer && _this.getProducts();
			});
		},
		back: function(){
			window.history.back() || window.location.replace('/');
		}
	};
	$.store = function(){
		new store(this);
	};
})(jQuery, window, document);

//商品详情页
(function($, window, document, undefined){
	var qs			= $.urlJson(),
		product	= function(){
			this.$product = $('.J-x-product');
			this.$store = $('.J-x-store');
			this.$products = $('.J-x-products');
			this.id = qs.id;
			if(!this.id){
				this.back();
			}
			this.init();
		};
	product.prototype = {
		init: function(){
			this.getData();
			$.foot();
		},
		getData: function(){
			var _this = this;
			$.ajax({
				url: apiX + 'product/' + this.id,
				method: 'get',
				dataType: 'json',
				success: function(d){
					if(+ d.status){
						_this.data = d.data;
						_this.createHtml();
						$.lun(false);
					}else{
						_this.back();
					}
				},
				error: function(){
					_this.back();
				}
			});
		},
		createHtml: function(){
			var i,
				product		= [],
				store		= [],
				flen		= this.data.Thumbs.length,
				unstars		= 5 - this.data.Store.Statu;
			if(flen){
				product.push('<div class="focus J-k-lun" data-name="touch"><ul class="ad list">');
				for(i = 0; i < flen; i++){
					product.push('<li><img src="' + this.data.Thumbs[i] + '" width="500" height="500" /></li>');
				}
				product.push('</div>');
			}
			product.push('<div class="name">' + this.data.Name + '</div>');
			product.push('<div class="price">参考价：' + (this.data.Price ? '<em>￥</em><strong>' + (this.data.Price / 100).toFixed(2) + '</strong>' : priceNullWord) + '</div>');
			store.push('<div class="info"><b><img src="' + (this.data.Store.Logo || window.defaultStoreLogo) + '" width="100%" height="100%" /></b><p>' + this.data.Store.Name + '</p></div>');
			store.push('<div class="address"><a href="/store.html?id=' + this.data.Store.Id + '">去店铺</a><span>' + this.data.Store.Sfid + 'F_' + this.data.Store.Snname.split(',')[0] + '</span></div>');
			store.push('<div class="stars"><span class="pros">商品：' + this.data.Store.ProCount + '</span><span>星级：</span>');
			for(i = 0; i < this.data.Store.Statu; i++){
				store.push('<strong class="on"></strong>');
			}
			for(i = 0; i < unstars; i++){
				store.push('<strong></strong>');
			}
			store.push('</div>');
			this.$product.html(product.join(''));
			this.$store.html(store.join(''));
			this.sid = this.data.Store.Id;
			this.getProducts();
			flen && this.initFocus();
		},
		getProducts: function(sid){
			var _this = this;
			$.ajax({
				url: apiX + 'product',
				data: {sid: this.sid, num: 6, pid: this.id},
				method: 'get',
				dataType: 'json',
				success: function(d){
					if(+ d.status){
						_this.products = d.data;
						_this.createProducts();
					}
				}
			});
		},
		createProducts: function(){
			var i, len, product,
				products = [];
			products.push('<h3><span>店铺热门商品</span></h3><ul>');
			for(i = 0, len = this.products.length; i < len; i++){
				product = this.products[i];
				products.push('<li><a href="/product.html?id=' + product.Id + '"><b><img src="' + $.addThumbSuf(product.Thumb, '500_500') + '" width="100%" /></b><p>' + product.Name + '</p>' + (product.Price ? '<strong>￥' + (product.Price / 100) + '</strong>' : '<span>' + priceNullWord + '</span>') + '</a></li>');
			}
			products.push('</ul>');
			this.$products.html(products.join(''));
		},
		initFocus: function(){
			
		},
		back: function(){
			window.history.back() || window.location.replace('/');
		}
	};
	$.product = function(){
		new product(this);
	};
})(jQuery, window, document);

//地图展示页
(function($, window, document, undefined){
	var $doc	= $(document),
		qs		= $.urlJson(),
		map		= function(){
			this.$topbar = $('.J-x-topbar-static');
			this.$span = this.$topbar.find('span');
			this.$i = this.$topbar.find('i');
			this.$floors = $('.J-x-floors');
			this.$ul = this.$floors.find('ul');
			this.$lis = this.$ul.find('li');
			this.$map = $('.J-x-map');
			this.$img = this.$map.find('img');
			this.sid = qs.sid;
			this.src = '/images/x-floor-{floor}.png';
			this.ckey = 'xMap';
			this.init();
		};
	map.prototype = {
		init: function(){
			this.sid ? this.getData() : this.selectFloor();
			this.setEvents();
			!$.cookie(this.ckey) && this.guide();
		},
		getData: function(){
			var _this = this;
			$.ajax({
				url: apiX + 'store/' + this.sid,
				method: 'get',
				dataType: 'json',
				success: function(d){
					if(+ d.status){
						_this.data = d.data;
						_this.createStore();
					}else{
						_this.selectFloor();
					}
				},
				error: function(){
					_this.selectFloor();
				}
			});
		},
		createStore: function(){
			var _this = this;
			(this.$store = $('<div class="x-map-store"><a href="javascript:;" class="pack">收起</a><a href="javascript:;" class="open"><img src="' + (this.data.Logo || window.defaultStoreLogo) + '" width="92" height="92" /></a><a href="/store.html?id=' + this.data.Id + '" class="store"><b><img src="' + (this.data.Logo || window.defaultStoreLogo) + '" width="120" height="120" /></b><h3>' + this.data.Name + '</h3><p>' + this.data.Sfid + 'F_' + this.data.Snname.split(',')[0] + '</p></a></div>')).appendTo('body').on('click', '.pack', function(){
				_this.$store.addClass('x-map-store-packed');
			}).on('click', '.open', function(){
				_this.$store.removeClass('x-map-store-packed');
				_this.selectFloor(_this._floor);
			});
			this._floor = this.data.Sfid - 1;
			this.selectFloor(this._floor);
		},
		selectFloor: function(n){
			n === undefined && (n = 0);
			if(this.floor === n)return;
			if(this._floor !== undefined && this._floor !== n)this.$store.addClass('x-map-store-packed');
			this.$lis.eq(this.floor || 0).removeClass('active').end().eq(n).addClass('active');
			this.$span.html((n + 1) + 'F');
			this.floor = n;
			this.showMap();
		},
		showMap: function(){
			var $img, width, height,
				_this	= this,
				scale	= 1,
				maxX	= 0,
				maxY	= 0,
				maxS	= 2,
				offsetX	= 0,
				offsetY	= 0;
			this.tag = 1;
			this.$map.html(this.$img = $('<img src="' + this.src.replace('{floor}', this.floor) + '" />').animate({width: '100%', margin: '-50% 0 0 -50%'}, 200, function(){
				$img = $(this);
				setTimeout(function(){
					width = $img.width();
					height = $img.height();
					_this.tag = 0;
				}, 400);
			})).on('touchstart.map', function(e){
				if(_this.tag)return;
				var _disX, _disY,
					touches	= e.originalEvent.touches,
					two		= touches.length > 1,
					startX	= touches[0].pageX,
					startY	= touches[0].pageY,
					disX	= 0,
					disY	= 0;
				if(two){
					_disX = startX - touches[1].pageX;
					_disY = startY - touches[1].pageY;
				}
				$doc.on('touchmove.map', function(e){
					var touches	= e.originalEvent.touches;
					disX = offsetX + touches[0].pageX - (two ? touches[1].pageX : startX);
					disY = offsetY + touches[0].pageY - (two ? touches[1].pageY : startY);
					two && (scale = Math.max(Math.abs(touches[0].pageX - touches[1].pageX) / Math.abs(_disX), Math.abs(touches[0].pageY - touches[1].pageY) / Math.abs(_disY)) / 2);
					$img.css({'transform': 'scale3d(' + scale + ',' + scale + ',1) translate3d(' + (two ? offsetX : disX) + 'px,' + (two ? offsetY : disY) + 'px,0)'});
					e.preventDefault();
				}).on('touchend.map touchcancel.map', function(e){
					if(two){
						scale < 1 && (scale = 1);
						scale > maxS && (scale = maxS);
						maxX = (scale * width - width) / 4;
						maxY = (scale * height - height) / 4;
						Math.abs(offsetX) > maxX && (offsetX = offsetX >= 0 ? maxX : - maxX);
						Math.abs(offsetY) > maxY && (offsetY = offsetY >= 0 ? maxY : - maxY);
					}else{
						Math.abs(disX) > maxX && (disX = disX >= 0 ? maxX : - maxX);
						Math.abs(disY) > maxY && (disY = disY >= 0 ? maxY : - maxY);
						offsetX = disX;
						offsetY = disY;
					}
					$img.css({'transform': 'scale3d(' + scale + ',' + scale + ',1) translate3d(' + (two ? offsetX : disX) + 'px,' + (two ? offsetY : disY) + 'px,0)'});
					$doc.off('touchmove.map touchend.map touchcancel.map');
					e.preventDefault();
				});
				e.preventDefault();
			});
		},
		setEvents: function(){
			var _showFloors,
				_this = this;
			(_showFloors = function(){
				if(_this.$i.hasClass('active')){
					_this.$floors.show();
					_this.$ul.slideDown();
				}else{
					_hideFloors();
				}
			})();
			$doc.on('click', '.J-x-topbar-static h1 a', function(){
				_this.$i.toggleClass('active');
				_showFloors();
			}).on('click', '.J-x-floors ul li', function(){
				_this.selectFloor($(this).index());
			}).on('click', '.J-x-floors', _hideFloors);
			function _hideFloors(){
				_this.$i.removeClass('active');
				_this.$ul.slideUp(function(){
					_this.$floors.hide();
				});
			}
		},
		guide: function(){
			var _setIndex,
				_this	= this,
				_index	= 0;
			(this.$guide = $('<div class="x-map-guide"><a href="javascript:;">下一步</a></div>')).appendTo('body').on('click', 'a', function(){
				_index < 3 ? _setIndex() : _this.$guide.remove();
			});
			(_setIndex = function(){
				_this.$guide.removeClass('x-map-guide-0 x-map-guide-1').addClass('x-map-guide-' + _index);
				_index++;
				if(_index > 2){
					_this.$guide.find('a').html('我知道了');
				}
			})();
			$.cookie(this.ckey, '1')
		}
	};
	$.mapGuide = function(){
		new map();
	};
})(jQuery, window, document);

