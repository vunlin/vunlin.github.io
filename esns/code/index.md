<style>
	pre {
		counter-reset: sourcecode;
		-moz-tab-size:4;
		-o-tab-size:4;
		tab-size:4;
		font-size:12px;
	}
	pre code:before {
		content: counter(sourcecode);
		counter-increment: sourcecode;
		padding-right:10px;
		display:inline-block;
		height:10px;
		width:35px;
	}

	pre code span.esns {
		color:red;
	}

</style>
[best practice for code example](https://www.sitepoint.com/best-practice-for-code-examples/)
	
<pre id="scriptFile"></pre>

```javascript
function syntaxhighlight(){
	var a = b + c;
	console.log(c);ss
}
```

<script
  src="https://code.jquery.com/jquery-3.3.1.min.js"
  integrity="sha256-FgpCb/KJQlLNfOu91ta32o/NMZxltwRo8QtmkMRdAu8="
  crossorigin="anonymous"></script>
<script>
//$( "#content" ).load( "/load.html #list" );
$( "#scriptFile" ).load("./sizzle/sizzle.js", function() {
  var _pre = $("#scriptFile");
  var styled_pre = "<code class='line'>"+(_pre.text().split("\n").filter(Boolean).join("</code>\n<code class='line'>"))+"</code>";
  styled_pre = styled_pre.replace(/(\/\/esns[^\n]+\n)/ig, "<span class='esns'>$1</span>");
  _pre.html(styled_pre);
});
</script>