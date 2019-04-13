#### object-fit (-o-object-fit) (IE 不支持)

1. fill(起始值) - 伸缩到覆盖整个格子，不保持长宽比 [例子1](/items/code/analyze/1#css_base_link3)
1. contain - 保持长宽比，伸缩最长的部分覆盖格子，然后 [letterboxed](https://en.wikipedia.org/wiki/Letterboxing_(filming)) 
1. cover - 保持长宽比，伸缩最短的部分覆盖格子，然后剪切 clipped 
1. none - 保持原大小
1. scale-down - 使用 none 如果原大小可以包含在格子里面，如果不可以就使用 contain 规则