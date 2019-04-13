#### color

1. #(3/6) - 红色/绿色/蓝色(十六进制)
1. keyword - 关键字 (white, black, whitesmoke, purple) 等等
1. hsla - 色度/浓度/亮度/透明度 - 更容易被人类阅读 [stackoverflow 阅读](https://stackoverflow.com/questions/26059228/css-hsl-or-rgba-colors)
1. rgba - 红色/绿色/蓝色/透明度(十进制)
1. transparent - 相当于 rgba(0,0,0,0)
1. var(--customVariable) - 自定义变量转变
1. currentColor - 现在这个元素设置的颜色，这样子不要重复定义同一个颜色
<pre>
	p {
		border-color:#2223de;
		color: #2223de;
		font-color: #2223de;
	}
	可以写成
	p {
		border-color:#2223de;
		color: currentColor;
		font-color: currentColor;
	}
</pre>