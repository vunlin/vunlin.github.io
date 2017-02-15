var note = {};
note['summary'] = {};
note['summary']['s1'] = {};
note['summary']['s1']['structure'] = {
	'1' : 's',
	'2' : 'v',
	'3-7' : 'o',
	'8-13' : 'c',
	'14-17' : 'c',
	'18-20' : 'c',
	'21-25' : 'cc'
};

note['summary']['s1']['pos'] = {
	'1' : 'noun-subject',
	'2' : 'linking verb',
	'3' : 'determiner',
	'4' : 'adjective',
	'5' : 'adjective',
	'6' : 'adjective',
	'7' : 'noun-object'
};

note.populate = function(){
	console.log(note);
}

$(document).ready(function(){
	note.populate();
	$(".s1 i span").hover(function(event){
		var pos = $(this).offset();
		var x = parseInt(pos.top);
		var y = parseInt(pos.left);
		
		$("#tooltip").css("display", "block");
		$("#tooltip").css("top",  (x-32) +"px");
		$("#tooltip").css("left", (y+10) +"px");
		var bottom = $(this).css("bottom");
		if(bottom == '-5px'){
			$("#tooltip").css("top",  (x+10) +"px");
		}
		$(this).css("border-color", "green");

		$("#tooltip").text("tooltip");
	});
	$(".s1 i span:nth-child(1)").mouseout(function(event){
		$(this).css("border-color", "orange");		
		$("#tooltip").css("display", "none");
	});
	$(".s1 i span:nth-child(2)").mouseout(function(event){
		$(this).css("border-color", "red");	
		$("#tooltip").css("display", "none");	
	});
})
/*
Rule 2. Use a comma to separate two adjectives when the order of the adjectives is interchangeable.

Example: He is a strong, healthy man.
We could also say healthy, strong man.

Example: We stayed at an expensive summer resort.
We would not say summer expensive resort, so no comma.
*/

