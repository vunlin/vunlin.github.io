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

picture (source)
img
iframe
embed
object (param)
video (source, track)
audio (source, track)
map (area)

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

details (summary)
menu (menuitem)

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
table
caption
colgroup
col
tbody
thead
tfoot
tr
td
th

{form}
form
label
input
button
select (optgroup->option)
datalist
textarea
keygen
output
progress
meter
fieldset (legend)

{scripting}
script
noscript
canvas
template
math
svg


### Global Attribute

accesskey
class
contenteditable
contextmenu
data-*
dir
draggable
dropzone
hidden
id
lang
spellcheck
style
tabindex
title
translate

{GlobalEventHandlers interface}

onabort
onblur
文档失去关注(document lose focus)
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
onerror
文档无法正常载入(document fails to load properly)
onfocus
文档得到关注
oninput
oninvalid
onkeydown
onkeypress
onkeyup
onload
文档完成加载
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
onredo
用户在改变记录中向前移动
onreset
onresize
文档改变尺寸
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
onundo
用户在改变记录中向后移动
onvolumechange
onwaiting

### WindowEventHandler Interface

onafterprint
用户打印完文档
onbeforeprint
用户请求打印文档
onbeforeunload
文章卸载前
onhashchange
文档当前地址的#这个部分出现变化
onlanguagechange
想要的语言出现变化(preferred language changed)
onmessage
文档收到一条信息
onoffline
网络失去连接
ononline
网络重新连接
onpagehide
onpageshow
onrejectionhandled
onpopstate
用户在会话历史记录移动 (user has navigated session history)
onstorage (web storage)
localStorage 或者 sessionStorage出现变动
onunhandledrejection
onunload
文档消失
 
### DocumentAndElementEventHandlers interface

oncopy
oncut
onpaste