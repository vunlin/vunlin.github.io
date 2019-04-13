#### position

1. static(默认值) - 正常排布流程
1. relative - static 正常排布流程，然后按照给予的 top, right, bottom, and left 移动相对的位置
1. absolute - 不按照正常排布流程，位置取决于 最接近的 有正常排布结构的包含层，通过top, right, bottom, and left定位
1. fixed - 跟 absolute 差不多，但是位置是相对于 viewport 视窗 [例子1](/items/code/analyze/1#css_base_link2)
1. sticky(IE 不支持) - 跟 fixed + relative 差不多， 但是在 scrollbar 滚动到 元素位置的时候，才会生效，非常有用的 sticky menu navigation