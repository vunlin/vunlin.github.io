### HTML 元素Elements 标签Tags 属性Attributes 

### Non-Tag 非标签

!doctype

是否必须有:  是

doctype 不是HTML标签, 用于指示浏览器这个HTML文档用的是哪一个版本, 没有或者提供不正确版本可能导致浏览器采取"怪异模式(quirk mode)"来解析HTML文件, 导致不良情况.

属性

xmlns: 文档的xml的命名空间, xhtml文件必须有, html文件不要有

html 5 的版本例子
<!doctype html> 

### Root 底层

html (head > body)

是否必须有:  是

html 是最外层标签, 包含所有其他标签

<html>
	<head>...</head>
	<body>...</body>
</html>

head 

是否必须有:  是

html标签里的第一个标签元素, 用于包含Metadata标签元素

body

是否必须有:  是

紧跟head标签之后的第二个标签元素, 用于包含内容相关的元素

属性

windowEventHandler (onload, onunload etc)

### Metadata

title

是否必须有:  是

文档标题

base

是否必须有:  否

定义相对链接的基础URL

属性

href: 基础URL
target: _blank - 打开在新建文档, _self - 打开在自身文档
        _parent - 打开在上一级文档, _top - 打开在最上级文档


link

是否必须有:  否

用于连接外界资源, 并阐述与当前文档的关系, 最常用于引进CSS文件

属性

href: 外界资源地址
crossorigin: anonymous - 匿名方式, use-credentials - 验证方式(通过cookie等发送验证资料) 
rel: 定义文件关系 (styleshee, icon, tag, author, etc... many more)
media: 应用于那些设备上 all-所有, print-打印模式, screen-屏幕, speech-语言合成机器
hreflang: 文档语言
type: 定义资源的 MIME type格式,  text/html, text/css 等等
sizes: 如果是icon的话, 必须有. any-可以由浏览器使用任何尺寸, 使用数字-32x32 32X32 64x64 等等
title: 这里的title比较特殊, 定义想要和额外的可以挑选的CSS文件
<href="reset.css" rel="stylesheet" type="text/css">
<link href="default.css" rel="stylesheet" type="text/css" title="Default Style">
<link href="fancy.css" rel="alternate stylesheet" type="text/css" title="Fancy">
<link href="basic.css" rel="alternate stylesheet" type="text/css" title="Basic">

meta

是否必须有:  否

用于表达其他metadata标签无法表达的信息

属性
name: 元数据名字
http-equiv:  HTTP header: 区域开头部分名字, 这就是为什么叫做 http-equivalent.
	content-security-policy - 定义防止: 区域结尾部分xss跨站攻击的政策
	例子: connect-src http://example.com/: 联系方式部分
		  script-src http://example.com/
	refresh - 过多久就要刷新	  


content: 元数据内容
charset: 阐述文件使用什么字符集, 推荐使用utf-8 
name: 自定义信息
<meta name="description" content="Free Web tutorials">
<meta name="keywords" content="HTML,CSS,JavaScript">
<meta name="author" content="John Doe">
<meta name="viewport" content="width=device-width, initial-scale=1.0">

style

是否必须有:  否

包含CSS规则

属性
media: 应用于那些设备上 all-所有, print-打印模式, screen-屏幕, speech-语言合成机器
nonce: style-src 防止跨站攻击的密匙
type: 定义资源的 MIME type格式,  text/html, text/css 等等
title: 这里的title比较特殊, 定义想要和额外的可以挑选的CSS文件

==========================================================

### Sectioning

article: 整个文档中各个文章
section: 文档中的分区
nav: 用于描述网页链接
aside: 相关联旁白信息
header: 区域开头部分
footer: 区域结尾部分
address: 联系方式部分

### Heading

h1, h2, h3, h4, h5, h6: 6个不同等级的标题

### Embedded 内嵌元素

