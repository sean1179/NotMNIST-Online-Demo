const hua_img = document.getElementById("hua_img");
init_canvans();
var permit  = false;
var xmlhttp;
var event = window.event || event;  
const messstr={
	success:"我猜的对吗〜(￣△￣〜)",
	submitfail:"提交出错了Σ( ° △ °|||)︴,浏览器和服务器失联了",
	thanks:"╭(●｀∀´●)╯╰(●’◡’●)╮谢谢反馈"
}
function init_canvans(){
	let ctx = hua_img.getContext("2d");
	ctx.fillStyle = "black";
	ctx.fillRect(0, 0, 280, 280);
}
/**
 * 封装的Ajax函数  没有传递参数
 * @param {Object} method
 * @param {Object} url
 * @param {Object} fun
 */
function ajaxGson(method,url,fun){
	
	if (window.XMLHttpRequest)
	  {// code for IE7+, Firefox, Chrome, Opera, Safari
	  xmlhttp=new XMLHttpRequest();
	  }
	else
	  {// code for IE6, IE5
	  xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
	  }
	xmlhttp.onreadystatechange=fun;
	xmlhttp.open(method,url,true);
	xmlhttp.send();
}
/**
 * 封装的Ajax函数 有传递参数
 * @param {Object} method 	Post还是Get凡是上传
 * @param {Object} url		请求的路径
 * @param {Object} data		需要发送的数据
 * @param {Object} fun		请求返回操作函数
 */
function ajaxGsonHasData(method,url,data,fun){
	
	if (window.XMLHttpRequest)
	  {// code for IE7+, Firefox, Chrome, Opera, Safari
	  xmlhttp=new XMLHttpRequest();
	  }
	else
	  {// code for IE6, IE5
	  xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
	  }
	xmlhttp.onreadystatechange=fun;
	xmlhttp.open(method,url,true);
	xmlhttp.send(data);
}
eventUtil.addHandler(hua_img,'mousemove',function(event){
	coordinates = getThePointLocal(event);
	hua_img.dataset.x2 = coordinates["x"];
	hua_img.dataset.y2 = coordinates["y"];
	drawLine();
	drawArc();
	hua_img.dataset.x1 = coordinates["x"];
	hua_img.dataset.y1 = coordinates["y"];
	drawArc();
});
eventUtil.addHandler(hua_img,'mousedown',function(event){
	coordinates = getThePointLocal(event);
	hua_img.dataset.x1 = coordinates["x"];
	hua_img.dataset.y1 = coordinates["y"];
	whenMouseDown();
});
eventUtil.addHandler(hua_img,'mouseup',function(){
	whenMouseUp();
});
eventUtil.addHandler(hua_img,'mouseover',function(){
	whenMouseUp();
});
const submit_btn = document.getElementById("submit_btn");
eventUtil.addHandler(submit_btn,'click',function(){
	submitTheImg();
});
const clean_btn = document.getElementById("clean_btn");
eventUtil.addHandler(clean_btn,'click',function(){
	clearCanvas();
	init_canvans();
	cleanFeedBack()
});
function getThePointLocal(event){
	let x = event.clientX;
	let y = event.clientY;
	let father_container = document.getElementById("father_container");
	let elementx = (document.body.clientWidth/2)-140;
	let elementy = father_container.offsetTop+hua_img.offsetTop;
	let coordinates1 = document.getElementById("coordinates-1")
	//let coordinates2 = document.getElementById("coordinates-2")
	coordinates1.innerHTML = "x:"+(x-elementx)+"y:"+(y-elementy);
	//coordinates2.innerHTML = "x:"+elementx+"y:"+elementy;
	return {"x":(x-elementx),"y":(y-elementy)};
}
function drawLine(){
	if(permit){
		let context = hua_img.getContext("2d");
		context.beginPath();
		context.lineWidth = 40;
		context.moveTo(hua_img.dataset.x1,hua_img.dataset.y1);
		context.strokeStyle="white";
		context.lineTo(hua_img.dataset.x2,hua_img.dataset.y2);
		context.closePath();
		context.stroke();
		//console.log(hua_img.dataset)
	}
}
function drawArc(){
	if(permit){
		let context = hua_img.getContext("2d");
		context.beginPath();
		context.fillStyle="white";
		context.arc(hua_img.dataset.x1,hua_img.dataset.y1,20,0,2*Math.PI);
		//context.lineTo(num1+1,num2+1);
		context.closePath();
		context.fill();
		
	}
}
function clearCanvas(){
	let context = hua_img.getContext("2d");
	context.clearRect(0,0,280,280);
}
function whenMouseDown(){
	permit = true;
}
function whenMouseUp(){
	permit = false;
}
function submitTheImg(){
	let show = document.getElementById("show");
	let context = show.getContext("2d");
	context.clearRect(0,0,28,28);
	context.drawImage(hua_img,0,0,28,28);
	convertToBlob(show);
}

