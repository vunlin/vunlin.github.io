### Media Query 媒体查询

HTML引入
<link rel="stylesheet" type="text/css" media="screen, speech" href="sans-serif.css">
<link rel="stylesheet" type="text/css" media="print, embossed" href="serif.css">
CSS引入
@media screen, speech {
  body { font-family: sans-serif }
}
@import "print-styles.css" print, embossed;

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

Universal selector: *, ns|*, *|*, |*(Universal selector with NameSpace CSS3)
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

### CSS TRANSFORMS 变化
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

### Other

@supports 是否支持某个特征
@viewport ?? https://css-tricks.com/snippets/html/responsive-meta-tag/ ??