picture (source): 包含几个图片, 按照不同情况使用不同图片, 比如如果是手机设备使用小尺寸图片
	<picture>
	  <source 
	    media="(min-width: 650px)"
	    srcset="images/kitten-stretching.png">
	  <source 
	    media="(min-width: 465px)"
	    srcset="images/kitten-sitting.png">
	  <img 
	    src="images/kitten-curled.png" 
	    alt="a cute kitten">
	</picture>

source: 定义不同资源给于 picture, audio 和 video
	srcset - 按照不同条件(屏幕大小)载入不同图片
	sizes - 按照不同条件(屏幕大小)*最终实际使用*不同图片*大小*
	media - 设备类型 (screen, speech, all etc)
	type - MIME 类型 (image/png image/jpeg etc)
	src - 资源链接, 只用于audio 和 video
	<img srcset="elva-fairy-320w.jpg 320w,
	             elva-fairy-480w.jpg 480w,
	             elva-fairy-800w.jpg 800w"
	     sizes="(max-width: 320px) 280px,
	            (max-width: 480px) 440px,
	            800px"
	     src="elva-fairy-800w.jpg" alt="Elva dressed as a fairy">

img: 图片资源 
	alt - 当图片资源不可以的时候(链接不正确,类型不支持), 使用的代替文字
	src - 资源链接
	srcset - 按照不同条件(屏幕大小)载入不同图片
	sizes - 按照不同条件(屏幕大小)*最终实际使用*不同图片*大小*
	crossorigin - anonymous: 匿名方式, use-credentials: 验证方式(通过cookie等发送验证资料) 
	usemap - client-side map 图片名字
	ismap - 该图片是否是server-side map
	width - 宽度
	height - 高度

iframe: 内嵌网页
	src - 资源链接
	srcdoc - 在支持sandbox的HTML5 浏览器中 覆盖 override src资源链, 来保护使用旧浏览器的用户
			https://stackoverflow.com/questions/19739001/which-is-the-difference-between-srcdoc-and-src-datatext-html-in-an

	name - 名字
	sandbox - 定义那些操作可用使用 (allow-forms, allow-modals, allow-popups etc)
	allowfullscreen - 是否允许使用 requestFullscreen() 变成全屏
	width - 宽度
	height - 高度

embed: 外界程序, 或者可以说是plug-in
	src - 资源链接
	type - MIME 类型
	width - 宽度
	height- 高度

object (param): 外界资源, 程序网页等等
	data - 资源链接
	type - MIME 类型
	typemustmatch - 是否 type所讲的MIME类型 要跟实际资源类型 相符合
	name - 名字
	form - 表单
	width - 宽度
	height - 高度

	param: 内嵌资源参数
	name - 名字
	value - 数值

video (source, track): 内置影片资源
	src - 资源链接
	crossorigin - 定义怎么处理cross origin情况
	poster - 用影片的哪一个frame来当做封面
	preload - 要预先下载多少(0%-100%)
	autoplay - 是否载入后立即播放
	loop - 是否重复播放
	muted - 是否一开始静音
	controls - 是否显示用户控制面板
	width - 宽度
	height - 高度

	source: 可以用来根据不同情况(宽带大小 MIME类型等等)使用不同资源链接
	track: 时间文字 Web Video Text Tracks. webvtt .vtt 文件

		kind - 文字类型, 默认为subtitle翻译字幕, caption(cc 内置字幕)
				decription(描述), chapter(章节标题), metadata(一些脚本script用的数据)
		src - 文字资源链接
		srclang - 文字语言
		label - 文字标题
		default - 默认文字

		WEBVTT
		00:01.000 --> 00:04.000
		Never drink liquid nitrogen.

		00:05.000 --> 00:09.000
		- It will perforate your stomach.
		- You could die.

	<video controls poster="/images/sample.gif">
	   <source src="sample.mp4" type="video/mp4">
	   <source src="sample.ogv" type="video/ogv">
	   <track kind="captions" src="sampleCaptions.vtt" srclang="en">
	   <track kind="descriptions" src="sampleDescriptions.vtt" srclang="en">
	   <track kind="chapters" src="sampleChapters.vtt" srclang="en">
	   <track kind="subtitles" src="sampleSubtitles_de.vtt" srclang="de">
	   <track kind="subtitles" src="sampleSubtitles_en.vtt" srclang="en">
	   <track kind="subtitles" src="sampleSubtitles_ja.vtt" srclang="ja">
	   <track kind="subtitles" src="sampleSubtitles_oz.vtt" srclang="oz">
	   <track kind="metadata" src="keyStage1.vtt" srclang="en" label="Key Stage 1">
	   <track kind="metadata" src="keyStage2.vtt" srclang="en" label="Key Stage 2">
	   <track kind="metadata" src="keyStage3.vtt" srclang="en" label="Key Stage 3">
	</video>

