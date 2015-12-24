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
				html.push('<li><a href="/activity.html?id=' + activity.Id + '"' + (time > (activity.EndAt * 1000) ? ' class="expired"' : '') + '><b><img src="' + activity.Img + '" width="180" height="180" /></b><h3>' + activity.Name + '</h3><p>活动时间：' + StartAt.getFullYear().toString().substring(2) + '/' + (StartAt.getMonth() + 1) + '/' + StartAt.getDate() + '~' + EndAt.getFullYear().toString().substring(2) + '/' + (EndAt.getMonth() + 1) + '/' + EndAt.getDate() + '</p><span>' + activity.Site + '</span></a></li>');
			}
			this.$ul.append(html.join(''));
			if(len < 10){
				this.$more.remove();
			}else{
				this.$more.css('display', 'block');
				this.page = (this.page || 1) + 1;
				this.tag = 0;
			}
			this.$null.remove();
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
			html.push('<div class="time">活动时间：' + StartAt.getFullYear().toString().substring(2) + '/' + (StartAt.getMonth() + 1) + '/' + StartAt.getDate() + '~' + EndAt.getFullYear().toString().substring(2) + '/' + (EndAt.getMonth() + 1) + '/' + EndAt.getDate() + '</div>');
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
