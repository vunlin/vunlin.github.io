Secret Secret Secret 详尽的代码解读，暂时留一手，这样子才有问答流量，而且自己不会忘记

Write Explaination for each line of comment -> use example and all the detail that needed if it is not clear enough..

self-explainatory  ----------> COOL....  (for example <251> 如果是 document context 的话 就不要 测试 contains)

不是 newContext，就代表无需测试 contains。。。。。。。。。

不写下来，以后就会忘记

elementMatcher 作为 pre-post Filter 得出集合 加上 matcher 和 postFinder 就变成 setMatcher

=====================================================>

使用 3 个基本的选择器 必须要 selector 和 context (默认为 document)  

Expr.find["ID"] = function( id, context ) : 
https://developer.mozilla.org/en-US/docs/Web/API/Document/getElementById

Expr.find["TAG"] = function( tag, context) : 
https://developer.mozilla.org/en-US/docs/Web/API/Document/getElementsByTagName : var elements = document.getElementsByTagName(name);
https://developer.mozilla.org/en-US/docs/Web/API/Element/getElementsByTagName : elements = element.getElementsByTagName(tagName)

Expr.find["CLASS"] = function( className, context ) : 
https://developer.mozilla.org/en-US/docs/Web/API/Document/getElementsByClassName
https://developer.mozilla.org/en-US/docs/Web/API/Element/getElementsByClassName 


用 :first :last :eq :even :odd 等先 断点 setMatcher，只有在没有以上元素的时候才是单一的 elementMatcher array

setMatcher 断点之后，使用elementMatcher 对每个 combinator 断点 就完成所有元素的 matcher 配置

如果是 setMatcher 的话，elementMatcher 是添加到 preFilter 中使用，setMatcher 通过 postFinder 内嵌 下一个 setMatcher
-> 如果 postFinder 是elementMatcher，就通过 multiContext 找出所有符合的 element 进行筛选

如果是 elementMatcher的话 就单独使用，下一步的 elementMatcher 配合 addcombinator 通过 combinator 进行断点 内嵌到自己里面

=================================================

elementMatcher 内嵌 elementMatcher 进行 recursive 验证

Sizzle.compile("#bb te > d e + b")

-> 现在 elementMatcher scope 的 matcher 有 2 个 
=> [1](呼叫1) -> Expr.filter['TAG'] {nodeName: "b"} // 验证 "b" TAG
=> [0](呼叫2) 验证 "+" 通过后 使用更新的 elem 到返回的matcher中 - > return [invoke](呼叫3) matcher( elem, context, xml ) <1731>
			 Invoke 之前传入合并的 elementMatcher (又回到 elementMatcher 了 就 recursive 验证吧) 

第一层 "b" -> "+"" 完成 "+ b"

-> 现在 elementMatcher scope 的 matcher 有 2 个 
=> [1](呼叫1) -> Expr.filter['TAG'] {nodeName: "e"} 
=> [0](呼叫2) -验证 " " 通过后 使用所有符合的 elem - > return [invoke](呼叫3) matcher( elem, context, xml ) <1738>

第二层 "e" -> " " 完成  " e + b"

-> 现在 elementMatcher scope 的 matcher 有 2 个 
=> [1](呼叫1) -> Expr.filter['TAG'] {nodeName: "d"}
=> [0](呼叫2) 验证 ">" 通过后 使用更新的 elem - > return [invoke](呼叫3) matcher( elem, context, xml ) <1731>

第三层 "d" -> ">" 完成 " > d e + b"

-> 现在 elementMatcher scope 的 matcher 有 2 个 
=> [1](呼叫1) -> Expr.filter['TAG'] {nodeName: "te"}
=> [0](呼叫2) -验证 " " 通过后 使用所有符合的 elem - > return [invoke](呼叫3) matcher( elem, context, xml ) <1738>

第四层 "te" -> " " 完成 " te > d e + b"

-> 现在 elementMatcher scope 的 matcher 有 2 个 
=> [1](呼叫1) -> Expr.filter['ID'] {attrId: "bb"}
=> [0](呼叫0) -> 回到第一层 验证 context 的位置 <1934>，#id 开头 所以 leadingRelative 是 undefined，使用 matchContext 验证，DONE 完成

第五层 "#bb" -> 检验 context 层 完成 "#bb te > d e + b" ====> DONE!!! 

-------------------------------------->

Sizzle.compile("#bb te.b[name='what']:last > de:even .cp div:first")

-> [multipleContexts](呼叫1) * 获得所有的 elements
-> [preFilter](呼叫2) 使用 内嵌的 elementMatcher 来 过滤 (#bb te.b[name='what'])
-> [matcher](呼叫3) 使用 :last 创建 <1582> 的 createPositionalPseudo 函数 <527> 进行 过滤 seeds，到此完成 (#bb te.b[name='what']:last)
-> [postFinder](呼叫4) 使用内嵌的 setMatcher 继续 recursively 完成 call

-> 使用上面传下来的 seed
-> [preFilter](呼叫1)使用 内嵌的 elementMatcher 来 过滤 (> de)
-> [matcher](呼叫2) 使用 :even 进行 过滤 seeds，到此完成 (#bb te.b[name='what']:last > de:even)
-> [postFinder](呼叫3) 使用内嵌的 setMatcher 继续

-> 使用上面传下来的 seed
-> [preFilter](呼叫1)使用 内嵌的 elementMatcher 来 过滤 ( .cp div)
-> [matcher](呼叫2) 使用 :first 进行 过滤 seeds，到此完成 (#bb te.b[name='what']:last > de:even .cp div:first)
-> 完成结束 DONE

---------------------> 良好的扩展性

<1380> 测试 和 data/testingPseudos.js https://j11y.io/javascript/extending-jquerys-selector-capabilities/

使用 seed 的 parameter 就是 setFilter (setMatcher)， 使用 elem 的 paramater 就是 普通的 filter (elementMatcher)

------------> unit test 有趣和特殊 例子 ------------------> <soFar 1417>
<selector.js - code number line>

interesting cases: <212> <332> <438> <1020-1023> <1066>