audio (source, track): 内置声音资源
map (area): 图像地图 image's map
	name - usemap 用的地图名字
	<map name="primary">
	  <area shape="circle" coords="75,75,75" href="left.html">
	  <area shape="circle" coords="275,75,75" href="right.html">
	</map>
	<img usemap="#primary" src="http://placehold.it/350x150" alt="350 x 150 pic">

area: 定义地图用于图像
	alt - 图片不能显示时候用的文字
	coords - 各种形状使用的不同坐标
	download - 是否下载链接的资源
	href - 资源链接
	hreflang - 资源语言
	rel - 资源与本文档的关系
	shape - circle圆, rectangle长方形, poly多边形, default全部
	target - 在哪个页面打开
	type - MIME 类型

SVG: vector drawing
canvas: raster drawing
webGL: 3D drawing

### Phrasing 

{semantic}
a: 其他资源的超链接
	href - 超链接地址
	target - 在哪个页面打开
	download - 下载超链接文件,而不是移动到这个超链接, 文件默认命名,用户可以修改,只可以在same origin URL使用
	rel — 超链接文件跟本文档关系
	hreflang - 超链接文件语言
	type - MIME 类型提示

em: 强调
strong: 加重
small: 小型
s: 中划线 strikethrough
cite: 引用
q: inline quote (as oppose to block : blockquote)
dfn: inline definition (as oppose to list: dl)
abbr: 简写
	title - 详细信息 
	<abbr title="Laugh Out Loud">LOL</abbr>
	<abbr title="Internationalization">I18N</abbr>

ruby (rb, rt, rtc, rp): ruby注解, 用于亚洲文字发音
	<ruby>
	  漢 <rp>(</rp><rt>Kan</rt><rp>)</rp>
	  字 <rp>(</rp><rt>ji</rt><rp>)</rp>
	</ruby>
	<ruby>
	  明日 <rp>(</rp><rt>Ashita</rt><rp>)</rp>
	</ruby>

data: 代表机器可以明白的数据
	value - 数据
	<p>New Products</p>
	<ul>
	 <li><data value="398">Mini Ketchup</data></li>
	 <li><data value="399">Jumbo Ketchup</data></li>
	 <li><data value="400">Mega Jumbo Ketchup</data></li>
	</ul>

time: 时间
	datetime - 1582-03-01, 0033-03-27, or 2016-03-01, 1929-11-13T19:00Z, 0325-06-03T00:21+10:30
	<p>The concert took place on <time datetime="2001-05-15T19:00">May 15</time>.</p>

code: 代码 <code>var i = 0;</code>
var: 变量 <p> A simple equation:<var>x</var> = <var>y</var> + 2 </p>
samp: 电脑输出样式
kbd: 用户输入样式
sub, sup: 下降上升格式
i: 斜体
b: 粗体
u: 下划体
mark: 高亮体 highlighted
bdi: bidirectional isolation 字体方向细微控制
bdo: bidirectional override 字体方向细微控制
span: 通用线体 generic inline container
br: line break 
wbr: <wbr> tells the browser that if a line of text is too long, 
	 a word can be broken in half where the <wbr> is.

{edits}
ins: 添加
	cite - 文档URL解释为什么添加
	datetime - 时间
del: 删除
	cite - 文档URL解释为什么删除
	datetime - 时间
	
### Interactive

