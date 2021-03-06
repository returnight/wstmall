function toEditAddress(){
	$("#consignee1").hide();
	$("#consignee2").show();
}
function changeAddress(){
	var addressId = $('input:radio[name="seladdress"]:checked').val();		
	$("#consigneeId").val(addressId);
	if(addressId<1){
		$("#consignee_add_userName").val("");
		$("#consignee_add_address").val("");
		$("#consignee_add_userPhone").val("");
		$("#consignee_add_userTel").val("");
		$("#consignee_add_zipCode").val("");
		
		var html = new Array();
		$("#consignee_add_countyId").val(0);
		
		var html = new Array();
		$("#consignee_add_CommunityId").empty();
		html.push("<option value='0'>请选择</option>");
		$("#consignee_add_CommunityId").html(html.join(""))
	}else{
		loadAddress(addressId);
	}
}
function loadCommunitys(obj){
	var districtId = obj.value;
	if(districtId<1){
		var html = new Array();
		$("#consignee_add_CommunityId").empty();
		html.push("<option value='0'>请选择</option>");
		$("#consignee_add_CommunityId").html(html.join(""));
		return;
	}
	
	jQuery.post(rooturl+"/index.php/Home/UserAddress/getCommunitys" ,{districtId:districtId},function(rsp){
		var vd = WST.toJson(rsp);
		var html = new Array();
		$("#consignee_add_CommunityId").empty();
		html.push("<option value='0'>请选择</option>");
		for(var i in vd){	    	
			html.push("<option value='"+vd[i].communityId+"'>"+vd[i].communityName+"</option>");    	
		}
		$("#consignee_add_CommunityId").html(html.join(""));
	});
}

