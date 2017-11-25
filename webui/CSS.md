### Media Query 媒体查询

HTML引入
<link rel="stylesheet" type="text/css" media="screen, speech" href="sans-serif.css">
<link rel="stylesheet" type="text/css" media="print, embossed" href="serif.css">
CSS引入
@media screen, speech {
  body { font-family: sans-serif }
}
@import "print-styles.css" print, embossed;

position: static | relative | absolute | sticky | fixed
https://developer.mozilla.org/en-US/docs/Web/CSS/position

type 类型
(‘aural’, ‘braille’, ‘handheld’, ‘print’, ‘projection’
‘screen’, ‘tty’, ‘tv’, ‘embossed:braille printer’, ‘speech:replace aural’, ‘all’)

Logical operators 操作逻辑
not, (,=Or), and, only, min-, max-, >=<

Features 特征
Viewport/Page Dimensions 尺寸
	width: 宽度 (px, em ...)
	height: 高度 (px, em ...)
	aspect-ratio: Width-to-height 对比度 (1/2, 3/8 ...)
	orientation: 取向 (portrait, landscape)

Display Quality 分辨效果
	resolution: 分辨率 pxiel density (256dpi, 1024dpcm ...)
	scan: 屏幕用什么方式展示 (interlace, progressive)
	grid: 是否grid还是bitmap (0,1) grid 一般就是不可以通过bitmap图像展现文字
	update: 更新频率hz (none, slow, fast), 动画可以使用fast来达到smooth的效果
	overflow-block: 溢出块区怎么展示 (none, scroll, optional paged, paged分页)
	overflow-inline: 溢出线区怎么展示 (none, scroll)

Color 颜色
	color: 支持几个字节的颜色(0没有颜色,1,2 ...)
	color-index: 多少数量的不同颜色 (256, 512, 1000000百万色素 ...)
	monochrome:  黑白 (0, monochrome)
	color-gamut: 色域 (srgb, p3, rec2020)

Interaction 互动
	pointer: 用户是否使用 pointing device, 精细度如何(none, coarse, fine)
	hover: 用户输入设备是否可以 hover over (none, hover)
	any-pointer: same as pointer?
	any-hover: same as hover?

### Flexible Box Layout 弹性盒子布局
https://css-tricks.com/snippets/css/a-guide-to-flexbox/

display: flex, inline-flex

Ordering and Orientation 排列与方向
	flex-direction: main-axis 方向 (row, row-reverse, column, colum-reverse)
	flex-wrap: (nowrap, wrap, wrap-reverse)
	flex-flow: shorthand (flex-direction | flex-wrap)
	order: 排列item, 不按照代码的顺序 (integer)

Flexibility 伸缩性 
	flex-grow: 大于flex-basis占据的空间 (number)
	flex-shrink: 小于flex-basis占据的空间 (number)
	flex-basis: 用于衡量标准的尺寸 (length)

Alignment 对齐方式
	justify-content: 排列空的位置(flex-start, flex-end, center, space-between, space-around, space-evenly)
	align-items: 对齐一行方式(flex-start | flex-end | center | baseline | stretch)
	align-self: 对齐自己方式,无视其他align(auto | flex-start | flex-end | center | baseline | stretch)
	align-content: 对齐多行方式 (flex-start, flex-end, center, space-between, space-around, stretch)

### CSS IMAGE VALUES AND REPLACED CONTENT 图像数值 通过url引入, 或者通过gradient创建图像
	url('1.jpg') url('2.jpg') - 可以同时使用多个图像, stack on top of each other
								then border draw over it, background-color underneath everything
	linear-gradient
	radial-gradient
	repeating-linear-gradient
	repeating-radial-gradient

background-image (url, linear-gradient, radial-gradient ...)

border-image
	source: 图像资源链接
	slice: 怎么切割source图像
	width: override border width, if not set, use border width
	outset: by HOW MUCH extend beyond border box(number).
	repeat: (stretch, space:add space to fit if whole number is not perfect, round:scale to fit, repeat)

content 代替的内容 使用::before 和 ::after
[none, normal, <string>, <url>, <counter>, attr(x), open-quote|close-quote, no-open-quote|no-close-quote]
	
cursor 鼠标 (url, Keyword)
https://developer.mozilla.org/en-US/docs/Web/CSS/cursor

list-style-image 数列 (url)

### Selector 元素挑选