details (summary) 提供更多详细信息
	open: 默认false, 是否展示除了summary以外的详细信息, 在页面载入后
	
	<details>
	  <summary>Some details</summary>
	  <p>More info about the details.</p>
	</details>

	<details open>
	  <summary>Even more details</summary>
	  <p>Here are even more details about the details.</p>
	</details>

menu (menuitem)
	type - context, menu 
	label - 用户可见标题
	
	<div contextmenu="popup-menu">
	  Right-click to see the adjusted context menu
	</div>

	<menu type="context" id="popup-menu">
	  <menuitem>Action</menuitem>
	  <menuitem>Another action</menuitem>
	  <hr>
	  <menuitem>Separated action</menuitem>
	</menu>

{Grouping}
p: 段落
hr: 分段或者换区
pre: 按源码排列方式
blockquote: 节选段落
	cite - 此节选的URL

ol (li): 有序的数列
	reversed - 是否倒着数
	start - 第一位有几数起
	type - 序的格式 'a' 小写字母,
					'A' 大写字母,
					'i' 小写罗马数字,
					'I' 大写罗马数字,
					'1' 数字 (default).

ul (li): 无序的数列

li: 数列中的元素
	value - 仅在ol中, 代表这是第几个元素
	<ol type="I">
	    <li value="3">third item</li>
	    <li>fourth item</li>
	    <li>fifth item</li>
	</ol>


dl (dt, dd): 定义列表(标题,定义)
	<dl>
	  <dt>Firefox</dt>
	  <dd>
	    A free, open source, cross-platform,
	    graphical web browser developed by the
	    Mozilla Corporation and hundreds of
	    volunteers.
	  </dd>
	</dl>

figure (figcaption): 图像代码等等(标题)
	<figure>
	  <img
	  src="https://developer.cdn.mozilla.net/media/img/mdn-logo-sm.png"
	  alt="An awesome picture">	
	  <figcaption>MDN Logo</figcaption>
	</figure>
main: 文档主体区域
div: 无语义分区

{tabular data}
table: 表格
caption: 表格标题title
colgroup: 配合col定义有限的column格式
col: 定义每个或者连续几个column格式
tbody: body区
thead: head区
tfoot: foot区
tr: table row
td: table data
th: table header

{form}
form: 表单提交
	accept-charset - 使用什么字符集
	action - 提交表单到哪个链接
	autocomplete - 是否自动由浏览器填写资料,用户名和密码都会出现提示不管你的设置
	enctype - method是Post的提交方式类型
		application/x-www-form-urlencoded, multipart/form-data, text/plain (HTML5)
		https://stackoverflow.com/questions/4007969/application-x-www-form-urlencoded-or-multipart-form-data

	method - 提交方式 post: data embed in body, get: data constructed as query string
	name - 表单名字
	novalidate - 无需要通过表单要求
	target - 用什么页面方式提交

label: 标签
	for - 跟哪个控件相关, 增加radio, checkbox控件的点击范围
	<label for="username">Click me</label>
	<input type="text" id="username">

