$(document).ready(function(){
 //获取屏幕的高度
 var min_height=window.screen.height-100;
 //$(".content").css("min-height",min_height);


	$("#btn_menu").click(function(){
		var menuRight=$("#menu").css("right");
		var fontSize=$("#menu").css("fontSize").replace("px","");
		if(menuRight!="0px"){
			//menu的right:0px不成立 表示处于隐藏状态，要显示menu
			$(".bg").fadeIn();
			$("#menu").css("display","block");
			 $("#menu").animate({right:0})
		}else if(menuRight=="0px"){
			//menu的right：0px成立 表示处于显示状态，要隐藏menu
			hideMenu(fontSize);
		}

		

	})//菜单点击按钮事件


	function hideMenu(fontSize){

		$(".bg").fadeOut();
		var menuStartRight2="-"+fontSize*17;// right:-238px;(-17em=14px*17=238px)；	
		$("#menu").animate({right:menuStartRight2})	;
		$("#menu").css("display","none");

	}

	//点击除menu之外的地方隐藏菜单
	$(".bg").click(function(e){
		var fontSize=$("#menu").css("fontSize").replace("px","");
		hideMenu(fontSize);
	})



});
