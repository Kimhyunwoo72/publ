/*
 * Copyright 2015, yyb
 * jQuery 1.7.1.min.js 기준 사용
 * 하단 스크립트 영역은 페이지 로드가 완료된 후에 적용되어도 괜찮은 스크립트만을 선언함
 * 1.7.1.min.js 상위에 선언 필요
 * design.js 플러그인 상위에 선언 필요
 */
/*
 * 공통 상수, 변수, 함수 영역 (작성시 상수 - 변수 - 함수 순으로 선언하여 주시기 바랍니다.)
 *
 * 고려대학교 의과대학 - 의과학연구지원 센터
 */

$(document).ready(function(){

	// GNB MENU ----
	$("#gnbNav > ul > li > a").on("click",function(e){
		e.preventDefault();
		$("#header .gnbClose").slideDown();
		$(".gnb_sub").stop().slideDown(); 
		$("#header .gnb_nav_bg").stop().slideDown();
	});
	// GNB MENU :: Close btn
	$("#header .gnbClose").on("click",function(e){
		e.preventDefault();
		$(".gnb_sub").stop().slideUp(); 
		$(".gnb_nav_bg").stop().slideUp();
		$("#header .gnbClose").slideUp();
	});

	// main :: visual_slide 비주얼 슬라이드
	$('.cont_visual_slide').ybWAInsideTabPlugin({startIdx :0, randomFlag:false, rollingFlag:true, slideDirection:"x", animateType: "fade", animateTime: 500, intervalTime: 3000, listWrapClass: ">ul > li", tabClass:".tab", contClass:".cont", activeTabClass:"on", activeContClass:"on", tabDirection:"x", tabXAlign:"left", tabYAlign:"bottom", tabGap:2, tabWrapXGap:234, tabWrapYGap:17, changeBeforeFunc:null, changeAfterFunc:null});

	// main :: Layer Popup :: 비주얼 영역 팝업
	$('.pop_content').ybWAslide({direction:"x", slideType:"page", lastSlideType:"page", animationType:"fade", animationTime:100, startIdx:0, randomFlag:false, loofFlag:true, rollingFlag:false, intervalTime:3000, startDelayTime:0});

	// main :: bbs - tab 게시판 탭 
	$('.bbs_box .tab a').bind('click focusin',function(e){
		e.preventDefault();
		$('.bbs_box .wrap').removeClass('on'); 
		$(this).parent().parent().addClass('on'); 
	});

	// main :: slide 아래 가로 슬라이드
	$('.contbot_slide').ybWAslide({direction:"x", slideType:"page", lastSlideType:"page", animationType:"slide", animationTime:100, startIdx:0, randomFlag:false, loofFlag:true, rollingFlag:false, intervalTime:3000, startDelayTime:0});

	// sub area ::
	// sub :: lnb 메뉴 lnb_02_depth, lnb_03_depth
	$("#lnb .lnb_inner > ul.lnb_02_depth > li > a").on("click, focusin",function(e){
		e.preventDefault();
		$(this).parent().addClass("selected").siblings().removeClass("selected");
	});

	// tab 활성
	$('.tab_active a').click(function(e){
		$(this).parent().addClass('on').siblings().removeClass('on');
		if($(this).parent().hasClass('on')){
			$(this).attr('title','선택된 탭').parent().siblings().children('a').attr('title','');
		};
		var tabindex = $('.tab_active a').index(this);
		$('.tab_cont').hide();
		$('#tab_cont0'+ (tabindex + 1)).show();
		e.preventDefault();
	});
	
	 $('.tab_cont').hide();
	 $('#tab_cont01').show();

	// tab menu - 3개 일 경우
	$('#tab_type_02 ul li a').click(function(e){
		$(this).parent("li").addClass('on').siblings().removeClass('on');
		if($(this).parent().hasClass('on')){
			$(this).attr('title','선택된 탭').parent().siblings().children('a').attr('title','');
		}
		var tabindex = $('#tab_type_02 a').index(this);
		$(this).parent().parent().parent().find('div[class*=tab_cont_0]').hide();
		$('#tab_type_02 .tab_cont_0'+ (tabindex + 1)).show();
		// e.preventDefault();
	});

	// tab menu - 4개 일 경우
	$('#tab_type_03 ul li a').click(function(e){
		$(this).parent("li").addClass('on').siblings().removeClass('on');
		if($(this).parent().hasClass('on')){
			$(this).attr('title','선택된 탭').parent().siblings().children('a').attr('title','');
		}
		var tabindex = $('#tab_type_03 a').index(this);
		$(this).parent().parent().parent().find('div[class*=tab_cont_0]').hide();
		$('#tab_type_03 .tab_cont_0'+ (tabindex + 1)).show();
		// e.preventDefault();
	});
	// tab menu - 5개 일 경우
	$('#tab_type_04 ul li a').click(function(e){
		$(this).parent("li").addClass('on').siblings().removeClass('on');
		if($(this).parent().hasClass('on')){
			$(this).attr('title','선택된 탭').parent().siblings().children('a').attr('title','');
		}
		var tabindex = $('#tab_type_04 a').index(this);
		$(this).parent().parent().parent().find('div[class*=tab_cont_0]').hide();
		$('#tab_type_04 .tab_cont_0'+ (tabindex + 1)).show();
		// e.preventDefault();
	});

	 //달력 레이어팝업
	 $('.btn_calendar').click(function(){
		$(this).parent().parent().css('position','relative');
		$('.layer_calendar').show();
	 });
	 $('.layer_calendar > .btn_layer_close').click(function(){
		  $('.btn_calendar').parent().parent().css('position','');
		$('.layer_calendar').hide();
	 });

	 	// main :: bbs - 토글버튼 - 클릭시, 버튼 활성화
	$('#btn_package_area .btn_type_06, #btn_package_area .btn_type_07').on('click',function(e){
		e.preventDefault();
		if ($(this).hasClass("btn_type_06")){
			$(this).removeClass("btn_type_06").addClass("btn_type_07").siblings().removeClass("btn_type_07").addClass("btn_type_06");
		}
	});

	//토글
	$('.toggle_list dt div .btn_toggle a').click(function(e){
		if($(this).hasClass('open')){
			$(this).removeClass('open').addClass('close').text('닫기');
			$(this).prev().removeClass('arr_dw').addClass('arr_up');
			$(this).parent().parent().parent().css('border-bottom','0')
			$(this).parent().parent().parent().next('dd').slideDown();
		}else{
			$(this).removeClass('close').addClass('open').text('열기');
			$(this).prev().removeClass('arr_up').addClass('arr_dw');
			$(this).parent().parent().parent().css('border-bottom','1px solid #d3d3d3')
			$(this).parent().parent().parent().next('dd').slideUp('fast');
		};
		e.preventDefault();
	});

});// end of $(document).ready

// lnb 높이 =  content 높이 계산
$(window).load(function(){
	// sub area ::
	// lnb = content 높이
	var lnb_h = $("#lnb").height(); // lnb 높이 
	var lnb_inner_h = $("#lnb .lnb_inner").height(); // lnb 기존 높이 
	var lnb_tit_h = parseInt($("#lnb .tit").height()) + parseInt($("#lnb .tit").css('padding-bottom').replace(/[^-\d\.]/g, '')); 
	// lnb(타이틀 높이) + tit(높+페딩) 높이 
	var cont_h = $("#container .sub_cont").height(); // 컨텐츠 높이
	var result_lnb = cont_h - lnb_tit_h;// content(컨텐츠) lnb(타이틀 높이)

	// lnb 높이가 content 높이보다 작을때 
	if(lnb_h < cont_h){
		$("#lnb .lnb_inner").css("height" ,result_lnb + "px");
	}
	else{
		$("#container .sub_cont").css("height" ,lnb_h  + parseInt(50) + "px");
		$("#lnb .lnb_inner").css("height" ,lnb_inner_h + parseInt(50) + "px");
	}

	

});// end of $(window).load