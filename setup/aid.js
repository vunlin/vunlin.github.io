$(document).ready(function(){
	var paras = $("#plot p");
	for(var i=0; i<paras.length; i++){
		var para = paras[i];
		sentence = para.innerHTML.replace(", ", " , ");
		var words = sentence.split(" ");

		var assembler = "";
		for(var j=0; j<words.length; j++){
			assembler += "<span><b></b> "
					  + (words[j]) 
					  + " <i></i></span>";
		}
		para.innerHTML = assembler;
	}
})

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
	//vaid.on();
	note.populate();
})