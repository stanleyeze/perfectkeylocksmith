
(function ($) {
	'use strict';

	//LOADER
	//jQuery(window).on("load", function () {
		$('.preloader').fadeOut(500);
	//});
		
	// Elements Animation
	AOS.init({
		disable: false, // accepts following values: 'phone', 'tablet', 'mobile', boolean, expression or function
  		duration: 1000, // values from 0 to 3000, with step 50ms
		once: true, // whether animation should happen only once - while scrolling down
	})

	// Side Menu
	$(document).ready(function () {
		ma5menu({
			menu: '.main_menu',
			activeClass: 'current',
			footer: '.slide_navi',
			position: 'right',
			closeOnBodyClick: true
		});
	});

	// Aside info bar
	$('.aside_open').click(function(e){
		e.preventDefault();
		$('.aside_info').css("left", "0px");
	});

	$('.aside_close').click(function(e){
		e.preventDefault();
		$('.aside_info').css("left", "-500px");
	});

	// Slider Slick 1
	$('.slider_slick_1').slick({
		infinite: false,
		autoplay: false,
		speed: 700,
		slidesToShow: 1,
		slidesToScroll: 1,
		arrows: false,
		dots: false,
		responsive: [
			{
				breakpoint: 1024,
				settings: {
					slidesToShow: 1,
					slidesToScroll: 1,
					infinite: true,
				}
			},
			{
				breakpoint: 767,
				settings: {
					slidesToShow: 1,
					slidesToScroll: 1
				}
			},
			{
				breakpoint: 480,
				settings: {
					slidesToShow: 1,
					slidesToScroll: 1
				}
			}
		]
	});

	// Team Slick
	$('.team_slick').slick({
		infinite: false,
		speed: 300,
		slidesToShow: 3,
		slidesToScroll: 1,
		centerPadding: 40,
		arrows: true,
		dots: false,
		responsive: [
			{
				breakpoint: 1024,
				settings: {
					slidesToShow: 3,
					slidesToScroll: 1,
					dots: true
				}
			},
			{
				breakpoint: 767,
				settings: {
					slidesToShow: 2,
					slidesToScroll: 1,
					dots: true
				}
			},
			{
				breakpoint: 480,
				settings: {
					slidesToShow: 1,
					slidesToScroll: 1,
					dots: true
				}
			}
		]
	});

	// Testimonial Slick
	$('.testimonial_slick_1').slick({
		infinite: false,
		autoplay: true,
		speed: 300,
		slidesToShow: 3,
		slidesToScroll: 1,
		centerPadding: 40,
		arrows: true,
		dots: false,
		responsive: [
			{
				breakpoint: 1024,
				settings: {
					slidesToShow: 2,
					slidesToScroll: 1,
					dots: false
				}
			},
			{
				breakpoint: 767,
				settings: {
					slidesToShow: 2,
					slidesToScroll: 1,
					dots: true
				}
			},
			{
				breakpoint: 480,
				settings: {
					slidesToShow: 1,
					slidesToScroll: 1,
					dots: true
				}
			}
		]
	});

	// Testimonial Slick
	$('.testimonial_slick_2').slick({
		infinite: false,
		autoplay: true,
		speed: 300,
		slidesToShow: 2,
		slidesToScroll: 1,
		centerPadding: 40,
		arrows: false,
		dots: false,
		responsive: [
			{
				breakpoint: 1024,
				settings: {
					slidesToShow: 2,
					slidesToScroll: 1,
					dots: false
				}
			},
			{
				breakpoint: 767,
				settings: {
					slidesToShow: 1,
					slidesToScroll: 1,
					dots: true
				}
			},
			{
				breakpoint: 480,
				settings: {
					slidesToShow: 1,
					slidesToScroll: 1,
					dots: true
				}
			}
		]
	});

	// Youtube
	var $ytvideoTrigger = $(".ytplay_btn");
	$ytvideoTrigger.on("click", function(evt) {  
		$(".ytube_video").addClass("play");
		$("#ytvideo")[0].src += "?autoplay=1";
	});

	
	// Local
	var $videoTrigger = $(".play_btn");
	var $videoContainer = $(".local_video");
	$videoTrigger.on("click", function(evt) {  
		if ($videoContainer.hasClass("play")) {
			$videoContainer
			.removeClass("play")
			.find("video").get(0).pause();
		}
		else {
			$videoContainer
			.addClass("play")
			.find("video").get(0).play();
		}
	});

	// Search width increase
	$('.header_search .search_form .form-control').click(function(e) { 
		$('.header_search .search_form').removeClass('active');
		$(e.target).closest('.header_search .search_form').addClass('active');
	});
	$(document).click(function(e){ 
		if($(e.target).closest('.header_search .search_form').length==0) { 
		   	$('.header_search .search_form').removeClass('active');  
		}
	});

	// Search width increase
	$('.open_search .open_button').click(function(e) { 
		$('.header_search').toggleClass('active');
	});

	// accordion
	$(".accordion").on("click",".accordion_tab", function () {
		$(this).next().slideDown();
		$(".accordion_info").not($(this).next()).slideUp();
	});

	$(".accordion").on("click",".item", function () {
		$(this).addClass("active").siblings().removeClass("active");
	});

	// Funfact Counter
	// $('.fun-number').each(function () {
	// 	$(this).prop('Counter',0).animate({
	// 	  Counter: $(this).text()
	// 	}, {
	// 	  duration: 4000,
	// 	  easing: 'swing',
	// 	  step: function (now) {
	// 		$(this).text(Math.ceil(now));
	// 	  }
	// 	});
	// });
	
	// Popup Video
	$('.fancybox-media').fancybox({
		openEffect  : 'none',
		closeEffect : 'none',
		helpers : {
		  media : {}
		}
	});

   
})(jQuery);
	