function loadAddress(addressId){
	$("#address_form").show();	
	jQuery.post(rooturl+"/index.php/Home/UserAddress/getUserAddress" ,{addressId:addressId},function(rsp) {
		var rs = WST.toJson(rsp);
		if(rs.status>0){
			var addressInfo = rs.address;
			$("#consignee_add_userName").val(addressInfo.userName);
			$("#consignee_add_address").val(addressInfo.address);
			$("#consignee_add_userPhone").val(addressInfo.userPhone?addressInfo.userPhone:"");
			$("#consignee_add_userTel").val(addressInfo.userTel);
			$("#consignee_add_zipCode").val(addressInfo.postCode?addressInfo.postCode:"");
			$("#consignee_add_countyId").val(addressInfo.areaId1);
			
			var countys = addressInfo.area3List;
			var areaList = new Array();
			areaList.push("<option value='0'>请选择</option>");
			for(var i=0;i<countys.length;i++){
				var county = countys[i];				
				if(county.areaId == addressInfo.areaId3){
					areaList.push("<option value="+county.areaId+" selected='selected'>"+county.areaName+"</option>");
				}else{
					areaList.push("<option value="+county.areaId+" >"+county.areaName+"</option>");
				}
			}
			$("#consignee_add_countyId").html(areaList.join(""));
			
			var communitys = addressInfo.communitysList;
			var areaList = new Array();
			areaList.push("<option value='0'>请选择</option>");
			for(var i=0;i<communitys.length;i++){
				var community = communitys[i];				
				if(community.communityId == addressInfo.communityId){
					areaList.push("<option value="+community.communityId+" selected='selected'>"+community.communityName+"</option>");
				}else{
					areaList.push("<option value="+community.communityId+" >"+community.communityName+"</option>");
				}
			}
			$("#consignee_add_CommunityId").html(areaList.join(""));
		}
	});
}
function saveAddress(){
	var seladdress = $('input:radio[name="seladdress"]:checked').val();
	var addressId = $("#consigneeId").val();
	var userName = $("#consignee_add_userName").val();
	var cityId = $("#consignee_add_cityId").val();
	var countyId = $("#consignee_add_countyId").val();
	var communityId = $("#consignee_add_CommunityId").val();
	var address = $("#consignee_add_address").val();
	var userPhone = $("#consignee_add_userPhone").val();
	var userTel = $("#consignee_add_userTel").val();
	var zipCode = $("#consignee_add_zipCode").val();
	var params = {};
	params.id = addressId;
	params.userName = jQuery.trim(userName);
	params.areaId2 = cityId;
	params.areaId3 = countyId;
	params.communityId = communityId;
	params.address = jQuery.trim(address);
	params.userPhone = jQuery.trim(userPhone);
	params.userTel = jQuery.trim(userTel);
	params.postCode = jQuery.trim(zipCode);
	
	if(addressId<1 && $("#seladdress_0").attr("checked")==false){
		layer.msg("请选择收货地址", 1, 8);
		return ;
	}
	if(params.userName==""){
		layer.msg("请输入收货人", 1, 8);
		return ;		
	}
	if(!WST.checkMinLength(params.userName,2)){
		layer.msg("收货人姓名长度必须大于1个汉字", 1, 8);
		return ;	
	}
	if(params.areaId2<1){
		layer.msg("请选择市", 1, 8);
		return ;		
	}
	if(params.areaId3<1){
		layer.msg("请选择区县", 1, 8);
		return ;		
	}
	if(params.communityId<1){
		layer.msg("请选择社区", 1, 8);
		return ;		
	}
	if(params.address==""){
		layer.msg("请输入详细地址", 1, 8);
		return ;		
	}
	if(userPhone=="" && userTel==""){
		layer.msg("请输入手机号码或固定电话", 1, 8);
		return ;		
	}
	if(userPhone!="" && !WST.isPhone(params.userPhone)){
		layer.msg("手机号码格式错误", 1, 8);
		return ;		
	}
	if(userTel!="" && !WST.isTel(params.userTel)){
		layer.msg("固定电话格式错误", 1, 8);
		return ;		
	}	
	if(zipCode!="" && $('#consignee_add_zipCode').val().length!=6){
		layer.msg("邮编格式不正确", 1, 8);
		return;
	}
	jQuery.post(rooturl+"/index.php/Home/UserAddress/edit" ,params,function(data,textStatus){	
		var json = WST.toJson(data);
		
		if(json.status>0){
			$("#consignee1").show();
			$("#consignee2").hide();
			var addressInfo = new Array();			
			addressInfo.push('<div>');
			addressInfo.push('<span style="font-weight: bold;">'+userName+'&nbsp;&nbsp;&nbsp;&nbsp;</span>');
			if(userPhone!=""){
				addressInfo.push(userPhone);
			}else{
				addressInfo.push(userTel);
			}				
			addressInfo.push('</div>');
			addressInfo.push('<div>');
			addressInfo.push($("#consignee_add_cityId").val());
			addressInfo.push($("#consignee_add_countyId").find("option:selected").text());
			addressInfo.push($("#consignee_add_CommunityId").find("option:selected").text());
			addressInfo.push(address+"&nbsp;&nbsp;&nbsp;&nbsp;");			
			addressInfo.push('</div>');		
			$("#showaddinfo").html(addressInfo.join(""));

			if(addressId==0){
				$("#consigneeId").val(json.status);
				var addressInfo = new Array();
				addressInfo.push('<div id="caddress_'+json.status+'">');										
				addressInfo.push('<label>');
				addressInfo.push('<input id="seladdress_'+json.status+'" onclick="changeAddress();" name="seladdress" type="radio" checked="checked" value="'+json.status+'"/>');
				addressInfo.push('<span style="font-weight: bold;"  id="radusername_'+json.status+'">'+userName+'&nbsp;&nbsp;&nbsp;&nbsp;</span>');
				addressInfo.push('<span id="radaddress_'+json.status+'">');
				addressInfo.push($("#consignee_add_cityId").val());
				addressInfo.push($("#consignee_add_countyId").find("option:selected").text());
				addressInfo.push($("#consignee_add_CommunityId").find("option:selected").text());
				addressInfo.push(address);	
				addressInfo.push("</span>");	
				if(userPhone!=""){
					addressInfo.push(userPhone);
				}else{
					addressInfo.push(userTel);
				}		
				
				addressInfo.push('<span class="optionspan" style="padding-left:50px;color: #999999">[<a onclick="javascript:;">修改</a>]</span>');
				addressInfo.push('<span class="optionspan" style="padding-left:10px;color: #999999">[<a onclick="javascript:delAddress('+json.status+');">删除</a>]</span>');
				addressInfo.push('</label>');
				addressInfo.push('</div>');			
				$(addressInfo.join("")).insertAfter("#flagdiv");
			}else{
				$("#radusername_"+addressId).html(params.userName);
				var addressInfo = new Array();
				addressInfo.push($("#consignee_add_cityId").val());
				addressInfo.push($("#consignee_add_countyId").find("option:selected").text());
				addressInfo.push($("#consignee_add_CommunityId").find("option:selected").text());
				addressInfo.push(params.address);	
				$("#radaddress_"+addressId).html(addressInfo.join(""));
			}
		}else{
			layer.msg("收货人信息添加失败", 1, 8);
		}
	});	
}
function addHour(hour){
    var d=new Date();
    d.setHours(d.getHours()+hour);
    var m=d.getMonth()+1;
    var year = d.getFullYear();
    var month = (m>=10?m:'0'+m);
    
    var day = (d.getDate()>=10)?d.getDate():"0"+d.getDate();
    var h = (d.getHours()>=10)?d.getHours():"0"+d.getHours();
    var min = (d.getMinutes()>=10)?d.getMinutes():"0"+d.getMinutes();
    return (year+'-'+month+'-'+day+" "+h+":"+min+":00");
  }

