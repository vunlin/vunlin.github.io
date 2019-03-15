<style>
	pre {
		counter-reset: sourcecode
	}
	pre code:before {
		content: counter(sourcecode);
		counter-increment: sourcecode;
		padding-right:10px;
		display:inline-block;
		height:10px;
		width:40px;
	}

</style>
<pre id="scriptFile"></pre>

```javascript
function syntaxhighlight(){
	var a = b + c;
	console.log(c);
}
```

<script src="./jquery-3.3.1.js"></script>
<script>
//$( "#content" ).load( "/load.html #list" );
$( "#scriptFile" ).load("./sizzle.js", function() {
  var _pre = $("#scriptFile");
  var styled_pre = "<code class='line'>"+(_pre.text().split("\n").filter(Boolean).join("</code>\n<code class='line'>"))+"</code>";
  _pre.html(styled_pre);
  console.log(styled_pre);
});
</script>