function convertToBlob(canvas){
	canvas.toBlob(function(blob) {
//		console.log(blob)
		let formdata = new FormData();
		formdata.set("notmnistimg",blob);
		ajaxGsonHasData('POST','./notmnist',formdata,function(){
			if (xmlhttp.readyState==4 && xmlhttp.status==200){
				showFeedback();
				changeMessage(messstr.success);
				let obj = JSON.parse(xmlhttp.responseText);
				obj["message"]?changeMessage(obj["message"]):createShowTbody(obj);
			}else if(xmlhttp.readyState==4 && xmlhttp.status !=200){
				changeMessage(messstr.submitfail);
			}
		})
	});
}
function createShowTbody(obj){
	let guess_tbody = document.getElementById("guess_tbody");
	guess_tbody.innerHTML="";
	let tr = document.createElement("tr");
	let td = document.createElement("th");
	td.innerHTML = "概率";
	tr.appendChild(td);
	let arr = new Array();
	for(var o in obj){
		td=document.createElement("td");
		td.innerHTML = obj[o];
		tr.appendChild(td);
		arr.push(obj[o]);
	}
	let max = arr.findIndex(function(value, index, arr) {return value == Math.max.apply(Math,arr);});
	let target = tr.childNodes[max+1];
	guess_tbody.appendChild(tr);
	target.style.backgroundColor = "#117A8B";
}
feedbackTable();
function feedbackTable(){
	var answer_btn = document.getElementById("answer_btns");
	
	eventUtil.addHandler(answer_btn,'click',function(){
		feedbackAjax();
	});
}
function feedbackAjax(){
	let show = document.getElementById("show");
	var answer_btns = document.getElementById("answer_btns").getElementsByTagName("input");
	show.toBlob(function(blob) {
		
//		console.log(blob)
		let formdata = new FormData();
		formdata.set("notmnistimg",blob);
		for( let i=0;i<answer_btns.length;i++){
			if(answer_btns[i].checked == true) formdata.set("answer",answer_btns[i].dataset.answer);
		}
		ajaxGsonHasData('POST','./labelnotmnist',formdata,function(){
			if (xmlhttp.readyState==4 && xmlhttp.status==200){
				changeMessage(messstr.thanks);
			}else if(xmlhttp.readyState==4 && xmlhttp.status !=200){
				changeMessage(messstr.submitfail);
			}
		})
	});
}
function changeMessage(message){
	let messdiv = document.getElementById("message");
	messdiv.innerHTML = message;
}
function showFeedback(){
	let feedback = document.getElementById("feedback");
	feedback.style.display = "flex";
}
function cleanFeedBack(){
	var answer_labels = document.getElementById("answer_btns").getElementsByTagName("label");
	for (let i =0;i<answer_labels.length;i++) {
		answer_labels[i].className = "btn btn-secondary";
	}
}