function delAddress(addressId){
	if(confirm('你确认要删除该地址？')){	
		jQuery.post(rooturl+"/index.php/Home/UserAddress/del" ,{id:addressId},function(rsp) {		
			if(rsp){
				$("#caddress_"+addressId).remove();
				$("#consigneeId").val(0);
				changeAddress();
			}else{
				layer.msg("删除失败", 1, 8);
			}    
		});
	}
	
}
function submitOrder(){
	var flag = true;
	$(".tst").each(function(){
		if($(this).val()==-1){			
			flag = false;
		}
	});
	if(!flag){
		layer.msg("抱歉，您的订单金额未达到该门店的配送订单起步价，不能提交订单。", 1, 8);
		return;
	}
	jQuery.post(rooturl+"/index.php/Home/Goods/checkGoodsStock" ,{},function(data) {
		var goodsInfo = WST.toJson(data);	
		var flag = true;
		for(var i=0;i<goodsInfo.length;i++){
			var goods = goodsInfo[i];			
			if(goods.isSale<1 || goods.goodsStock<=0){
				flag = false;							
			}
		}
		if(flag){
			var consigneeId = $("#consigneeId").val();	
			if(!$("#consignee2").is(":hidden")){
				layer.msg("请先保存收货人信息",1,8);
				return;
			}	
			var invoiceClient = $.trim($("#invoiceClient").val());	
			var rdate = $("#requestdate").val();
			var rtime = $("#requesttime").val();
			var requireTime = rdate+" "+rtime+":00";
			var payway = $('input:radio[name="payway"]:checked').val();
			var needreceipt = $('input:radio[name="needreceipt"]:checked').val();
			var isself = $('input:radio[name="isself"]:checked').val();
			var remarks = $.trim($("#remarks").val());
			var d1 = requireTime;	
			d1 = d1.replace(/-/g,"/");
			var date1 = new Date(d1);
			var d2 = addHour(1);	
			d2 = d2.replace(/-/g,"/");
			var date2 = new Date(d2);
			
			if(consigneeId<1){
				layer.msg("请填写收货人地址", 1, 8);
				return ;
			}
			if(needreceipt==1 && invoiceClient==""){
				layer.msg("请输入抬头", 1, 8);
				return ;		
			}
			if(date1<date2){
				layer.msg("期望送达时间必须设定为下单时间1小时后", 1, 8);
				return ;
			}
			if(!subCheckArea()){
				//layer.msg("商品不在配送区域内！");
				return ;
			}
			var url=rooturl+"/index.php/Home/Orders/submitOrder/?consigneeId="+consigneeId+"&payway="+payway+"&isself="+isself+"&invoiceClient="+invoiceClient+"&needreceipt="+needreceipt+"&remarks="+remarks;
			url += "&requireTime="+requireTime;
			url += "&invoiceClient="+invoiceClient;
			url += "&orderunique="+new Date().getTime();
			location.href= url;
		}else{
			if(goods.isSale<1){
				layer.msg('商品'+goods.goodsName+'已下架，请返回重新选购!', 1, 8);
			}else if(goods.goodsStock<=0){
				layer.msg('商品'+goods.goodsName+'库存不足，请返回重新选购!', 1, 8);
			}
		}
		
	});
	
	
}

function confrimOrder(){
	var orderNos = $("#orderNos").val();
	var orderIds = $("#orderIds").val();
	var totalMoney = $("#totalMoney").val();
	var payway = $('input:radio[name="payway"]:checked').val();
	var url="?c=goods&a=toCompletePay&orderNos="+orderNos+"&orderIds="+orderIds+"&totalMoney="+totalMoney+"&payway="+payway+"&rnd="+new Date().getTime();;

	return location.href= url;
}

function getOrderInfo(orderId){
	window.location = rooturl + '/index.php/Home/orders/getOrderInfo/?orderId=' + orderId;
}

$(function() {
	$('input:radio[name="needreceipt"]').click(function(){
		if($(this).val()==1){
			$("#invoiceClientdiv").show();
		}else{
			$("#invoiceClientdiv").hide();
		}		
	});
	
	$('input:radio[name="isself"]').click(function(){
		if($(this).val()==0){//送货上门
			$("#totalMoney_span").html($("#totalMoney").val());
			$("#pay_hd").attr("disabled",false);
			$("[id^=tst_]").val("-1");
			$("[id^=showwarnmsg_]").show();
			$("[id^=deliveryMoney_span_]").each(function(){
				var dvids = $(this).attr("id").split("deliveryMoney_span_");
				$(this).html($("#deliveryMoney_"+dvids[1]).val());
			});
		}else{//自提
			$("#totalMoney_span").html($("#gtotalMoney").val());
			$("#pay_ali").attr("checked",true);
			$("#pay_hd").attr("disabled",true);
			$("[id^=tst_]").val("1");
			$("[id^=showwarnmsg_]").hide();
			$("[id^=deliveryMoney_span_]").each(function(){
				var dvids = $(this).attr("id").split("deliveryMoney_span_");
				$(this).html("¥0");
			});
		}
	});
	
});
