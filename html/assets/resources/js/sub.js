
 $(document).ready(function () {
   $(window).scroll(function () {
     var scrollDistance = $(window).scrollTop();
     var elementOffset = $(".deposit-body").offset().top - 200;

     if (scrollDistance >= elementOffset) {
       $(".floating").addClass("on");
     } else {
       $(".floating").removeClass("on");
     }
     var element = document.querySelector(".floating");
     var floating_height = element.offsetHeight;
     var footerOffset = $(".deposit-body_stop").offset().top - floating_height - 270;
     var windowHeight = $(window).height();

     if (scrollDistance >= footerOffset) {
       $(".floating").removeClass("on");
       $(".floating").addClass("on2");
     } else {
       $(".floating").removeClass("on2");
     }
   });
 });

$(function(){
     $(window).on("scroll", function () {
       var prevScroll = 0;
       var sec01 = $(".section01").length > 0 ? $(".section01").offset().top : 0;
       var sec02 = $(".section02").length > 0 ? $(".section02").offset().top : 0;
       var sec03 = $(".section03").length > 0 ? $(".section03").offset().top : 0;
       var sec04 = $(".section04").length > 0 ? $(".section04").offset().top : 0;
       var sec05 = $(".section05").length > 0 ? $(".section05").offset().top : 0;
       var sec06 = $(".section06").length > 0 ? $(".section06").offset().top : 0;
       var sec07 = $(".section07").length > 0 ? $(".section07").offset().top : 0;
       var sec08 = $(".section08").length > 0 ? $(".section08").offset().top : 0;
       var sec09 = $(".section09").length > 0 ? $(".section09").offset().top : 0;
       var sec09 = $(".section10").length > 0 ? $(".section10").offset().top : 0;
       var footer = $(".footer").length > 0 ? $(".footer").offset().top : 0;
       var nowScroll = $(window).scrollTop();

       if (nowScroll > prevScroll) {
         // 아래로 스크롤

         // section01
         if (nowScroll >= 0 && (sec02 === 0 || nowScroll <= sec02 - 152)) {
           $(".state01").addClass("on");
         } else {
           $(".state01").removeClass("on");
         }

         // section02
         if (sec02 !== 0 && nowScroll >= sec02 - 152 && (sec03 === 0 || nowScroll < sec03 - 152)) {
           $(".state02").addClass("on");
         } else {
           $(".state02").removeClass("on");
         }

         // section03
         if (sec03 !== 0 && nowScroll >= sec03 - 152 && (sec04 === 0 || nowScroll < sec04 - 152)) {
           $(".state03").addClass("on");
         } else {
           $(".state03").removeClass("on");
         }

         // section04
         if (sec04 !== 0 && nowScroll >= sec04 - 152 && (sec05 === 0 || nowScroll < sec05 - 152)) {
           $(".state04").addClass("on");
         } else {
           $(".state04").removeClass("on");
         }
         // section05
         if (sec05 !== 0 && nowScroll >= sec05 - 152 && (sec06 === 0 || nowScroll < sec06 - 152)) {
           $(".state05").addClass("on");
         } else {
           $(".state05").removeClass("on");
         }
         // section06
         if (sec06 !== 0 && nowScroll >= sec06 - 152 && (sec07 === 0 || nowScroll < sec07 - 152)) {
           $(".state06").addClass("on");
         } else {
           $(".state06").removeClass("on");
         }
          // section07
         if (sec07 !== 0 && nowScroll >= sec07 - 152 && (sec08 === 0 || nowScroll < sec08 - 152)) {
           $(".state07").addClass("on");
         } else {
           $(".state07").removeClass("on");
         }
          // section08
         if (sec08 !== 0 && nowScroll >= sec08 - 152 && (sec09 === 0 || nowScroll < sec09 - 152)) {
           $(".state08").addClass("on");
         } else {
           $(".state08").removeClass("on");
         }
         // section09
         if (sec09 !== 0 && nowScroll >= sec09 - 152 && (sec10 === 0 || nowScroll < sec10 - 152)) {
           $(".state09").addClass("on");
         } else {
           $(".state09").removeClass("on");
         }
         // section10
         if (sec10 !== 0 && nowScroll >= sec10 - 152 && (sec11 === 0 || nowScroll < sec11 - 152)) {
           $(".state10").addClass("on");
         } else {
           $(".state10").removeClass("on");
         }
       }

       prevScroll = nowScroll;
     });
});

$(function () {
  $('a[href^="#"]').on("click", function (event) {
    var target = $($(this).attr("href"));
    if (target.length) {
      event.preventDefault();
      $("html, body").animate(
        {
          scrollTop: target.offset().top - 150,
        },
        500
      );
    }
  });
});