input: 通用的控件 (type - 控件类型)
	select(), selectionStart, selectionEnd, selectionDirection
	setRangeText(replacement), setSelectionRange(start, end)

	button: 普通按钮 
		value - 按钮上面的文字
	submit: 提交按钮
		value - 按钮上面的文字
	reset: 重置按钮
		value - 按钮上面的文字
	image: 图像提交submit按钮
		src - 图像URL
		alt - 图像不能载入时候使用的文字
		width - 宽度
		height - 高度

	checkbox: 复选框
		checked - 是否被选
	radio: 单选框
		checked - 是否被选
		name - 把这个单选框归入一个组中 radio group name
		value - 数值
	
	color: 颜色挑选
		value - #加上六位数 <input type="color" value="#ff0000">
	date: 日期挑选
		value - 日期数值 <input id="date" type="date" value="2017-06-01">
		min - 最早可用日期值
		max - 最迟可用日期值
		<input type="date" id="party" name="party" min="2017-04-01" max="2017-04-20">
		pattern - 要求的格式
		<input type="date" id="bday" name="bday" pattern="[0-9]{4}-[0-9]{2}-[0-9]{2}">

	datetime-local: 日期加上时间(hh:mm:AM/PM), 没有时间区域timezone
		min - 最早可用日期值
		max - 最迟可用日期值
		<input type="datetime-local" min="2017-06-01T08:30" max="2017-06-30T16:30">

	month: 年和月的日期
		value - 日期数值
		min - 最早可用日期值
		max - 最迟可用日期值
	
	time: 时间控件, 一般只有HH:MM:A/PM, 要加秒的话, 要用step
	week: 星期年份控件

	email: 电子邮箱
		multiple - 允许0到多个邮箱数值 "me@example.org,you@example.org,us@example.org"
		placeholder - 提示用的标签 <input type="email" placeholder="sophie@example.com">
		size - 控件的实际长度, 但不限制数据长度
		minlength - 最短数据长度
		maxlength - 最长数据长度
		<input type="email" size="32" minlength="3" maxlength="64">

	file: 当地文件
		multiple - 允许使用多个文件
		accept - 接受什么格式的文件
		<input type="file" multiple accept=".jpg, .jpeg, .png">

	hidden: 隐藏控件, 看不见但是有输送数值给服务器

	number: 数字控件
		min - 最早可用日期值
		max - 最迟可用日期值
		step - 上调和下调指针每一点击的数值
		<input type="number" placeholder="multiple of 10" step="10">

	password: 密码控件,输入后自动隐藏
		required - 必须填写
		minlength - 最短数据长度
		maxlength - 最长数据长度
		autocomplete - 自动由浏览器填写, on(填写目前密码), off(不填写)
						current-password(填写目前密码more informative), new-password(填写新密码)
		inputmode - 使用哪种键盘输入, <input id="pin" type="password" inputmode="numeric">
					手机会提供数字小键盘输入(tel, email, url etc...)

	range: 滑竿slider or dial 数值控件给不重要的数据
		min - 最早可用日期值
		max - 最迟可用日期值
		step - 上调和下调指针每一点击的数值
		list - 指示用哪个datalist

	text: 普通文字

	search: 搜索控件, 跟普通text控件最主要区别是浏览器会添加一个X号在控件里面
		<input type="search" id="mySearch" name="q" placeholder="Search the site...">
	
	tel: 电话, 手机上会使用电话键盘来输入
		pattern - 设定符合的格式

	url: 链接

	通用属性
	disabled - 禁用
	required - 必须有数值
	name - 名字,用于脚本操作	
	readonly - 是否允许用户修改数值
	autofocus - 自动把光标移动到该控件,在页面载入完毕之后
	list - 推荐数据datalist 
	
	表格提交属性
	form - Associates the control with a form element
	formaction - URL to use for Form submission
	formenctype - Form data set encoding type to use for Form submission
	formmethod - HTTP method to use for Form submission
	formnovalidate - Bypass form control validation for Form submission
	formtarget - browsing context for Form submission

button 按钮
	autofocus - 自动把光标移动到该控件,在页面载入完毕之后
	disabled - 禁用
	form - Associates the control with a form element
	formaction - URL to use for Form submission
	formenctype - Form data set encoding type to use for Form submission
	formmethod - HTTP method to use for Form submission
	formnovalidate - Bypass form control validation for Form submission
	formtarget - browsing context for Form submission
	menu - Specifies the element’s designated pop-up menu
	name - 名字
	type - submit, reset, button(default)
	value - 数值

select (optgroup->option) 数据组
	autofocus
	disabled
	form - 数据给哪个表格
	multiple - 允许多项
	name - 名字
	required 
	size

	<select>
	  <optgroup label="Swedish Cars">
	    <option value="volvo" disabled>Volvo</option>
	    <option value="saab">Saab</option>
	  </optgroup>
	  <optgroup label="German Cars">
	    <option value="mercedes">Mercedes</option>
	    <option value="audi" label="Audi">Bad Word</option>
	  </optgroup>
	</select>

	optgroup
		disabled
		label - 分组的文字
	option
		disabled
		label - 代替Text的文字
		selected 
		value
	
