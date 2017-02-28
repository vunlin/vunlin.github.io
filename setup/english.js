var note = {};
note['summary'] = {};
note['summary']['s1'] = {};
note['summary']['s1']['structure'] = {
	'1' : 's',
	'2' : 'v',
	'3-7' : 'o',
	'8-13' : 'c',
	'14-17' : 'c',
	'18-21' : 'c',
	'22-26' : 'cc'
};
//pos - part of speech
note['summary']['s1']['pos'] = {
	'1' : 'noun-subject',
	'2' : 'linking verb',
	'3' : 'determiner',
	'4' : 'adjective',
	'5' : 'adjective',
	'6' : 'adjective',
	'7' : 'noun-object'
};

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

note.populate = function(){
	vaid.off();
	var struc = note['summary']['s1']['structure'];
	for (var key in struc) {
		var span = key.split("-");
		if(span.length==1){
			var element = $("p span:nth-child(" 
				+ span[0] + ")");
			element.addClass("alone");
			var content = struc[key];
			element.attr("data-analysis", content);
		}
		if(span.length==2){
			var uid = generateUUID();
			var head = span[0];
			var tail = span[1];
			var content = struc[key];

			var element = $("p span:nth-child(" 
				+ head + ")");
			element.addClass("head");
			element.attr("data-analysis", content);
			element.attr("data-uid", uid);
			

			var element = $("p span:nth-child(" 
				+ tail + ")");
			element.addClass("tail");
			element.attr("data-analysis", content);
			element.attr("data-uid", uid);
			
			var end = parseInt(tail);
			var start = parseInt(head) + 1;
			for(;start<end;start++){
				var element = $("p span:nth-child(" 
				+ start + ")");
				element.addClass("cross");
				element.attr("data-analysis", content);
				element.attr("data-uid", uid);
			}
		}
	}

	// register hover event
	$("span i").hover(function(event){
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
		var infoBox = $(this).parent();
		tooltipElement.text(infoBox.attr("data-analysis"));

		var uid = infoBox.attr("data-uid");
		if(uid != undefined){
			$("span[data-uid=" + uid +"]").find("i").each(function(){
				$(this).css("border-color", "yellow");	
			})
		}
		else{		
			$(this).css("border-color", "yellow");
		}
	});
	$("span b").mouseout(function(event){
		var tooltipElement = $("#tooltip");
		tooltipElement.css("display", "none");
		var infoBox = $(this).parent();
		var uid = infoBox.attr("data-uid");
		if(uid != undefined){
			$("span[data-uid=" + uid +"]").find("i").each(function(){
				$(this).css("border-color", "orange");			
			})
		}
		else{		
			$(this).css("border-color", "orange");		
		}
	});
	$("span i").mouseout(function(event){
		var tooltipElement = $("#tooltip");
		tooltipElement.css("display", "none");
		var infoBox = $(this).parent();
		var uid = infoBox.attr("data-uid");
		if(uid != undefined){
			$("span[data-uid=" + uid +"]").find("i").each(function(){
				$(this).css("border-color", "red");			
			})
		}
		else{		
			$(this).css("border-color", "red");		
		}
	});
}
