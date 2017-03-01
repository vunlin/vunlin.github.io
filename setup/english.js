function generateUUID () { // Public Domain/MIT
    var d = new Date().getTime();
    if (typeof performance !== 'undefined' && typeof performance.now === 'function'){
        d += performance.now(); //use high-precision timer if available
    }
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
}

var showNote = function(){
	vaid.off();
	var pElements = $("#plot p");
	for(var index in note){
		var struc = note[index]['structure'];
		var partOspeech = note[index]['pos'];
		var pIndex = parseInt(index) -1;
		var pElement = pElements[pIndex];
		for (var key in struc) {
			var span = key.split("-");
			if(span.length==1){
				var element = $(pElement).find("span:nth-child(" 
					+ span[0] + ")").find("b");
				element.addClass("alone");
				var content = struc[key];
				element.attr("data-analysis", content);
			}
			if(span.length==2){
				var uid = generateUUID();
				var head = span[0];
				var tail = span[1];
				var content = struc[key];

				// head
				var element = $(pElement).find("span:nth-child(" 
					+ head + ")").find("b");
				element.addClass("head");
				element.attr("data-analysis", content);
				element.attr("data-uid", uid);
				
				// tail
				var element = $(pElement).find("span:nth-child(" 
					+ tail + ")").find("b");
				element.addClass("tail");
				element.attr("data-analysis", content);
				element.attr("data-uid", uid);
				
				var end = parseInt(tail);
				var start = parseInt(head) + 1;
				for(;start<end;start++){
					var element = $(pElement).find("span:nth-child(" 
					+ start + ")").find("b");
					element.addClass("cross");
					element.attr("data-analysis", content);
					element.attr("data-uid", uid);
				}
			}
		}

		for (var key in partOspeech) {
			var span = key.split("-");
			if(span.length==1){
				var element = $(pElement).find("span:nth-child(" 
					+ span[0] + ")").find("i");
				element.addClass("alone");
				var content = partOspeech[key];
				element.attr("data-analysis", content);
			}
			if(span.length==2){
				var uid = generateUUID();
				var head = span[0];
				var tail = span[1];
				var content = struc[key];

				// head
				var element = $(pElement).find("span:nth-child(" 
					+ head + ")").find("i");
				element.addClass("head");
				element.attr("data-analysis", content);
				element.attr("data-uid", uid);
				
				// tail
				var element = $(pElement).find("span:nth-child(" 
					+ tail + ")").find("i");
				element.addClass("tail");
				element.attr("data-analysis", content);
				element.attr("data-uid", uid);
				
				var end = parseInt(tail);
				var start = parseInt(head) + 1;
				for(;start<end;start++){
					var element = $(pElement).find("span:nth-child(" 
					+ start + ")").find("i");
					element.addClass("cross");
					element.attr("data-analysis", content);
					element.attr("data-uid", uid);
				}
			}
		}
	}

	// register hover event
	$("span i, span b").hover(function(event){
		var pos = $(this).offset();
		var x = parseInt(pos.top);
		var y = parseInt(pos.left);
		
		var tooltipElement = $("#tooltip");
		tooltipElement.css("display", "block");
		tooltipElement.css("top",  (x-32) +"px");
		tooltipElement.css("left", (y+10) +"px");
		var bottom = $(this).css("bottom");
		if(bottom == '-5px'){
			tooltipElement.css("top",  (x+10) +"px");
		}
		var infoBox = $(this);
		tooltipElement.text(infoBox.attr("data-analysis"));

		var uid = infoBox.attr("data-uid");
		if(uid != undefined){
			$("span b[data-uid=" + uid +"]").each(function(){
				$(this).css("border-color", "yellow");	
			})
		}
		else{		
			$(this).css("border-color", "yellow");
		}
	});
	$("span i").mouseout(function(event){
		var tooltipElement = $("#tooltip");
		tooltipElement.css("display", "none");
		var infoBox = $(this);
		var uid = infoBox.attr("data-uid");
		console.log(uid);
		if(uid != undefined){
			$("i[data-uid=" + uid +"]").each(function(){
				$(this).css("border-color", "orange");			
			})
		}
		else{		
			$(this).css("border-color", "orange");		
		}
	});
	$("span b").mouseout(function(event){
		var tooltipElement = $("#tooltip");
		tooltipElement.css("display", "none");
		var infoBox = $(this);
		var uid = infoBox.attr("data-uid");
		if(uid != undefined){
			$("b[data-uid=" + uid +"]").each(function(){
				$(this).css("border-color", "red");			
			})
		}
		else{		
			$(this).css("border-color", "red");		
		}
	});
}

// prepare plot 
$(document).ready(function(){
	var paras = $("#plot p");
	for(var i=0; i<paras.length; i++){
		var para = paras[i];
		sentence = para.innerHTML.replace(", ", " , ");
		var words = sentence.split(" ");

		var assembler = "";
		for(var j=0; j<words.length; j++){
			assembler += "<span><b></b>"
					  + (words[j]) 
					  + " <i></i></span>";
		}
		para.innerHTML = assembler;
	}
})

// visual aid
var vaid = {
	on: function(){
		$("p span").removeClass();
		$("#plot p").each(function(){
			$(this).find("span i").each(function(i){
				$(this).addClass("vaid");
				$(this).html(i+1);
			})
		})
	},

	off: function(){
		$("#plot p span i.vaid").each(function(i){
			$(this).html("");
			$(this).removeClass("vaid");
		})
	}
}

$(document).ready(function(){
	showNote();
	//vaid.on();
})