Universal selector: *, ns|*, *|*, |*, all (Universal selector with NameSpace CSS3)
Type selector: Element name (h1,div, etc...)
ID selector: (#ID)
Class selector: .class_name == [class~=class_name]
Attribute selector
	[attr]: 有这个attr
	[attr=value]: 有这个attr值等于value
	[attr~=value]: attr其中一个值等于value
	[attr|=value]: 有这个attr值等于value或者value-*
	[attr^=value]: 有这个attr值等于value(*), prefix
	[attr$=value]: 有这个attr值等于(*)value, suffix
	[attr*=value]: attr值包含value这个string
	[attr operator value i/I]: case insensitive operator

Combinator selector
	A + B: 临近同胞
	A ~ B: 临近同胞+非临近同胞
	A > B: 子系仅一层
	A B: 子孙系

Pseudo-classes
	:active 已经被使用 activated by user
	:any 使用提供的选项进行配对
	:any-link 符合link的所有状态(:visted, :link)
	:checked (radio, checkbox, option)是否on
	:default 默认状态
	:dir() [ltr, rtl]
	:disabled 禁止使用
	:empty 没有包含任何元素,连white space都没有
	:enabled 允许使用
	:first 只可以和@page一起使用, 制定第一页的风格
	:first-child 第一个子元素
	:first-of-type 这个类型第一个值
	:fullscreen 浏览器全屏状态 
	:focus 关注状态  
	:hover 鼠标移动在上面状态
	:indeterminate 状态不确定的状况下 
	:in-range 在这个范围之间 min-max
	:invalid  非有效值 
	:lang() 语言 
	:last-child 最后一个子元素
	:last-of-type 这个类型最后一个值
	:left 只可以和@page一起使用, 制定左页的风格
	:link 未被访问的链接
	:not() 非
	:nth-child() 第n个子元素, odd, even, An+B, -n+3前三个元素
	:nth-last-child() 从尾部倒过来数 as oppose to :nth-child()
		https://developer.mozilla.org/en-US/docs/Web/CSS/:nth-last-child
	:nth-last-of-type() reverse of :nth-of-type
	:nth-of-type(): odd,even,interger
	:only-child 上一级只有自己这个元素
	:only-of-type 上一级只有自己这种类型元素
	:optional 没有required这个attribute
	:out-of-range 这个范围之外 min-max
	:read-only 只可读 
	:read-write 可读可写
	:required 有required
	:right 只可以和@page一起使用, 制定右页的风格
	:root 最高层, 在HTML文件中就是html
	:scope ???
	:target 访问的目标
	:valid 有效值
	:visited 已经访问过

Pseudo-elements
	::after 加一个元素到最后
	::backdrop 背景 
	::before 加一个元素到最前
	::cue webvtt文件
	::first-letter 第一个字
	::first-line 第一行字 
	::placeholder placeholder
	::selection 文字selection
	::spelling-error 拼写错误  

### CSS TRANSFORMS 变化 (for all kinds of elements)
	transform functions
		matrix: combine of (translate, rotate, scale)
		translate 平移
		rotate 旋转
		scale 比例伸缩 
		skew 扭曲
		perspective 透视法

	transform-origin
	transform-style
	perspective
	backface-visibility

### CSS TRANSITIONS 过渡 (start and end states)
	transition-delay 等候时间 <time>
	transition-duration 过渡时间 <time>
 	transition-property 变化的属性
	transition-timing-function: ease ease-in ease-out ease-in-out linear step-start step-end

### CSS ANIMATIONS 动画 (keyframe multiple states) @keyframe
	animation-delay 等候时间 <time>
	animation-direction 方向
	animation-duration 过渡时间 <time>
	animation-fill-mode 动画开始之前 结束之后的style
	animation-iteration-count 重复次数
	animation-name: 使用哪个keyframe名字
	animation-play-state: running, paused
	animation-timing-function: ease ease-in ease-out ease-in-out linear step-start step-end

### CSS BACKGROUNDS AND BORDERS 背景和边框
Background 背景
	background-attachment: https://css-tricks.com/almanac/properties/b/background-attachment/
	background-blend-mode: 多个背景图叠加样式
	background-clip: 在哪个位置剪辑
	background-color: 背景颜色 <color>或者transparent
	background-image: See Above, way up up there
	background-origin: 在哪个区域铺背景图片 https://css-tricks.com/almanac/properties/b/background-origin/
	background-position: 背景图片位置
	background-repeat: 背景重复
	background-size: 背景大小

Border 边框
	border-color: 边框颜色
	border-style: 样式https://developer.mozilla.org/en-US/docs/Web/CSS/border-style
	border-width: 粗度
	border-radius: 有弧度的边 Round Corner

Border Image: See Above

Other
	box-shadow 阴影

### CSS Basic User Interface 
	box-sizing 控制 content-box, border-box, 改变浏览器默认box model computed size

	outline: line outside the BORDER
	outline-color 颜色
	outline-offset 空间在outline和border之间
	outline-style 风格
	outline-width 粗度

	resize 用户是否可以调节控件大小
	text-overflow 文字溢出如何显示

	cursor: see Above
	caret-color: 光标颜色

### CSS Basic Box Model
	display: block, inline, run-in: 取决于情况变成block 或者 inline

	padding
	margin
	width, height
	min-width, min-height
	max-width, max-height
	float: left, right, 
		   inline-start (=left with ltr, =right with rtl text-direction)
	       inline-end (=right with ltr, =left with rtl text-direction)
	clear: left, right, both, inline-start, inline-end

	overflow, overflow-x, overflow-y: visible, hidden, scroll, auto 
	overflow-wrap 是否应该断行

	visibility: visible, hidden, collapse(for table items, act as hidden, but still take up space)
	z-index: 叠合的位置

### CSS Shapes
	shape: inset(长方形), circle(圆形), ellipse(椭圆形), poly(多边形)
	shape-image-threshold
	shape-margin
	shape-outside

### CSS Masking 遮罩
	clip 剪除 (clip path)
	mask 遮罩 更加精细
	mask-clip 影响的范围SVG?
	mask-composite ??
	mask-image 图像??
	mask-mode ??
	mask-origin 地方 ??
	mask-position 开始的地方
	mask-repeat 重复方式
	mask-size 大小
	mask-type ??

### CSS Text Decoration
	text-align 排版 start | end | left | right | center | justify | match-parent
	text-align-last 最后一行排版 
	text-combine-upright
	text-decoration 装饰shorthand
	text-decoration-color 颜色
	text-decoration-line 线高度 none | [ underline || overline || line-through || blink ]
	text-decoration-style 格式 solid | double | dotted | dashed | wavy
	text-emphasis: 重点 -webkit-text-emphasis: triangle #D55;
	text-emphasis-color: see above
	text-emphasis-position: see above
	text-emphasis-style: see above
	text-indent: <length>, <percentage>
	text-justify: 在text-align:justify下使用 auto | inter-character | inter-word | none
	text-orientation: 配合writing-mode 使用
	text-overflow: 文字溢出是怎么处理
	text-rendering: 怎么render文字 auto | optimizeSpeed | optimizeLegibility | geometricPrecision
	text-shadow: rather like box-shadow
	text-transform: 变化 none | capitalize | uppercase | lowercase | full-width
	text-underline-position: 跟text-decoration-line:unline 配合使用
	vertical-align: inline 或者 table cell 垂直排版
		baseline | sub | super | text-top | text-bottom | middle | top | bottom | <percentage> | <length>
	writing-mode: 写作方向和排列 horizontal-tb | vertical-rl | vertical-lr | sideways-rl | sideways-lr
	tab-size: 设定tab的格数
	
	white-space: 怎么处理多个连续的空格 normal | pre | nowrap | pre-wrap | pre-line
	word-break: oveflow的文字加入line break?
	hyphens: oveflow的文字加入-hyphens?
	overflow-wrap: overflow是否wrap?

	word-spacing
	letter-spacing

	hanging-punctuation???

### CSS Fonts 
	font
	font-family 用系统自带哪个字体 font-family: Times, Times New Roman, Georgia, serif;
	font-feature-settings 控制OpenType fonts设置  normal|<feature-tag-value>
	font-stretch 字体拉伸控制 normal | ultra-condensed | extra-condensed | condensed | semi-condensed
							  semi-expanded | expanded | extra-expanded | ultra-expanded

	font-style 字体形式 normal | italic | oblique
	font-weight 粗细 normal | bold | bolder | lighter | 100 ...
	font-variant 
	font-variant-caps 大写字体 normal | small-caps | all-small-caps | petite-caps 
							   all-petite-caps | unicase | titling-caps
	font-variant-east-asian 东方字体 日文 中文
	font-variant-ligatures 连字 ???
	font-variant-numeric 数值,分数等等
	font-variant-position 位置 normal | sub | super
	format(): url('examplefont.woff') format("woff"),
      		  url('examplefont.otf') format("opentype");

	@font-face 使用外界的字体
	src:url("/fonts/OpenSans-Regular-webfont.woff2") format("woff2"),
        url("/fonts/OpenSans-Regular-webfont.woff") format("woff");

	font-family (@font-face)
	font-feature-settings (@font-face)
	font-stretch (@font-face)
	font-style (@font-face)
	font-weight (@font-face)
	font-variant (@font-face)
	format (@font-face)

	font-size 字体大小
	font-size-adjust: font-size 以capital letter 还是 lowercase做标准
	unicode-range 字体取值范围, 默认U+0-10FFFF 
	font-kerning 字距调整 auto | normal | none

### CSS Lists and Counters
	list-style
	list-style-image 图像 <url> | none
	list-style-position 位置 inside | outside
	list-style-type 样式 disc|square|circle|... many more

	<counter>
	counter-increment 幅度 step
	counter-reset 重新设置为多少

### CSS Multi-column Layout 
	columns: both (column-width and column-count)
	column-width: 每栏多宽
	column-count: 总共几栏

	column-gap: 每栏之间距离
	column-rule: 每栏之间竖线
	column-rule-color 颜色
	column-rule-style 样式
	column-rule-width 粗细

	column-span: 改变占的栏数
	column-fill: 怎么分配到每一栏

### CSS Grid Layout
	grid: https://css-tricks.com/snippets/css/complete-guide-grid/
	display: grid, inline-grid, sub-grid
	
	开始到结束范围
	grid-row: shorthand
	grid-row-start
	grid-row-end
	grid-column: shorthand
	grid-column-start
	grid-column-end
	
	grid-area: 区域

	自动制定大小
	grid-auto-flow
	grid-auto-columns
	grid-auto-rows
	
	之间的距离
	grid-gap: shorthand
	grid-column-gap
	grid-row-gap

	模版
	grid-template: shorthand
	grid-template-areas
	grid-template-columns
	grid-template-rows

### CSS Properties and Values
	:root + var() + Custom properties (--*)
		:root {
		  --main-bg-color: pink;
		}

		body {
		  background-color: var(--main-bg-color);
		}

### CSS Values and Units
	Distance Units
	Font-relative Length: em, ex, ch, rem
	Viewport-Percentage Length: vw, vh, vmin, vmax
	Absolute Length: cm, mm, q, in, pt, pc, px

	Angle Unit: deg, grad, rad, turn
	Duration Unit: s, ms
	Frequency Unit: Hz, kHz
	Resolution Unit: dpi, dpcm, dppx

	functions: calc(), attr()

### Mobile Touch Action
https://developer.mozilla.org/en-US/docs/Web/CSS/touch-action

touch-action (use native mobile browser's touch actions instead)
	html {
	  touch-action: manipulation;
	}

	auto: Enable browser handling of all panning and zooming gestures.
	none: Disable browser handling of all panning and zooming gestures.
	
	pan-x: Enable single-finger horizontal panning gestures. May be combined with pan-y, pan-up, pan-down and/or pinch-zoom.
	
	pan-y:Enable single-finger vertical panning gestures. May be combined with pan-x, pan-left, pan-right and/or pinch-zoom.
	
	manipulation: 
	Enable panning and pinch zoom gestures, but disable additional non-standard gestures such as double-tap to zoom. Disabling double-tap to zoom removes the need for browsers to delay the generation of click events when the user taps the screen. This is an alias for "pan-x pan-y pinch-zoom" (which, for compatibility, is itself still valid).
	
	pan-left, pan-right, pan-up, pan-down:
	Enable single-finger gestures that begin by scrolling in the given direction(s). Once scrolling has started, the direction may still be reversed. Note that scrolling "up" (pan-up) means that the user is dragging their finger downward on the screen surface, and likewise pan-left means the user is dragging their finger to the right. Multiple directions may be combined except when there is a simpler representation (for example, "pan-left pan-right" is invalid since "pan-x" is simpler, but "pan-left pan-down" is valid).

	pinch-zoom:
	Enable multi-finger panning and zooming of the page. This may be combined with any of the pan- values.

### Other 

!import 
@charset "utf-8";
@import 引进文件 @import url("bluish.css") projection, tv;
@supports 是否支持某个特征
@viewport ?? https://css-tricks.com/snippets/html/responsive-meta-tag/ ??
@page 打印文件的样式 
	page-break-after 
	page-break-before
	page-break-inside	

@namespace
	@namespace url(http://www.w3.org/1999/xhtml);
	@namespace svg url(http://www.w3.org/2000/svg);

	/* This matches all XHTML <a> elements, as XHTML is the default unprefixed namespace */
	a {}
	/* This matches all SVG <a> elements */
	svg|a {}
	/* This matches both XHTML and SVG <a> elements */
	*|a {}

mix-blend-mode
isolation
怎么重合子元素背景和内容, 和父元素背景
https://developer.mozilla.org/en-US/docs/Web/CSS/mix-blend-mode

filter 滤镜
	blur() Blurs the image.
	brightness() Makes the image brighter or darker.
	contrast() Increases or decreases the image's contrast.
	drop-shadow() Applies a drop shadow behind the image.
	grayscale() Converts the image to grayscale.
	hue-rotate() Changes the overall hue of the image.
	invert() Inverts the colors of the image.
	opacity() Makes the image transparent.
	saturate() Super-saturates or desaturates the input image.
	sepia() Converts the image to sepia.

color 前景颜色 foreground color (<color>, currentColor, transparent, rgb(), hsl(), etc..)

will-change 提示给浏览器这个元素会变化, 做好优化的准备

minmax(value1, value2): flex and grid layout cell between value1 to value2

object-fill: https://developer.mozilla.org/en-US/docs/Web/CSS/object-fit
object-position

pointer-event: none (disable pointer click), and lots of SVG(fill, stroke etc) events