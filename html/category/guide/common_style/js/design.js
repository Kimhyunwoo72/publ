/*
 * 플러그인 선언부
 */

(function($) {
/**
 * 접근성 적용 안쪽 탭 Plug-in
 * wrapWidth : 전체 넓이
 * wrapHeight : 전체 높이
 * startIdx : 시작 Index 지정 (randomFlag가 false일때만 적용)
 * randomFlag : 시작 Index 랜덤 여부 (true, false)
 * rollingFlag : 자동롤링 여부 (true, false)
 * tabEventType : 탭 이벤트 타입 ("moueseenter", "click")
 * slideDirection : 슬라이드 방향 설정 - animate가 slide일때만 적용 ("x", "y")
 * animateType : 애니메이션 타입 설정 ("", "fade", "slide")
 * animateTime : 애니메이션 동작의 시간 설정 (1000 이하가 자연스러움)
 * intervalTime : 롤링 지연시간 (자동롤링이 true일 경우만 작동)
 * listWrapClass : 리스트 Class
 * tabClass : 탭 class
 * contClass : 콘텐츠 class
 * activeTabClass : 탭 활성화 class ("on")
 * activeContClass : 콘텐츠 활성화 class ("on")
 * tabDirection : 탭 배치 방향
 * tabXAlign : 탭 X축 정렬 위치 (left, right)
 * tabYAlign : 탭 Y축 정렬 위치 (top, bottom)
 * tabGap : 탭사이의 간격
 * tabWrapXGap : 탭 전체의 가로 시작 위치 여백 (tabXAlign이 left 일때는 좌측 여백, right 일때는 우측 여백)
 * tabWrapYGap : 탭 전체의 세로 시작 위치 여백 (tabYAlign top 일때는 상단 여백, bottom 일때는 하단 여백)
 * changeBeforeFunc : Index 변경 시작 전 작동할 Function (params : beforeIdx, afterIdx)
 * changeAfterFunc : Index 변경 완료 후 작동할 Function (params : beforeIdx, afterIdx)
 */
$.fn.ybWAInsideTabPlugin = function (options) {
	var opts = $.extend({
			wrapWidth : "",
			wrapHeight : "",
			tabWidth : "",
			tabHeight : "",
			contWidth : "",
			contHeight : "",
			startIdx : 0, // 처음 시작될 Index (randomFlag가 fasle 일때만 적용
			randomFlag : true, // 처음 시작될 Index 랜덤 여부
			rollingFlag : true, // 자동롤링 여부
			tabEventType : "mouseenter", // 탭 이벤트 타입 ("moueseenter", "click") /* 웹접근성작업/김낙운/오타수정 */
			tabLinkEnable : false, // 탭 링크 활성화여부
			slideDirection : "x", // 슬라이드 방향 설정 - animate가 slide일때만 적용 ("x", "y")
			animateType : "fade", // 애니메이션 타입 설정 ("", "fade", "slide")
			animateTime : 500, // 애니메이션 동작의 시간 설정 (1000 이하가 자연스러움)
			intervalTime : 3000, // 롤링 지연시간 (자동롤링이 true일 경우만 작동)
			listWrapClass : ">ul > li",
			tabClass : ".tab", // 탭 class
			contClass : ".cont", // 콘텐츠 class
			activeTabClass : "on", // 탭 활성화 class
			activeContClass : "on", // 콘텐츠 활성화 class
			tabDirection : "x", // 탭 배치 방향
			tabXAlign : "right", // left, right
			tabYAlign : "top", // top, bottom
			tabGap : 10, // 탭사이의 간격
			tabWrapXGap : 20, // 탭 전체의 가로 시작 위치 여백 (tabXAlign이 left 일때는 좌측 여백, right 일때는 우측 여백)
			tabWrapYGap : 20, // 탭 전체의 세로 시작 위치 여백 (tabYAlign top 일때는 상단 여백, bottom 일때는 하단 여백)
			changeBeforeFunc : null, // Index 변경 시작 전 작동할 Function (params : beforeIdx, afterIdx)
			changeAfterFunc : null // Index 변경 완료 후 작동할 Function (params : beforeIdx, afterIdx)
		}, options);
	return this.each(function () {
		var self = this,
			$self = $(this),
			wrapWidth = (opts.wrapWidth != "")?opts.wrapWidth:$self.width(),
			wrapHeight = (opts.wrapHeight != "")?opts.wrapHeight:$self.height(),
			tabWidth = opts.tabWidth,
			tabHeight = opts.tabHeight,
			contWidth = opts.contWidth,
			contHeight = opts.contHeight,
			startIdx = opts.startIdx,
			randomFlag = opts.randomFlag,
			rollingFlag = opts.rollingFlag,
			tabEventType = (opts.tabEventType == "click")?"click.ybWAInsideTabPlugin":"mouseenter.ybWAInsideTabPlugin",
			tabLinkEnable = opts.tabLinkEnable,
			slideDirection = opts.slideDirection,
			animateType = opts.animateType,
			animateTime = opts.animateTime,
			intervalTime = opts.intervalTime,
			$listWrap = $self.find(opts.listWrapClass),
			$tabs = $self.find(opts.tabClass),
			$conts = $self.find(opts.contClass),
			contClass = opts.contClass,
			activeTabClass = opts.activeTabClass,
			activeContClass = opts.activeContClass,
			tabDirection = opts.tabDirection,
			tabXAlign = opts.tabXAlign,
			tabYAlign = opts.tabYAlign,
			tabWrapXGap = opts.tabWrapXGap,
			tabWrapYGap = opts.tabWrapYGap,
			changeBeforeFunc = opts.changeBeforeFunc,
			changeAfterFunc = opts.changeAfterFunc,
			tabGap = opts.tabGap,
			tCnt = $listWrap.length,
			beforeIdx = -1,
			cIdx = -1,
			contSlidePos = [],
			rollingInterval = null,
			mouseenterFlag = false;
		
		function wrapInit() { // Wrapper 영역 초기화
			$self.width(wrapWidth).height(wrapHeight).css({position:"relative", overflow:"hidden"});
		};
		
		function tabInit() { // 탭 영역 초기화
			var i = 0, tabPos = (tabDirection == "y")?tabWrapYGap:tabWrapXGap;
			
			if (tabWidth != "")
				$tabs.width(tabWidth);
			
			if (tabHeight != "")
				$tabs.height(tabHeight);
			
			$tabs.css({display:"block", overflow:"hidden", position:"absolute", zIndex:3}).each(function (idx, entry) { $(entry).data("idx", idx); });
			
			if (tabDirection == "y") {
				$tabs.css(tabXAlign, tabWrapXGap);
				
				if (tabYAlign == "top") {
					for (i = 0; i < tCnt; i++) {
						$tabs.eq(i).css({top:tabPos});
						tabPos += $tabs.eq(i).height() + tabGap;
					}
				} else {
					for (i = tCnt - 1; i >= 0; i--) {
						$tabs.eq(i).css({bottom:tabPos});
						tabPos += $tabs.eq(i).height() + tabGap;
					}
				}
			}else {
				$tabs.css(tabYAlign, tabWrapYGap);
				
				if (tabXAlign == "left") {
					for (i = 0; i < tCnt; i++) {
						$tabs.eq(i).css({left:tabPos});
						tabPos += $tabs.eq(i).width() + tabGap;
					}
				} else {
					for (i = tCnt - 1; i >= 0; i--) {
						$tabs.eq(i).css({right:tabPos});
						tabPos += $tabs.eq(i).width() + tabGap;
					}
				}
			}
		};
		
		function contInit() { // 컨텐츠 영역 초기화
			if (contWidth != "")
				$conts.width(contWidth);
				
			if (contHeight != "")
				$conts.height(contHeight);
				
			$conts.each(function (idx, entry) { $(entry).data("idx", idx); }).css({display:"block", overflow:"hidden", position:"absolute", zIndex:0});
			
			if (animateType == "slide") {
				var i = 0;
				for (i; i < tCnt; i++) {
					contSlidePos[i] = (slideDirection == "y")?wrapHeight * i:wrapWidth * i;
					if (slideDirection == "y")
						$conts.eq(i).css({top:contSlidePos[i], left:0});
					else
						$conts.eq(i).css({top:0, left:contSlidePos[i]});
				}
			} else {
				$conts.css({top:-9999, left:-9999, opacity:0});
			}
		};
		
		function selectIdx(idx, now) { // 요소 선택 (now : 애니메이션 없이 즉시 변경 여부)
			beforeIdx = cIdx;
			
			if (changeBeforeFunc) changeBeforeFunc(beforeIdx, idx);
			
			$listWrap.removeClass(activeTabClass).eq(idx).addClass(activeTabClass)
			$tabs.removeClass(activeTabClass).eq(idx).addClass(activeTabClass);
			$conts.stop().removeClass(activeContClass);
			
			if (animateType != "slide") $conts.css({top:-9999, left:-9999, zIndex:0, opacity:0});
			
			if (animateType == "fade") {
				if (now) {
					$conts.eq(idx).css({top:0, left:0, opacity:1, zIndex:1});
				} else {
					if (cIdx >= 0 && cIdx != idx) {
						$conts.eq(cIdx).css({top:0, left:0, opacity:1, zIndex:0});
						$conts.eq(idx).css({top:0, left:0, opacity:0, zIndex:1}).animate({opacity:1}, animateTime, function () {
							$(this).addClass(activeContClass);
							
							if (changeAfterFunc) changeAfterFunc(beforeIdx, idx);
						});
					} else {
						$conts.eq(idx).css({top:0, left:0, opacity:1, zIndex:1});
					}
				}
			} else if (animateType == "slide") {
				var slideAnimateTime = 0;
				
				if (!now)
					slideAnimateTime = animateTime;
				
				if (slideDirection == "y") {
					$conts.css({left:0}).each(function (contIdx, entry) {
						$(entry).animate({top:contSlidePos[contIdx] - (idx * wrapHeight)}, slideAnimateTime, function () {
							$(this).addClass(activeContClass);
							
							if (changeAfterFunc) changeAfterFunc(beforeIdx, idx);
						});
					});
				} else {
					$conts.css({top:0}).each(function (contIdx, entry) {
						$(entry).animate({left:contSlidePos[contIdx] - (idx * wrapWidth)}, slideAnimateTime, function () {
							$(this).addClass(activeContClass);
							
							if (changeAfterFunc) changeAfterFunc(beforeIdx, idx);
						});
					});
				}
			} else {
				$conts.eq(idx).css({top:0, left:0, opacity:1, zIndex:1}).addClass(activeContClass);
			}
			cIdx = idx;
			
			tabInit(); // 탭 포지션 재계산
		};
		
		function next() { selectIdx((cIdx < tCnt - 1)?cIdx + 1:0); }; // 다음 요소 선택
		
		function rollingStart() { // 자동 롤링 시작
			clearInterval(rollingInterval);
			
			if (rollingFlag && !mouseenterFlag) {
				rollingInterval = setInterval(next, intervalTime);
				try { /* console.log(mouseenterFlag); */ } catch (e) {} 
			}
		};
		
		function rollingStop() { clearInterval(rollingInterval); }; // 자동 롤링 해제
		
		function addEvent() { // 이벤트 등록
			$self.bind({
				"mouseenter.ybWAInsideTabPlugin focusin.ybWAInsideTabPlugin" : function (evt) { mouseenterFlag = true; rollingStop(); },
				"mouseleave.ybWAInsideTabPlugin focusout.ybWAInsideTabPlugin" : function (evt) { mouseenterFlag = false; rollingStart(); },
				"rollingStart.ybWAInsideTabPlugin" : function (evt) { rollingFlag = true; rollingStart(); },
				"rollingStop.ybWAInsideTabPlugin" : function (evt) { rollingStop(); }
			});
			$tabs.bind(tabEventType, function (evt) { selectIdx($(this).data("idx")); }); // 웹접근성/김낙운/href="#id" 추가로 인한 중복인식 문제로 return false; 추가
			$tabs.bind("click.ybWAInsideTabPlugin", function (evt) {
				if (!tabLinkEnable)
					return false;
			});
			$tabs.bind("focusin.ybWAInsideTabPlugin", function (evt) { selectIdx($(this).data("idx"), true); });
			$conts.bind("focusin.ybWAInsideTabPlugin", function (evt) { selectIdx($(this).data("idx"), true); });
			$conts.find("area").bind("focusin.ybWAInsideTabPlugin", function (evt) { $(this).parents(contClass).eq(0).trigger("focusin"); }); // IE8 bugfix
		};
		
		function removeEvent() { // 이벤트 해제
			$self.unbind(".ybWAInsideTabPlugin");
			$tabs.unbind(".ybWAInsideTabPlugin");
			$conts.unbind(".ybWAInsideTabPlugin");
		};
		
		function init() { // 초기화
			removeEvent();
			rollingStop();
			
			wrapInit();
			tabInit();
			contInit();
			
			if (randomFlag) startIdx = Math.floor(Math.random() * tCnt); // Start Index Setting
			selectIdx(startIdx);
			
			addEvent();
			rollingStart();
		};
		
		init(); // 초기화 실행
	});
};

/**
 * 접근성 적용 바깥쪽 탭 Plug-in
 * startIdx : 시작 Index 지정 (randomFlag가 false일때만 적용)
 * randomFlag : 시작 Index 랜덤 여부 (true, false)
 * rollingFlag : 자동롤링 여부 (true, false)
 * eventType : 탭 이벤트 타입 ("moueseenter", "click")
 * animateType : 애니메이션 타입 설정 ("none", "fade", "slide")
 * animateTime : 애니메이션 동작의 시간 설정 (1000 이하가 자연스러움)
 * intervalTime : 롤링 지연시간 (자동롤링이 true일 경우만 작동)
 * activeTabClass : 탭 활성화 class ("on")
 * tabDirection : 탭 배치 방향
 */
$.fn.ybWAtabs = function(options){
	var opts = $.extend({
			listClass : ">ul >li",
			tabClass : ".tabs",
			tabPos: "",
			tabGap: 11,
			rPadding:0,
			contClass : ".cont",
			siblingTabClass : "",
			startIdx : 0,// 처음 시작될 Index (randomFlag가 fasle 일때만 적용
			eventType : "mouseenter", //mouseenter, click
			intervalTime : 2000,// 롤링 지연시간 (자동롤링이 true일 경우만 작동)
			animateType : "fade",//none, fade
			animateTime : 500,// 애니메이션 동작의 시간 설정 (1000 이하가 자연스러움)
			rollingFlag : false,// 자동롤링 여부
			activeTabClass : "on",// 탭 활성화 class
			randomFlag : false// 처음 시작될 Index 랜덤 여부
		}, options);

	return this.each(function () {
		var self = this,
			$self = $(this),
			$list = $self.find(opts.listClass),
			$tabs = $self.find(opts.tabClass),
			$conts = $self.find(opts.contClass),
			selectClass = opts.activeTabClass,
			siblingTabClass = opts.siblingTabClass,
			itemContTop = parseInt(($conts.css("top"))?$conts.css("top").replace("px",""):0),
			itemContLeft = parseInt(($conts.css("left"))?$conts.css("left").replace("px",""):0),
			wrapWidth = $self.width(),
			contHeight = $conts.height(),
			beforeIdx = -1,
			cIdx = -1,
			tCnt = $list.length,
			startIdx = (opts.randomFlag) ? Math.floor(Math.random() * tCnt) : opts.startIdx,
			eventType = opts.eventType + ".ybWAtabs",
			rollingInterval = null;
		
		// Init
		function init() {
			var tn = tCnt-1;
			$tabs.each(function (idx, entry) { 
				if( opts.tabPos == 'right'){
					$(this).css( 'right',tn * opts.tabGap + opts.rPadding);
				}
				tn --
				$(entry).data("idx", idx); 
			});
			$conts.each(function (idx, entry) { $(entry).data("idx", idx); });
			selectIdx(startIdx, true);
			addEvent();
			startInterval();
		};

		// Select Next Item
		function next() { selectIdx((cIdx < tCnt - 1)?cIdx + 1:0); };
		
		// Select Idx Item
		function selectIdx(idx, nowFlag) {
			if (idx == cIdx)
				return;
			
			if (siblingTabClass != "" && tCnt > 1) {
				if (idx == 0) {
					$tabs.removeClass(siblingTabClass).eq(idx + 1).addClass(siblingTabClass + "_right");
				} else if (idx == tCnt - 1) {
					$tabs.removeClass(siblingTabClass).eq(idx - 1).addClass(siblingTabClass + "_left");
				} else if (tCnt >= 3) {
					$tabs.removeClass(siblingTabClass);
					$tabs.eq(idx - 1).addClass(siblingTabClass + "_left");
					$tabs.eq(idx + 1).addClass(siblingTabClass + "_right");
				}
			}
			
			beforeIdx = cIdx;
			
			if (beforeIdx > -1)
				$list.eq(beforeIdx).removeClass(selectClass);
			
			$list.eq(idx).addClass(selectClass);
			
			if (opts.animateType == "fade") {
				$conts.css({left:-9999, zIndex:0, opacity:0});
				
				if (nowFlag) {
					$conts.stop().eq(idx).css({left:0, zIndex:1, opacity:1});
				} else {
					if (cIdx > -1)
						$conts.eq(cIdx).css({left:0, zIndex:0, opacity:1});
					
					$conts.stop().eq(idx).css({left:0, zIndex:1, opacity:0}).animate({opacity:1}, opts.animateTime, function () { $conts.eq(beforeIdx).css({left:0, zIndex:0, opacity:0}); });
				}
			} else {
				$conts.css({left:-9999, zIndex:0}).eq(idx).css({left:0, zIndex:1});
			}
			
			cIdx = idx;
		};
		
		// Start Rolling
		function startInterval() { clearInterval(rollingInterval); if (opts.rollingFlag) rollingInterval = setInterval(next, opts.intervalTime); };
		
		// Stop Rolling
		function stopInterval() { clearInterval(rollingInterval); };
		
		// Add Event
		function addEvent() {
			$tabs.bind(eventType, function (event) {
				selectIdx($(this).data("idx"));
				
				if (opts.eventType == "click")
					return false;
			});
			$tabs.bind("focusin.ybWAtabs", function (event) { selectIdx($(this).data("idx"), true); });
			$conts.bind("focusin.ybWAtabs", function (event) { selectIdx($(this).data("idx"), true); });
			$self.bind({
				"mouseenter.ybWAtabs focusin.ybWAtabs" : function (event) { stopInterval(); },
				"mouseleave.ybWAtabs focusout.ybWAtabs" : function (event) { startInterval(); }
			});
		};
		
		init(); /* 초기화 */
	});
};

/* ybAccordion */
/**
 * 접근성 적용 아코디언 Plug-in
 * domType : dom의 형태별로 지정(이미지의 경우 - gallery, 리스트형태 - list)
 * startIdx : 시작 Index 지정 (randomFlag가 false일때만 적용)
 * randomFlag : 시작 Index 랜덤 여부 (true, false)
 * rollingFlag : 자동롤링 여부 (true, false)
 * eventType : 탭 이벤트 타입 ("hover", "click")
 * animateTime : 애니메이션 동작의 시간 설정 (1000 이하가 자연스러움)
 * intervalTime : 롤링 지연시간 (자동롤링이 true일 경우만 작동)
 * selectedClass : 탭 활성화 class ("selected")
 * twoDepsIdx : domType이 list형일때 2deps 인덱스
 * oneDepsIdx : domType이 list형일때 1deps 인덱스
 */
$.fn.ybWAaccordion = function(options){
	var opts = $.extend({
			domType : "gallery",//gallery, list 중 택1
			startIdx : 0,//randomFlag가 false일때 오픈인덱스
			oneDepsIdx : null,//domType가 list형일때 1deps 인덱스
			twoDepsIdx : null,//domType가 list형일때 2deps 인덱스
			intervalTime : 3000,//롤링타임
			eventType : "hover",//hover, click 
			animateTime : 300,//오픈타임
			selectedClass : "selected", // 탭 활성화 class
			rollingFlag : true,//true(자동롤링), false(롤링안됨)
			randomFlag : true//true(랜덤오픈), false(startIdx오픈)
		}, options);

	return this.each(function () {
		/*	var setting */
		var self = this,
			$self = $(this),
			$itemTabs = $self.find(".tabs"),
			$itemCont = $self.find(".cont"),
			$itemList =  $self.children("ul").children("li"),
			selectedClass = opts.selectedClass,
			oneDidx = opts.startIdx,
			twoDidx = (opts.oneDepsIdx) ? opts.oneDepsIdx : null,
			threeDidx = (opts.twoDepsIdx) ? opts.twoDepsIdx : null,
			randomIdx = Math.floor($itemList.length*Math.random()),
			idx = (opts.randomFlag) ? randomIdx : opts.startIdx,
			cidx = idx-1,			
			twoDepsFocusFlag = true,//리스트형태일때 2deps 포커스아웃 flag
			i=0,
			newContHeight = new Array(),
			animateFlag = true;

		for(i=0; i < $itemList.length; i++){
			var findHeight = $self.children("ul").children("li").eq(i).find(".cont").height();
			var cHeight = (findHeight != null) ? findHeight : 0 ;
			newContHeight.push(cHeight);
		}
		
		/* init fn */
		function init(idx){
			if(opts.domType == "gallery" ){/*domType -> gallery*/
				$itemCont.css({"height":"0"});
				$itemList.eq(idx).addClass(selectedClass).children(".cont").css({"height":newContHeight[idx]});
			}else{/*domType -> list*/
				$itemCont.css({"height":"0"});
				openAccordion(oneDidx, twoDidx, threeDidx);
			}
		};

		/* event fn */
		function openAccordion(idx, twoDidx, threeDidx){
			if(cidx <= idx){
				$itemCont.stop().animate({"height":"0"}, opts.animateTime, function(){
					$(this).css({"height":"0"});
				});
				$itemList.eq(idx).children(".cont").stop().animate({"height":newContHeight[idx]}, opts.animateTime);
				
			}else if(cidx > idx){
				$itemCont.stop().animate({"height":"0"},  opts.animateTime);
				$itemList.eq(idx).children(".cont").stop().animate({"height":newContHeight[idx]}, opts.animateTime);
			}else{/*return false;*/}
			
			if(opts.domType == "list" ){
				$itemCont.children("ul").addClass("twoDepsList");
				$itemCont.children("ul").find("ul").addClass("threeDepsList");
				settingSelected(idx, twoDidx, threeDidx);
				
			}else{
				$itemList.removeClass(selectedClass);
				$itemList.eq(idx).addClass(selectedClass);
			}
			cidx = idx;			
		};

		/* rolling fn */
		function autoRolling(){			
			idx = (idx >= ($itemList.length-1)) ? idx=0 : idx+1;
			openAccordion(idx);
		};
		
		/* setting select fn */
		function settingSelected(oneDep, twoDidx, threeDidx){
			$self.find("li").removeClass(selectedClass);
			$itemList.eq(oneDep).addClass(selectedClass);
			if(twoDidx != null){
				$itemList.eq(oneDep).find(".twoDepsList").children("li").eq(twoDidx).addClass(selectedClass);
			}
			if(threeDidx != null){
				$itemList.eq(oneDep).find(".twoDepsList").children("li").eq(twoDidx).find(".threeDepsList").children("li").eq(threeDidx).addClass(selectedClass);
			}
		}

		/* rolling */
		if(opts.rollingFlag){var rollingAccordion = setInterval(autoRolling, opts.intervalTime);}

		/* event on fn */
		function doEventOn(obj){
			idx = obj.parent("li").index();
			openAccordion(idx, null, null);
			clearInterval(rollingAccordion);
		}

		/* event off fn */
		function doEventOff(){
			clearInterval(rollingAccordion);
			if(opts.rollingFlag){rollingAccordion = setInterval(autoRolling, opts.intervalTime);};
		}

		/* list return fn(list형 일때)*/
		function reTurn(){
			if(twoDepsFocusFlag){openAccordion(opts.startIdx, opts.oneDepsIdx, opts.twoDepsIdx);}
		}
		
		/* tab event(hover, click) */
		if(opts.eventType == "click" ){
			$itemTabs.bind({
				"click focusin" : function(){doEventOn($(this)); twoDepsFocusFlag = false; return false;},
				"focusout" : function(){doEventOff(); twoDepsFocusFlag = true;},
				"mouseenter" : function(){clearInterval(rollingAccordion); twoDepsFocusFlag = true;}
			});
		}else{
			$itemTabs.bind({
				"mouseenter focusin" : function(){doEventOn($(this));/*twoDepsFocusFlag = false;*/},
				"mouseleave focusout" : function(){doEventOff();}
			});
		}

		/* cont event */
		$itemCont.find("a").bind({
			"mouseenter focusin" : function(){
				if($(this).parent().hasClass("cont")){	/*gallery type*/
					idx = $(this).parent(".cont").parent("li").index();
					openAccordion(idx);
				}else{	/*list type*/
					idx = $(this).parents(".cont").parent("li").index();
					if($(this).parent("li").parent("ul").hasClass("threeDepsList")){//3deps형
						twoDidx = $(this).parent("li").parent("ul").parent("li").index();
						threeDidx = $(this).parent("li").index();
					}else{//2deps형
						twoDidx = $(this).parent("li").index();
						threeDidx = null;
					}
					openAccordion(idx, twoDidx, threeDidx);					
					twoDepsFocusFlag = false;
				}					
				clearInterval(rollingAccordion);
			},
			"mouseleave focusout" : function(){
				if($(this).parent().hasClass("cont")){/*gallery type*/
					doEventOff();
				}else{/*list type*/
					twoDepsFocusFlag = true;
				}
			}
		});

		/*list type reTurn fn*/
		if(opts.domType == "list"){
			$self.bind({"mouseleave focusout" : function(){setTimeout(reTurn, 0);}});
		}
		
		/*init*/
		init(idx);
	});
};

/* ybCounter */
/**
 * 접근성 적용 카운터 Plug-in (수정자 : 김민경, Last Update Date : 2013-01)
 * type : 몰별 타입
 * startTime : 카운터 시작 시간(20130101100000)
 * endTime : 카운터 끝 시간(20130102100000)
 * motionType : 에니메이트 타입 (block, slide)
 * motionTime : 애니메이션 동작의 시간 설정 (1000 이하가 자연스러움)
 * color : 시간 숫자 컬러 (#fff)
 * userClass : 커스텀 클래스
 */
$.fn.ybCounter = function(options){
	var opts = $.extend({
		type:'public',// 몰별 타입
		startTime:null,//카운터 시작 시간
		endTime:null,//카운터 끝 시간
		motionType:'block',//에니메이트 타입 (block, slide)
		motionTime:500,//애니메이션 동작의 시간 설정 (1000 이하가 자연스러움)
		color:'#fff',//시간 숫자 컬러
		userClass:''//커스텀 클래스
	}, options);
	var $target = $(this), 
		$hour, $min, $sec, $hourTg, $minTg, $secTg, stime, etime, rtime, lastHour, lastMin, lastSec, isFst=true, mt=36;
	
	function init(){
		$target.html('<span class="hour"><strong>00</strong><em class="dp-no">시</em></span><span class="min"><strong>00</strong><em class="dp-no">분</em></span><span class="sec"><strong>00</strong><em class="dp-no">초</em></span>');
		$hour = $target.find(".hour strong");
		$min = $target.find(".min strong");
		$sec = $target.find(".sec strong");
		$hourTg = $target.find(".hour");
		$minTg = $target.find(".min");
		$secTg = $target.find(".sec");

		$target.addClass('ybCounter').addClass(opts.type).css('color', opts.color);
		if(opts.userClass!='') $target.addClass(opts.userClass); //사용자 클래스 적용
		if(opts.startTime==null || opts.startTime==''){
			stime = new Date();
		}else{
			var syear = opts.startTime.slice(0,4)*1;
			var smon = opts.startTime.slice(4,6)*1-1;
			var sday = opts.startTime.slice(6,8)*1;
			var stime = new Date(syear, smon, sday, opts.startTime.slice(8,10)*1, opts.startTime.slice(10,12)*1, opts.startTime.slice(12,14)*1);
		}
		if(opts.endTime==null || opts.endTime=='')
			etime =new Date(stime.getFullYear(), stime.getMonth(), stime.getDate()+1, 10, 0, 0);
		else
			etime = new Date(opts.endTime.slice(0,4)*1, opts.endTime.slice(4,6)*1-1, opts.endTime.slice(6,8)*1, opts.endTime.slice(8,10)*1, opts.endTime.slice(10,12)*1, opts.endTime.slice(12,14)*1);
		
		rtime = etime-stime;
		changeTimer();
		mt = $target.find('.hour').height();
		isFst = false;
		startTimer();
		function startTimer() {
			var timer = setInterval(function() {
				if(rtime > 0) {
					rtime -= 1000;
					changeTimer();
				} else {
					clearInterval(timer);
				}
			}, 1000);
		};

		function changeTimer() {
			var day = Math.floor(rtime / 86400000);
			var hour = Math.floor((rtime - day * 86400000) / 3600000);
			var min = Math.floor((rtime - (day * 86400000 + hour * 3600000 )) / 60000);
			var sec = Math.floor((rtime - (day * 86400000 + hour * 3600000 + min * 60000 )) / 1000);
			var ahour = day * 24 + hour;
			var amin = min;
			var asec = sec;
			
			var ah = setDigit(ahour).slice(0,2);
			var am = setDigit(amin).slice(0,2);
			var as = setDigit(asec).slice(0,2);

			if( opts.motionType == 'block' || isFst==true){
				$hour.html(ah);
				$min.html(am);
				$sec.html(as);
			}else{
				timeAnimate($hourTg, ah, lastHour);
				timeAnimate($minTg, am, lastMin);
				timeAnimate($secTg, as, lastSec);
			}
			lastHour = ah;
			lastMin = am;
			lastSec = as;
		};

		function timeAnimate($targ, applyValue, cntValue){
			if( cntValue != applyValue){
				$targ.append('<strong>'+applyValue+'</strong>');
				$targ.children().eq(0).stop().animate({marginTop:-mt}, opts.motionTime, function(){
					$(this).css('margin-top', 0);
					$(this).remove();
				});
			}
		}

		function setDigit(value) {
			return ((value + "").length < 2) ? "0" + value : value + "";
		};
	}

	init();
};

/**
 * 접근성 적용 슬라이드 Plug-in
 * wrapClass : 슬라이드 Wrapper Class
 * contClass : 리스트를 감싸고 있는 컨테이너 (ex. ul)
 * listClass : 리스트 객체 (ex. li)
 * listActiveClass : 리스트 아이템에 마우스오버/포커스시 적용될 Class 명
 * pagingWrapClass : 페이징을 표시해야 하는 경우 paging wrapper class 할당
 * btnPrevClass : 이전 보기 버튼 (x축 스크롤 : left, y축 스크롤 : top)
 * btnNextClass : 다음 보기 버튼 (x축 스크롤 : right, y축 스크롤 : bottom)
 * slideType : 슬라이드 단위설정 (item : 리스트 아이템 단위 스크롤, page : 페이지 단위 스크롤)
 * lastSlideType : 마지막 리스트 요소를 보여주는 타입 (item : 마지막 리스트 아이템 까지만 스크롤, page : 마지막 페이지 단위 스크롤)
 * direction : 슬라이드 축 방향 (x : x축, y : y 축)
 * animationTime : 아이템 하나 스크롤 시키는 애니메이션 시간 (1/1000 초)
 * startIdx : 시작 인덱스 지정 (randomFlag가 false일때만 가능)
 * viewNum : 화면에 보여질 개수
 * randomFlag : 시작 인덱스 랜덤 여부 (true, false)
 * loofFlag : 리스트 작동 loof 여부 (true, false)
 * rollingFlag : 자동 롤링 여부 (loofFlag가 true일때만 반복 가능!) (true, false)
 * intervalTime : 자동 롤링 딜레이 시간 (1/1000 초)
 * startDelayTime : 로딩 시작 후 자동 롤링까지 딜레이 시간 (1/1000 초)
 * changeBeforeFunc : 인덱스가 바뀌기전 실행 Function (params : beforeIdx, afterIdx)
 * changeAfterFunc : 인덱스가 바뀐 후 실행 Function (params : beforeIdx, afterIdx)
 */
$.fn.ybWAslide = function (options) {
	var opts = $.extend({
		wrapClass : ".mask_wrap",
		contClass : ".cont_wrap",
		listClass : ".cont_wrap > li",
		listActiveClass : "", // 리스트 아이템에 마우스오버/포커스시 적용될 Class 명
		pagingWrapClass : "",
		btnPrevClass : ".btn_top, .btn_left",
		btnNextClass : ".btn_bottom, .btn_right",
		slideType : "page", // 슬라이드 단위 (item, page)
		lastSlideType : "page", // 마지막 아이템 슬라이드 단위 (item : 마지막 아이템까지만 슬라이드, page : 페이지 갯수 단위 여백 보임)
		direction : "x", // 슬라이드 방향 축
		animationType : "slide", // 애니메이션 타입 (slide, fade, none)
		animationTime : 100, // 아이템 하나 슬라이드에 걸리는 애니메이션 시간
		startIdx : 0, // 0 부터 시작
		viewNum : 1, //화면에 보여질 개수
		randomFlag : false,
		loofFlag : false,
		rollingFlag : false,
		intervalTime : 3000,
		startDelayTime : 0, // 자동 롤링 시작 딜레이 시간
		listActiveFunc : function (idx) {},
		listDisableFunc : function (idx) {},
		changeBeforeFunc : function (beforeIdx, afterIdx) {}, // 인덱스 변경 이전 실행 Function
		changeAfterFunc : function (beforeIdx, afterIdx) {} // 인덱스 변경 후 실행 Function
	}, options);
	
	return this.each(function () {
		var self = this,
			$self = $(this),
			$wrap = $self.find(opts.wrapClass),
			$cont = $self.find(opts.contClass),
			$list = $self.find(opts.listClass),
			listActiveClass = opts.listActiveClass,
			$pagingWrap = $self.find(opts.pagingWrapClass),
			$btnPrev = $self.find(opts.btnPrevClass),
			$btnNext = $self.find(opts.btnNextClass),
			slideType = opts.slideType,
			lastSlideType = opts.lastSlideType,
			direction = opts.direction,
			animationType = opts.animationType,
			animationTime = opts.animationTime,
			startIdx = opts.startIdx,
			viewNum = opts.viewNum,
			randomFlag = opts.randomFlag,
			loofFlag = opts.loofFlag,
			rollingFlag = opts.rollingFlag,
			intervalTime = opts.intervalTime,
			startDelayTime = opts.startDelayTime,
			listActiveFunc = opts.listActiveFunc,
			listDisableFunc = opts.listDisableFunc,
			wrapWidth = $wrap.width(),
			wrapHeight = $wrap.height(),
			tCnt = $list.length,
			pageListCnt = -1,
			tWidth = 0,
			tHeight = 0,
			startIdx = (startIdx < tCnt)?startIdx:0,
			cIdx = -1,
			rollingInterval = null,
			clickChkFlag = false,
			clickIdx = -1,
			changeBeforeCustomFunc = opts.changeBeforeFunc,
			changeAfterCustomFunc = opts.changeAfterFunc;
		
		function changeBeforeFunc(beforeIdx, afterIdx) {
			changeBeforeCustomFunc(beforeIdx, afterIdx); // 시작 전 실행 Function
		};
		
		function changeAfterFunc(beforeIdx, afterIdx) {
			changeAfterCustomFunc(beforeIdx, afterIdx);
			
			$list.eq(beforeIdx).removeClass("on");
			$list.eq(afterIdx).addClass("on");
			
			if ($pagingWrap.length > 0 && tCnt > 1) {
				var pagingHtml = '';
				pagingHtml += '<span class="current_page_title">현재 페이지 : </span>';
				pagingHtml += '<span class="current_page">' + (afterIdx + 1) + '</span>';
				pagingHtml += '<span class="separation">/</span>';
				pagingHtml += '<span class="total_page_title">전체 페이지 : </span>';
				pagingHtml += '<span class="total_page">' + tCnt + '</span>';
				$pagingWrap.html(pagingHtml);
			}
		};
		
		function selectIdx(idx, nowFlag) { // 아이템 선택
			if (idx < 0 || idx > tCnt - viewNum || idx == cIdx)
				return false;
			
			if ($cont.filter(":not(:animated)").length > 0) {
				var targetPos = -$list.eq(idx).data((direction == "y")?"startPosY":"startPosX");
				changeBeforeFunc(cIdx, idx);
				
				if (lastSlideType == "item"){
					idx = (tCnt - pageListCnt < idx)?tCnt - pageListCnt:idx;
				}
				
				if (direction == "y") {
					if (animationType == "fade") {
						$cont.animate({opacity:0}, (!nowFlag)?animationTime:0, function () {
							changeAfterFunc(cIdx, idx);
							$(this).css({marginTop:targetPos}).animate({opacity:1}, (!nowFlag)?animationTime:0);
						});
					} else if (animationType == "slide") {
						$cont.animate({marginTop:targetPos}, (!nowFlag)?animationTime * Math.abs(cIdx - idx):0, function () { changeAfterFunc(cIdx, idx); });
					} else {
						$cont.css({marginTop:targetPos});
						changeAfterFunc(cIdx, idx);
					}
				} else {
					if (animationType == "fade") {
						$cont.animate({opacity:0}, (!nowFlag)?animationTime:0, function () {
							changeAfterFunc(cIdx, idx);
							$(this).css({marginLeft:targetPos}).animate({opacity:1}, (!nowFlag)?animationTime:0);
						});
					} else if (animationType == "slide") {
						$cont.animate({marginLeft:targetPos}, (!nowFlag)?animationTime * Math.abs(cIdx - idx):0, function () { changeAfterFunc(cIdx, idx); });
					} else {
						$cont.css({marginLeft:targetPos});
						changeAfterFunc(cIdx, idx);
					}
				}
				
				cIdx = idx;
			}
		};
		
		function prev() { // 이전 아이템/페이지 선택
			var prevIdx = 0;
			
			if (slideType == "item") {
				prevIdx = (cIdx - 1 > 0)?cIdx - 1:0;
			} else {
				if (lastSlideType == "item") {
					if (cIdx - pageListCnt >= 0)
						prevIdx = cIdx - pageListCnt;
					else
						prevIdx = (cIdx != 0 || !loofFlag)?0:tCnt - pageListCnt;
				} else {
					prevIdx = ((Math.floor(cIdx / pageListCnt) - 1) * pageListCnt >= 0)?(Math.floor(cIdx / pageListCnt) - 1) * pageListCnt:(loofFlag)?Math.floor(tCnt / pageListCnt) * pageListCnt:0;
				}
			}
			
			nextIdx = parseInt(prevIdx);
			selectIdx(prevIdx);
		};
		
		function next() { // 다음 아이템/페이지 선택
			var nextIdx = (loofFlag)?0:tCnt - 1;
			
			if (slideType == "item") {
				nextIdx = (cIdx + 1 < tCnt - pageListCnt)?cIdx + 1:(loofFlag)?0:tCnt - pageListCnt;
			} else {
				if (lastSlideType == "item") {
					if (cIdx + pageListCnt < tCnt - pageListCnt)
						nextIdx = cIdx + pageListCnt;
					else
						nextIdx = (cIdx != tCnt - pageListCnt || !loofFlag)?tCnt - pageListCnt:0;
				} else {
					nextIdx = (Math.floor((cIdx + pageListCnt) / pageListCnt) * pageListCnt <= tCnt - 1)?Math.floor((cIdx + pageListCnt) / pageListCnt) * pageListCnt:(loofFlag)?0:tCnt - 1;
				}
			}
			
			nextIdx = parseInt(nextIdx);
			selectIdx(nextIdx);
		};
		
		function startInterval() { // 자동롤링 시작
			if (tCnt > 2) {
				clearInterval(rollingInterval);
				if (rollingFlag) {
					rollingInterval = setInterval(next, intervalTime);
				}
			}
		};
		
		function stopInterval() { // 자동롤링 해제
			if (rollingFlag) clearInterval(rollingInterval);
		};
		
		function addEvent() { // 이벤트 등록
			$self.bind({
				"mouseenter.ybWAslide focusin.ybWAslide" : function (event) { stopInterval(); },
				"mouseleave.ybWAslide focusout.ybWAslide" : function (event) { startInterval(); },
				"selectstart.ybWAslide" : function (event) { event.preventDefault(); return false; } // 더블클릭 셀렉트 방지
			});
			
			$list.bind({
				"mousedown.ybWAslide" : function (event) {
					$(this).data("mouseDown", true);
					clickIdx = $(this).index();
				},
				"mouseenter.ybWAslide" : function (event) {
					$(this).addClass(listActiveClass);
					listActiveFunc($(this).index());
				},
				"mouseleave.ybWAslide" : function (event) {
					$(this).removeClass(listActiveClass);
					listDisableFunc($(this).index());
				},
				"focusin.ybWAslide" : function (event) {
					$(this).addClass(listActiveClass);
					listActiveFunc($(this).index());
					if (!$(this).data("mouseDown") && clickIdx != $(this).index())
						selectIdx($(this).index(), true);
				},
				"focusout.ybWAslide" : function (event) {
					$(this).removeClass(listActiveClass);
					listDisableFunc($(this).index());
				},
				"mouseup.ybWAslide" : function (event) {
					$(this).removeData("mouseDown");
				}
			});
			
			$btnPrev.bind({
				"mouseenter.ybWAslide" : function (event) { $(this).addClass("btn_prev_on"); },
				"mouseleave.ybWAslide" : function (event) { $(this).removeClass("btn_prev_on"); },
				"click.ybWAslide" : function (event) { prev(); return false; }
			});
			
			$btnNext.bind({
				"mouseenter.ybWAslide" : function (event) { $(this).addClass("btn_next_on"); },
				"mouseleave.ybWAslide" : function (event) { $(this).removeClass("btn_next_on"); },
				"click.ybWAslide" : function (event) { next(); return false; }
			});
		};
		
		function init() { // 초기화
			var topMargin = 0, bottomMargin = 0, beforeTopMargin = 0, beforeBottomMargin = 0;
			tWidth = 0;
			tHeight = 0;
			
			if ($pagingWrap.length > 0 && tCnt < 2) {
				$pagingWrap.remove();
				$btnPrev.remove();
				$btnNext.remove();
			}
			
			if (tCnt >= 1) {
				if (direction == "y") {
					$list.each(function (idx, entry) {
						if (wrapHeight < $(entry).offset().top - $cont.offset().top && pageListCnt == -1)
							pageListCnt = idx - 1;
						
						$(entry).data("startPosY", $(entry).offset().top - $cont.offset().top);
					});
					
				} else {
					$list.each(function (idx, entry) {
						$(entry).data("startPosX", tWidth);
						
						tWidth += $(entry).width();
						tWidth += $(entry).css("margin-left").replace("px", "") * 1;
						tWidth += $(entry).css("margin-right").replace("px", "") * 1;
						
						if (wrapWidth < tWidth && pageListCnt == -1)
							pageListCnt = idx;
					});
					
					$cont.width(tWidth);
				}
				
				if (pageListCnt < 1)
					pageListCnt = 1;
				
				addEvent();
				
				// 시작 Index 구하기
				if (slideType == "item") {
					startIdx = (startIdx > tCnt - pageListCnt)?tCnt - pageListCnt:(randomFlag)?Math.floor(Math.random() * tCnt):startIdx;
				} else {
					if (lastSlideType == "item")
						startIdx = (startIdx > tCnt - pageListCnt)?tCnt - pageListCnt:(randomFlag)?Math.floor(Math.random() * tCnt):startIdx;
					else
						startIdx = Math.floor(((randomFlag)?Math.floor(Math.random() * tCnt):startIdx) / pageListCnt) * pageListCnt;
				}
				
				selectIdx(startIdx, true);
				setTimeout(startInterval, startDelayTime);
			}
		};
		
		init();
	});
};

/**
 * onchange용 selectbox plug-in
 * 일반 selectbox 마크업을 li스타일로 마크업 변경 처리됨
 * selectType : 선택방법( 클릭시 열림: click, 오버시 열림: mouseenter )
 * linkFunc : 아이템 선택 시 호출 스크립트명
 * aTarget : a target방식
 */
$.fn.ybSelectBox = function (options) {
	var opts = $.extend({
		selectType:"click",
		linkFunc:null,
		aTarget:'_self'
	}, options);
	return this.each(function () {
		var isOpen = false,
			linkFunc = opts.linkFunc,
			valueArr = [],
			$self = $(this),
			$replaceSelectBox,
			$btn,
			$selList,
			$selectUl,
			$selectLl,
			$lstBtn;
		
		function setting(){
			var realSelectBox = $self.find('option'), lst='', isSelect='', addHref='#', aTarget='', firTl='선택하기';
			realSelectBox.each(function(){
				if($(this).attr('selected')=='selected') isSelect = 'on';
				else isSelect = '';
				if(linkFunc != null){
					if( $(this).attr('value') == "" ) return;
					valueArr.push($(this).attr('value'));
					addHref = '#';

					lst += '<li class="'+isSelect+'"><a href="'+addHref+'"'+aTarget+'>'+$(this).text()+'</a></li>';
				}else{
					addHref = $(this).attr('value');
					aTarget = ' target="'+opts.aTarget+'"';
					if(opts.aTarget == '_blank') aTarget += ' title="새창"';
					if(addHref != '') lst += '<li class="'+isSelect+'"><a href="'+addHref+'"'+aTarget+'>'+$(this).text()+'</a></li>';
					else firTl = $(this).text();
				}
			});

			var replaceSelectBox = '<div class="'+$self.attr('class')+'">';
			replaceSelectBox+='<a class="btn_sel" href="#">';
			replaceSelectBox+='<span class="cnt">'+firTl+'</span>';
			replaceSelectBox+='<span class="arrow"></span>';
			replaceSelectBox+='</a>';
			replaceSelectBox+='<div class="sel_list_wrap">';
			replaceSelectBox+='<ul class="sel_list">';
			replaceSelectBox+= lst;
			replaceSelectBox+='</ul>';
			replaceSelectBox+='</div>';
			
			$replaceSelectBox = $(replaceSelectBox);
			$self.parent().prepend($replaceSelectBox);
			$self.remove();
			
			init();
		}

		setting();

		function init(){
			$btn = $replaceSelectBox.find('.btn_sel');
			$selList = $replaceSelectBox.find('.sel_list_wrap');
			$selectUl = $replaceSelectBox.find('.sel_list');
			$selectLl = $replaceSelectBox.find('.sel_list > li');
			$lstBtn = $selectLl.find('a');

			if( $selectUl.find('.on').text() != "")
				setSelectTxt();

			if( opts.selectType == "click" ){
				$btn.bind("click", function(){
					if( !isOpen ) setShowList(true);
					else setShowList(false);
					return false;
				});
			}else{
				$replaceSelectBox.bind('mouseenter focusin', function(){setShowList(true);});
			}

			$replaceSelectBox.bind('mouseleave', function(){if(isOpen){setShowList(false);}});
			
			$lstBtn.bind({
				'click':function(){
							if( linkFunc != null ){
								$selectLl.removeClass('on');
								$(this).parent().addClass('on');
								setSelectTxt();
								setShowList(false);
								linkFunc(valueArr[$(this).parent().index()]);
								return false;}},
				'focusin': function(){setShowList(true);}
			});
			$lstBtn.eq(-1).bind('focusout', function(){setShowList(false);});
		}

		function setShowList(flag){
			if( flag ) $selList.show();
			else $selList.hide();
			isOpen = flag;
		}

		function setSelectTxt(){$btn.find('.cnt').text($selectUl.find('.on').text());}
	});
};

})(jQuery);