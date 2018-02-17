var eventUtil = {
	//添加句柄
	addHandler: function(element, type, handler) {
		if(element.addEventListener) {
			element.addEventListener(type, handler, false);
		} else if(element.attachEvent) {
			element.attachEvent('on' + type, handler);
		} else { //由于此时不能使用点号连接，所以使用中括号，element.onclick等价于element['onclick']
			element['on' + type] = handler;
		}
	},
	removeHandler: function(element, type, handler) {
		if(element.removeEventListener) {
			element.removeEventListener(type, handler, false);
		} else if(element.detachEvent) {
			element.detachEvent('on' + type, handler);
		} else { //由于此时不能使用点号连接，所以使用中括号，element.onclick等价于element['onclick']
			element['on' + type] = null;
		}
	},
	getEvent:function(event){
		return event?event:window.event;
		//也可以写成这种形式 var event = event||window.event; 
	},
	getType:function(event){
		return event.type;
	},
	getElement:function(event){
		return event.target || event.srcElement;
	},
	preventDefult:function(event){
		if(event.preventDefault){
			//alert("想知道这个什么能力测试是什么鬼"+event.preventDefault)
			//好像返回的就是这个方法的具体代码，不记得了就再打开看看
			event.preventDefault();
		}else{
			event.returnValue = false;
		}
		
	},
	stopPropagation:function(event){
		if(event.stopPropagation){
			event.stopPropagation()
		}else{
			event.cancelBubble=true;
		}
	}
}