datalist (option) 给各种控件提供的列表
	<datalist id="browsers">
	  <option value="Chrome">
	  <option value="Firefox">
	  <option value="Internet Explorer">
	</datalist>

textarea 文字区
	select(), selectionStart, selectionEnd, selectionDirection
	setRangeText(replacement), setSelectionRange(start, end)
	autocomplete - on, off
	autofocus
	cols - 一行最多多少字
	disabled
	form - 哪个表格名字
	inputmode
	maxlength
	minlength
	name
	placeholder
	readonly
	required
	rows - 可见几行
	wrap - hard (必须跟cols一起使用, 超过cols就 line breaks (CR+LF)), soft, off

keygen 秘密钥匙
	autofocus
	challenge - 产生的密码
	disabled
	form - 哪个表单
	keytype - 默认RSA
	name

output 输出
	for - 影响输出结果的资源IDs
	form
	name

progress 任务进度
	value - 目前进度
	max - 总进度
	<progress value="70" max="100">70 %</progress>

meter 衡量度
	value - 目前数值, 在min和max之间
	min - 最低
	max - 最高
	low - 低领域值(min-low)
	high - 高领域值(high-max)
	optimum - 完美值

fieldset (legend): 几个控件的划区
	<form action="test.php" method="post">
	  <fieldset>
	    <legend>Title</legend>
	    <input type="radio" id="radio">
	    <label for="radio">Click me</label>
	  </fieldset>
	</form>

{scripting}

script 脚本
	src - 资源链接
	type - text/javascript, module(HTML5)
	charset
	async - 同时运行parallel
	defer - execute AFTER document loaded BEFORE  DOMContentLoaded  fired
	crossorigin
	nonce - 验证密码

noscript 无脚本
	<noscript>
	  <!-- anchor linking to external file -->
	  <a href="https://www.mozilla.com/">External Link</a>
	</noscript>

template 模版

### Global Attribute

accesskey 快捷键
class 类别
contenteditable 编辑
contextmenu 用哪一个context type menu
data-* 自定义数据
dir: 文字方向 ltr, rtl, auto 
draggable 是否可以drag and drop
dropzone 怎么处理drop event
hidden 隐藏
id 识别标志
lang 语言
spellcheck 检查拼写
style: inline style
tabindex
title: 通常是以tooltip 形式出现
translate 是否翻译

{GlobalEventHandlers interface}

onabort
onblur 文档失去关注(document lose focus)
oncancel
oncanplay
oncanplaythrough
onchange
onclick
onclose
oncontextmenu
oncuechange
ondblclick
ondrag
ondragend
ondragenter
ondragexit
ondragleave
ondragover
ondragstart
ondrop
ondurationchange
onemptied
onended
onerror 文档无法正常载入(document fails to load properly)
onfocus 文档得到关注
oninput
oninvalid
onkeydown
onkeypress
onkeyup
onload 文档完成加载
onloadeddata
onloadedmetadata
onloadstart
onmousedown
onmouseenter
onmouseleave
onmousemove
onmouseout
onmouseover
onmouseup
onwheel
onpause
onplay
onplaying
onprogress
onratechange
onredo 用户在改变记录中向前移动
onreset
onresize 文档改变尺寸
onscroll
onseeked
onseeking
onselect
onshow
onstalled
onsubmit
onsuspend
ontimeupdate
ontoggle
onundo 用户在改变记录中向后移动
onvolumechange
onwaiting

### WindowEventHandler Interface

onafterprint 用户打印完文档
onbeforeprint 用户请求打印文档
onbeforeunload 文章卸载前
onhashchange 文档当前地址的#这个部分出现变化
onlanguagechange 想要的语言出现变化(preferred language changed)
onmessage 文档收到一条信息
onoffline 网络失去连接
ononline 网络重新连接
onpagehide
onpageshow
onrejectionhandled
onpopstate 用户在会话历史记录移动 (user has navigated session history)
onstorage (web storage): localStorage 或者 sessionStorage出现变动
onunhandledrejection
onunload 文档消失
 
### DocumentAndElementEventHandlers interface

oncopy
oncut
onpaste