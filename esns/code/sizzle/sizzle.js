/*!
 * Sizzle CSS Selector Engine v2.3.4-pre
 * https://sizzlejs.com/
 *
 * Copyright JS Foundation and other contributors
 * Released under the MIT license
 * https://js.foundation/
 *
 * Date: 2019-01-14
 */
(function( window ) { //esns 这里是 function expression 而不是 function declaration，所以立刻执行，Immediately invoked function expression 阅读 https://en.wikipedia.org/wiki/Immediately_invoked_function_expression

var i, //esns 临时变量
	support, //esns 用来记录浏览器是否对各种功能支持的对象 [object] <612>
	Expr, //esns 处理 selector string 寻找和筛选 用的最重要的对象 Expr [object] <1119>，在 <639> 按照 support feature 来创建一部分 find 和 filter 函数 <1214> 补足以上的 find 和 filter 函数
	getText, //esns 用于获取 Node 节点的 text 的功能函数 [function] <1088>
	isXML, //esns 判断是否 XML 文件的功能函数 [function] <562>
	tokenize, //esns 分解 selector string 的 tokenize 功能函数 [function] <1642>
	compile, //esns 编译 tokenize 分解好的 元素组，变成最终寻找和筛选器 的功能函数 [function] <2089>，elementMatchers 和 setMatcher， 然后集合成 superMatcher 返回
	select, //esns 所有浏览器自身没法处理的 selector 都使用这个 select 入口函数来接受处理 [function] <2128>
	outermostContext, //esns 记录最外层节点的变量 [node]
	sortInput, //esns 需要进行排序输入的数组 [array]
	hasDuplicate, //esns 数组中是否有相同元素的变量值 [boolen] 

	// Local document vars
	setDocument, //esns 设置当前 document 内的环境变量 的一个功能函数 [function] <577>
	document, //esns 现在处理的这个文档的变量，这个不是但有可能等于 window.document，即使相同，这两个是不同作用域的变量
	docElem, //esns 现在处理的这个文档 最顶层元素 Document.documentElement 阅读 https://developer.mozilla.org/en-US/docs/Web/API/Document/documentElement
	documentIsHTML, //esns 判断是否 XML 文件的变量 [boolean]
	rbuggyQSA, //esns 如果浏览器支持 querySelectAll, 记录该浏览器此功能中有的缺陷 bugs 的 [array]，如果查询中涉及到这些缺陷，就跳过避开不用
	rbuggyMatches, //esns 如果浏览器支持 matches, 记录该浏览器此功能中有的缺陷 bugs 的 [array]，如果查询中涉及到这些缺陷，就跳过避开不用
	matches, //esns 浏览器的 matches 功能函数 [function]，https://developer.mozilla.org/en-US/docs/Web/API/Element/matches
	contains, //esns 测试 A元素 是否包含着 B元素 的功能函数 [function] name <857>

	// Instance-specific data
	expando = "sizzle" + 1 * new Date(), //esns 特定的ID 避免出现冲突
	preferredDoc = window.document, //esns 如果没有特定文档，就优先使用的 document 文件变量
	dirruns = 0, //esns 记录进行了几次 上下左右 (parentNode, childNode, silbingNode) 的查询，来优化??
	done = 0, //esns 记录完成几次完整的查询??
	classCache = createCache(), //esns 核对筛选 class 型的 函数缓存 <1226>
	tokenCache = createCache(), //esns 字符串分解的结果的缓存
	compilerCache = createCache(), //esns 编译后的 superMatcher 的缓存
	nonnativeSelectorCache = createCache(), //esns 非浏览器本身的选择器处理的字符串 的缓存
	sortOrder = function( a, b ) { //esns 数组排序的 function 变量，在 setDocument 中再具体设置 <882>
		if ( a === b ) {
			hasDuplicate = true; //esns 数组中有相同元素
		}
		return 0;
	},

	// Instance methods
	hasOwn = ({}).hasOwnProperty, //esns 简化 Object 的 hasOwnProperty 函数名 为 hasOwn
	arr = [], //esns 这里和以下简化 Array 对象的 函数名
	pop = arr.pop,
	push_native = arr.push,
	push = arr.push,
	slice = arr.slice,
	// Use a stripped-down indexOf as it's faster than native
	// https://jsperf.com/thor-indexof-vs-for/5
	indexOf = function( list, elem ) { //esns 自己定制的 indexOf 函数，因为比浏览器自身的更快
		var i = 0,
			len = list.length;
		for ( ; i < len; i++ ) {
			if ( list[i] === elem ) {
				return i;
			}
		}
		return -1;
	},
	//esns HTML中的 属于 booleans 值的属性
	booleans = "checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped",

	// Regular expressions
	//esns 所有连续 \\ 等于 一个 \， 还有 \\\\ 等于 \\， 然后 \\\\. = \\ 和 .
	// http://www.w3.org/TR/css3-selectors/#whitespace
	whitespace = "[\\x20\\t\\r\\n\\f]", //esns \x20 等于 space 空格

	// http://www.w3.org/TR/CSS21/syndata.html#value-def-identifier
	identifier = "(?:\\\\.|[\\w-]|[^\0-\\xa0])+",    //esns 匹配 \(.) 代表 \后必须要接字符 不能连续\\ [或] (\w = A-Za-z0-9)- [或] \xao 以上的 unicode 字符串  
	//esns 详见 https://developer.mozilla.org/en-US/docs/Web/CSS/Attribute_selectors
	// Attribute selectors: http://www.w3.org/TR/selectors/#attribute-selectors
	attributes = "\\[" + whitespace + "*(" + identifier + ")(?:" + whitespace + //esns 配对属性选择 {例子[name *= "value"]} 开头的 [ 
		// Operator (capture 2) 
		"*([*^$|!~]?=)" + whitespace + //esns 接下来的可能的 combinator (*^$|!~) 加上 = 
		// "Attribute values must be CSS identifiers [capture 5] or strings [capture 3 or capture 4]"
		"*(?:'((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\"|(" + identifier + "))|)" + whitespace + //esns 匹配单引号中的 'string' [或] 双引号中的 "string" [或] identifier [或] 空值 {例子 [name]}
		"*\\]", //esns 最后尾部的 ]
		
	pseudos = ":(" + identifier + ")(?:\\((" + //esns 伪类开头 : 加上 identifier 加上 可能的 {例子 :nth-child(4n)}
		// To reduce the number of selectors needing tokenize in the preFilter, prefer arguments:
		// 1. quoted (capture 3; capture 4 or capture 5)
		"('((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\")|" + //esns 匹配 单引号中的 'string' [或] 双引号中的 "string" [或] 空值
		// 2. simple (capture 6)
		"((?:\\\\.|[^\\\\()[\\]]|" + attributes + ")*)|" + //esns 属性值匹配 \\\\. = \(.) [或] [^\\\\()[\\]] = 不可以包含 \()[] 
		// 3. anything else (casspture s2s)
		".*" + //esns 其他任何字符串
		")\\)|)", //esns 尾部的 ) 或 空值 {例子 :required}
	//esns 前置 r 代表 正则表达式 对象 regular expression object
	// Leading and non-escaped trailing whitespace, capturing some non-whitespace characters preceding the latter
	rwhitespace = new RegExp( whitespace + "+", "g" ),
	rtrim = new RegExp( "^" + whitespace + "+|((?:^|[^\\\\])(?:\\\\.)*)" + whitespace + "+$", "g" ),  //esns 去掉开头的空格 [或] {空 或 非\字符 紧跟 \(.)}跟尾部的空格 (B&W?" may be written as "B\&W\?" or "B\26 W\3F" - https://www.w3.org/TR/CSS21/syndata.html#value-def-identifier)
	//esns 测试 rtrim - "\\c\\d  ".match(rtrim) => ["\c\d  "]	
	rcomma = new RegExp( "^" + whitespace + "*," + whitespace + "*" ), //esns 开头为 , 的字符串
	rcombinators = new RegExp( "^" + whitespace + "*([>+~]|" + whitespace + ")" + whitespace + "*" ), //esns  ^是否combinator 字符串，阅读https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Selectors#Combinators
	rdescend = new RegExp( whitespace + "|>" ), //esns 空格 [或] > 

	rpseudo = new RegExp( pseudos ),
	ridentifier = new RegExp( "^" + identifier + "$" ),

	matchExpr = {
		"ID": new RegExp( "^#(" + identifier + ")" ), //esns #id
		"CLASS": new RegExp( "^\\.(" + identifier + ")" ), //esns (.class identifier)
		"TAG": new RegExp( "^(" + identifier + "|[*])" ), //esns tag 或者 * (select all)
		"ATTR": new RegExp( "^" + attributes ),
		"PSEUDO": new RegExp( "^" + pseudos ),
		"CHILD": new RegExp( "^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" + whitespace + //esns 例子 nth-child(2n + 1)
			"*(even|odd|(([+-]|)(\\d*)n|)" + whitespace + "*(?:([+-]|)" + whitespace +
			"*(\\d+)|))" + whitespace + "*\\)|)", "i" ),
		"bool": new RegExp( "^(?:" + booleans + ")$", "i" ),
		// For use in libraries implementing .is()
		// We use this for POS matching in `select`
		"needsContext": new RegExp( "^" + whitespace + "*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" + //esns 需要上下环境来做判断 -> 例子 div:even | div > p
			whitespace + "*((?:-\\d)?\\d*)" + whitespace + "*\\)|)(?=[^-]|$)", "i" )
	},

	rhtml = /HTML$/i,
	rinputs = /^(?:input|select|textarea|button)$/i,
	rheader = /^h\d$/i, //esns (h1-h6)

	rnative = /^[^{]+\{\s*\[native \w/, //esns 测试是否是浏览器的 native code 的正则表达式

	// Easily-parseable/retrievable ID or TAG or CLASS selectors
	rquickExpr = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/, //esns 简单匹配模式 # -> ID, div -> TAG, .class -> CLASS， 可以使用定义好的三种 简单 选择器函数 function 来筛选即可

	rsibling = /[+~]/, //esns 是否兄弟姐妹 元素

	// CSS escapes
	// http://www.w3.org/TR/CSS21/syndata.html#escaped-characters
	runescape = new RegExp( "\\\\([\\da-f]{1,6}" + whitespace + "?|(" + whitespace + ")|.)", "ig" ),  //esns 开头\ 跟1-6位长的数字和a-f 或 任何字符
	funescape = function( _, escaped, escapedWhitespace ) { //esns _ = 全部的配对 "\string"，escaped = \后面的 "string"，是否出现 whitespace
		var high = "0x" + escaped - 0x10000;
		// NaN means non-codepoint
		// Support: Firefox<24
		// Workaround erroneous numeric interpretation of +"0x"
		return high !== high || escapedWhitespace ?
			escaped :
			high < 0 ?
				// BMP codepoint
				String.fromCharCode( high + 0x10000 ) :
				// Supplemental Plane codepoint (surrogate pair)
				String.fromCharCode( high >> 10 | 0xD800, high & 0x3FF | 0xDC00 );
	},

	// CSS string/identifier serialization
	// https://drafts.csswg.org/cssom/#common-serializing-idioms
	rcssescape = /([\0-\x1f\x7f]|^-?\d)|^-$|[^\0-\x1f\x7f-\uFFFF\w-]/g,
	fcssescape = function( ch, asCodePoint ) { //esns 阅读 https://stackoverflow.com/questions/27331819/whats-the-difference-between-a-character-a-code-point-a-glyph-and-a-grapheme
		if ( asCodePoint ) {

			// U+0000 NULL becomes U+FFFD REPLACEMENT CHARACTER
			if ( ch === "\0" ) {
				return "\uFFFD";
			}

			// Control characters and (dependent upon position) numbers get escaped as code points
			return ch.slice( 0, -1 ) + "\\" + ch.charCodeAt( ch.length - 1 ).toString( 16 ) + " ";
		}

		// Other potentially-special ASCII characters get backslash-escaped
		return "\\" + ch;
	},

	// Used for iframes
	// See setDocument()
	// Removing the function wrapper causes a "Permission Denied"
	// error in IE
	unloadHandler = function() {
		setDocument();
	},
	//esns 是否包含在 disabledFieldset 当中，disabled 同时 it is a fieldset
	inDisabledFieldset = addCombinator( //esns 通过 addCombinator 和 dir:parentNode 变量 向上面 parentNode 一层层 查询 <1719>
		function( elem ) {
			return elem.disabled === true && elem.nodeName.toLowerCase() === "fieldset";
		},
		{ dir: "parentNode", next: "legend" }
	);
//esns 按照不同浏览器定义适合的 array push 函数
// Optimize for push.apply( _, NodeList )
try {
	push.apply(
		(arr = slice.call( preferredDoc.childNodes )), //esns 快速 复制一份 preferredDoc.childNodes，然后叠加进入 arr 数列
		preferredDoc.childNodes
	);
	// Support: Android<4.0
	// Detect silently failing push.apply
	arr[ preferredDoc.childNodes.length ].nodeType; //esns 调用 nodeType 使用 catch 来定义 Android<4.0 可以用的不同 push 函数 function
} catch ( e ) {
	push = { apply: arr.length ? //esns 设定 push.apply 的函数 [function]

		// Leverage slice if possible
		function( target, els ) {
			push_native.apply( target, slice.call(els) );
		} :

		// Support: IE<9
		// Otherwise append directly
		function( target, els ) {
			var j = target.length,
				i = 0;
			// Can't trust NodeList.length
			while ( (target[j++] = els[i++]) ) {}
			target.length = j - 1;
		}
	};
}
//esns 必须要 selector 和 context (默认为 当前的 root document) 才可以使用 3 个基本的 选择器功能 (byId, byTagName, byClassName)
function Sizzle( selector, context, results, seed ) { //esns 这个是 function declaration，所以 Sizzle 是一个 Object 对象
	var m, i, elem, nid, match, groups, newSelector,
		newContext = context && context.ownerDocument, 
		//esns 如果 context 是 element node，而 getElementById 只能在 document 中使用，所以使用 newContext 储存 通过 ownerDocument 得到它的 document context，然后使用 contains 测试得到的结果是否包含在原先的 element node 当中 <272>
		// nodeType defaults to 9, since context defaults to document
		nodeType = context ? context.nodeType : 9; //esns 默认为 文件类型 9 阅读 https://developer.mozilla.org/en-US/docs/Web/API/Node/nodeType

	results = results || []; //esns 接力配对成功的结果集合 results 或者 创建 initiate 最开始的 空数组

	// Return early from calls with invalid selector or context
	if ( typeof selector !== "string" || !selector || //esns 简单测试直接返回不符合要求的 selector
		nodeType !== 1 && nodeType !== 9 && nodeType !== 11 ) { //esns 只允许1,9,11类别的 node
		
		return results;
	}

	// Try to shortcut find operations (as opposed to filters) in HTML documents
	if ( !seed ) { //esns 如果需要筛选传递进来 seed 集合，就要使用 select 来处理 <350>

		if ( ( context ? context.ownerDocument || context : preferredDoc ) !== document ) { //esns 现在传递进来的 context 是否现在使用的 document 的 context
			setDocument( context ); // 按照 现在传递进来的 context 设置 document 的环境 函数
		}
		context = context || document; //esns 如果没有 context 就使用现在 document 当作 context

		if ( documentIsHTML ) {

			// If the selector is sufficiently simple, try using a "get*By*" DOM method
			// (excepting DocumentFragment context, where the methods don't exist)
			if ( nodeType !== 11 && (match = rquickExpr.exec( selector )) ) { //esns 符合简单要求的 selector [和] 非 fragment.noteType == 11 因为 fragment 没有 需要三个基本搜索功能

				// ID selector
				if ( (m = match[1]) ) { 

					// Document context
					if ( nodeType === 9 ) { //esns 如果是传进来的 context 是 document node 的话 就不要 测试 contains，因为没有用到 newContext
						if ( (elem = context.getElementById( m )) ) {

							// Support: IE, Opera, Webkit
							// TODO: identify versions
							// getElementById can match elements by name instead of ID
							if ( elem.id === m ) { //esns 确保不是通过 name 来配对 id 元素
								results.push( elem );
								return results;
							}
						} else { //esns 没有搜索到任何 元素，就直接返回 传进来的 results
							return results;
						}

					// Element context
					} else {

						// Support: IE, Opera, Webkit
						// TODO: identify versions
						// getElementById can match elements by name instead of ID
						if ( newContext && (elem = newContext.getElementById( m )) &&
							contains( context, elem ) && //esns 要保证 等到的结果 包含在 指定的 非 document 的原先 context 当中 <220>
							elem.id === m ) {

							results.push( elem );
							return results;
						}
					}

				// Type selector
				} else if ( match[2] ) {
					push.apply( results, context.getElementsByTagName( selector ) );
					return results;

				// Class selector
				} else if ( (m = match[3]) && support.getElementsByClassName &&
					context.getElementsByClassName ) {

					push.apply( results, context.getElementsByClassName( m ) );
					return results;
				}
			}

			// Take advantage of querySelectorAll
			if ( support.qsa && //esns 如果浏览器支持 querySelectAll，就使用
				!nonnativeSelectorCache[ selector + " " ] && 
				(!rbuggyQSA || !rbuggyQSA.test( selector )) && //esns 使用的 selector 是否在这个有 QSA 功能的浏览器中 有 BUG, 有就 不可以用，要用自己的 select 函数

				// Support: IE 8 only
				// Exclude object elements
				(nodeType !== 1 || context.nodeName.toLowerCase() !== "object") ) {

				newSelector = selector; //esns 准备修改 selector 为新的 newSelector
				newContext = context; //esns 设置为传进来的 context，因为 querySelectAll 支持 Element Node 阅读 https://developer.mozilla.org/en-US/docs/Web/API/Element/querySelectorAll

				// qSA considers elements outside a scoping root when evaluating child or
				// descendant combinators, which is not what we want.
				// In such cases, we work around the behavior by prefixing every selector in the
				// list with an ID selector referencing the scope context.
				// Thanks to Andrew Dupont for this technique.
				if ( nodeType === 1 && rdescend.test( selector ) ) { //esns 通过添加 #ID 到 selector 中，解决可能出现的 上面所描述的问题 如果有空格 [或者] > 

					// Capture the context ID, setting it first if necessary
					if ( (nid = context.getAttribute( "id" )) ) { //esns 如果有 id 的话 就获取，要不然就设置为 expando 值 <317>
						nid = nid.replace( rcssescape, fcssescape ); //esns 预处理 escape string
					} else {
						context.setAttribute( "id", (nid = expando) );
					}

					// Prefix every selector in the list
					groups = tokenize( selector );
					i = groups.length;
					while ( i-- ) {
						groups[i] = "#" + nid + " " + toSelector( groups[i] ); //esns 添加 #id 到 每一组 CSS selector 前
					}
					newSelector = groups.join( "," ); //esns 合并所有 各组的添加了 #id 的 css selector 可以一次性传给 浏览器查询，如果selector是正确格式的话
					
					// Expand context for sibling selectors 
					newContext = rsibling.test( selector ) && testContext( context.parentNode ) || //esns 如果是sibling的 selector，因为添加了 #id，必须用到上一级的 Node Context 才可以检测到需要的结果
						context;
				}

				try {
					push.apply( results,
						newContext.querySelectorAll( newSelector )
					);
					return results;
				} catch ( qsaError ) { // 错误格式 CSS selector syntaxError，没有执行上面的 return results，就会执行 select 代码 <350>
					nonnativeSelectorCache( selector, true );
				} finally {
					if ( nid === expando ) { //esns 如果 id 是我们设置的话，去掉设置的 id 属性值
						context.removeAttribute( "id" );
					}
				}
			}
		}
	}

	// All others
	return select( selector.replace( rtrim, "$1" ), context, results, seed ); //esns 启动使用 select 函数
}

/**
 * Create key-value caches of limited size
 * @returns {function(string, object)} Returns the Object data after storing it on itself with
 *	property name the (space-suffixed) string and (if the cache is larger than Expr.cacheLength)
 *	deleting the oldest entry
 */
function createCache() { //esns 用于创建缓存的帮助函数
	var keys = [];

	function cache( key, value ) {
		// Use (key + " ") to avoid collision with native prototype properties (see Issue #157)
		if ( keys.push( key + " " ) > Expr.cacheLength ) {
			// Only keep the most recent entries
			delete cache[ keys.shift() ];
		}
		return (cache[ key + " " ] = value);
	}
	return cache;
}

/**
 * Mark a function for special use by Sizzle
 * @param {Function} fn The function to mark
 */
function markFunction( fn ) { //esns 标注 setFilter 和 setMatcher的帮助函数
	fn[ expando ] = true;
	return fn;
}

/**
 * Support testing using an element
 * @param {Function} fn Passed the created element and returns a boolean result
 */
function assert( fn ) { //esns 创建fieldset元素，执行传进来的 fn 函数，用来实现浏览器能力检测的帮助函数
	var el = document.createElement("fieldset");

	try {
		return !!fn( el ); //esns 双!! 转换成 Boolean 函数
	} catch (e) {
		return false;
	} finally {
		// Remove from its parent by default
		if ( el.parentNode ) {
			el.parentNode.removeChild( el );
		}
		// release memory in IE
		el = null;
	}
}

/**
 * Adds the same handler for all of the specified attrs
 * @param {String} attrs Pipe-separated list of attributes
 * @param {Function} handler The method that will be applied
 */
function addHandle( attrs, handler ) { //esns IE8，IE9 的帮助函数???
	var arr = attrs.split("|"),
		i = arr.length;

	while ( i-- ) {
		Expr.attrHandle[ arr[i] ] = handler;
	}
}

/**
 * Checks document order of two siblings
 * @param {Element} a
 * @param {Element} b
 * @returns {Number} Returns less than 0 if a precedes b, greater than 0 if a follows b
 */
function siblingCheck( a, b ) { //esns 两元素相邻状况，返回-1时b为a后续的兄弟节点，1为其他情况  
	var cur = b && a,
		diff = cur && a.nodeType === 1 && b.nodeType === 1 &&
			a.sourceIndex - b.sourceIndex;
	// 使用IE的sourceIndex方法判断两元素是否相邻  	
	// Use IE sourceIndex if available on both nodes
	if ( diff ) {
		return diff;
	}

	// Check if b follows a
	if ( cur ) {
		while ( (cur = cur.nextSibling) ) {
			if ( cur === b ) {
				return -1;
			}
		}
	}

	return a ? 1 : -1;
}
//esns 开头有 create 都是工厂 factory pattern ???
/**
 * Returns a function to use in pseudos for input types
 * @param {String} type
 */
function createInputPseudo( type ) { //esns 控件伪类类型参数的核对函数 function - elem 是否 input 和相对应的 type
	return function( elem ) {
		var name = elem.nodeName.toLowerCase();
		return name === "input" && elem.type === type;
	};
}

/**
 * Returns a function to use in pseudos for buttons
 * @param {String} type
 */
function createButtonPseudo( type ) { //esns 按钮伪类类型参数的核对函数 function - elem 是否 input 和相对应的 type = submit/reset
	return function( elem ) {
		var name = elem.nodeName.toLowerCase();
		return (name === "input" || name === "button") && elem.type === type;
	};
}

/**
 * Returns a function to use in pseudos for :enabled/:disabled
 * @param {Boolean} disabled true for :disabled; false for :enabled
 */
function createDisabledPseudo( disabled ) { //esns 伪类-是否被禁止参数的核对函数 - disabled

	// Known :disabled false positives: fieldset[disabled] > legend:nth-of-type(n+2) :can-disable
	return function( elem ) {

		// Only certain elements can match :enabled or :disabled
		// https://html.spec.whatwg.org/multipage/scripting.html#selector-enabled
		// https://html.spec.whatwg.org/multipage/scripting.html#selector-disabled
		if ( "form" in elem ) { //esns 是否 elem 有 form 属性 property (包含在form当中都有)

			// Check for inherited disabledness on relevant non-disabled elements:
			// * listed form-associated elements in a disabled fieldset
			//   https://html.spec.whatwg.org/multipage/forms.html#category-listed
			//   https://html.spec.whatwg.org/multipage/forms.html#concept-fe-disabled
			// * option elements in a disabled optgroup
			//   https://html.spec.whatwg.org/multipage/forms.html#concept-option-disabled
			// All such elements have a "form" property.
			if ( elem.parentNode && elem.disabled === false ) {

				// Option elements defer to a parent optgroup if present
				if ( "label" in elem ) {
					if ( "label" in elem.parentNode ) {
						return elem.parentNode.disabled === disabled;
					} else {
						return elem.disabled === disabled;
					}
				}

				// Support: IE 6 - 11
				// Use the isDisabled shortcut property to check for disabled fieldset ancestors
				return elem.isDisabled === disabled ||

					// Where there is no isDisabled, check manually
					/* jshint -W018 */
					elem.isDisabled !== !disabled &&
						inDisabledFieldset( elem ) === disabled; //esns 是否包含在 disabled 的 fieldset 当中
			}

			return elem.disabled === disabled;

		// Try to winnow out elements that can't be disabled before trusting the disabled property.
		// Some victims get caught in our net (label, legend, menu, track), but it shouldn't
		// even exist on them, let alone have a boolean value.
		} else if ( "label" in elem ) {
			return elem.disabled === disabled;
		}

		// Remaining elements are neither :enabled nor :disabled
		return false;
	};
}

/**
 * Returns a function to use in pseudos for positionals
 * @param {Function} fn
 */
function createPositionalPseudo( fn ) { //esns 第一层 传入相对应的 伪类函数 fn，(多层 factory pattern?)
	return markFunction(function( argument ) { //esns 第二层 在 matcherFromToken 的时候 <1948> 传入伪类函数的 argument (例子 :not[div em] => pseudo fn = "not" , argument = "div em")
		argument = +argument;
		return markFunction(function( seed, matches ) { //esns 这个才是最终用来 筛选 seed 用的 setMatcher 函数 function
			var j,
				matchIndexes = fn( [], seed.length, argument ), //esns 通过 fn 后筛选的位置集合
				i = matchIndexes.length;

			// Match elements found at the specified indexes
			while ( i-- ) {
				if ( seed[ (j = matchIndexes[i]) ] ) {
					seed[j] = !(matches[j] = seed[j]); //esns 这里通过 ! 设置 seed[j] 为 false，condense 的时候可以使用 <1806>
				}
			}
		});
	});
}

/**
 * Checks a node for validity as a Sizzle context
 * @param {Element|Object=} context
 * @returns {Element|Object|Boolean} The input node if acceptable, otherwise a falsy value
 */
function testContext( context ) { //esns 是否有效 context 通过测试 是否有 getElementsByTagName
	return context && typeof context.getElementsByTagName !== "undefined" && context; // 最后添加 && context 这样 前面两个是 true 的话可以返回 context，省下几行代码
}

// Expose support vars for convenience
support = Sizzle.support = {};

/**
 * Detects XML nodes
 * @param {Element|Object} elem An element or a document
 * @returns {Boolean} True iff elem is a non-HTML XML node
 */
isXML = Sizzle.isXML = function( elem ) {
	var namespace = elem.namespaceURI,
		docElem = (elem.ownerDocument || elem).documentElement; //esns 如果是 elementNode 那就有 ownerDocument，要不然就已经是 document node

	// Support: IE <=8
	// Assume HTML when documentElement doesn't yet exist, such as inside loading iframes
	// https://bugs.jquery.com/ticket/4833
	return !rhtml.test( namespace || docElem && docElem.nodeName || "HTML" );
};

/**
 * Sets document-related variables once based on the current document
 * @param {Element|Object} [doc] An element or document object to use to set the document
 * @returns {Object} Returns the current document
 */
setDocument = Sizzle.setDocument = function( node ) { //esns 按照当前 context 设定环境变量
	var hasCompare, subWindow,
		doc = node ? node.ownerDocument || node : preferredDoc; // esns 设定 适当的 文档，没有node就用 preferedDoc (document)，如果不是 xml，就用 document node 或者从 element node 转换为 document node

	// Return early if doc is invalid or already selected
	if ( doc === document || doc.nodeType !== 9 || !doc.documentElement ) { //esns 已经设定好 或者 无效 doc 就直接返回
		return document; 
	}
	//esns 这里的 document 是 Sizzle 的 scope 变量 不是 window.document 不要搞错了
	// Update global variables
	document = doc; //esns 这个不是 window.document，而是设定 function scope 中的的 document，可以是 html 或者 xml 文件
	docElem = document.documentElement; 
	documentIsHTML = !isXML( document );

	// Support: IE 9-11, Edge
	// Accessing iframe documents after unload throws "permission denied" errors (jQuery #13936)
	if ( preferredDoc !== document &&
		(subWindow = document.defaultView) && subWindow.top !== subWindow ) { //esns 如果是 iframe 的话，添加 IE 的 unload 处理上面所描述的 error 问题

		// Support: IE 11, Edge
		if ( subWindow.addEventListener ) {
			subWindow.addEventListener( "unload", unloadHandler, false );

		// Support: IE 9 - 10 only
		} else if ( subWindow.attachEvent ) {
			subWindow.attachEvent( "onunload", unloadHandler );
		}
	}

	/* Attributes
	---------------------------------------------------------------------- */

	// Support: IE<8
	// Verify that getAttribute really returns attributes and not properties
	// (excepting IE8 booleans)
	support.attributes = assert(function( el ) {
		el.className = "i";
		return !el.getAttribute("className");
	});

	/* getElement(s)By*
	---------------------------------------------------------------------- */

	// Check if getElementsByTagName("*") returns only elements
	support.getElementsByTagName = assert(function( el ) {
		el.appendChild( document.createComment("") );
		return !el.getElementsByTagName("*").length;
	});

	// Support: IE<9
	support.getElementsByClassName = rnative.test( document.getElementsByClassName );

	// Support: IE<10
	// Check if getElementById returns elements by name
	// The broken getElementById methods don't pick up programmatically-set names,
	// so use a roundabout getElementsByName test
	support.getById = assert(function( el ) {
		docElem.appendChild( el ).id = expando;
		return !document.getElementsByName || !document.getElementsByName( expando ).length;
	});
	// esns 寻找 ID Class Tag 的最基础 功能，filter 是检测 elem 是否符合，find 是寻找符合的 elems 元素集合
	// ID filter and find
	if ( support.getById ) {
		Expr.filter["ID"] = function( id ) {
			var attrId = id.replace( runescape, funescape );
			return function( elem ) {
				return elem.getAttribute("id") === attrId;
			};
		};
		Expr.find["ID"] = function( id, context ) {
			if ( typeof context.getElementById !== "undefined" && documentIsHTML ) {
				var elem = context.getElementById( id );
				return elem ? [ elem ] : [];
			}
		};
	} else { //esns 使用 getAttributeNode 而不是 getAttribute，然后再获得 value
		Expr.filter["ID"] =  function( id ) {
			var attrId = id.replace( runescape, funescape );
			return function( elem ) {
				var node = typeof elem.getAttributeNode !== "undefined" &&
					elem.getAttributeNode("id");
				return node && node.value === attrId;
			};
		};

		// Support: IE 6 - 7 only
		// getElementById is not reliable as a find shortcut
		Expr.find["ID"] = function( id, context ) {
			if ( typeof context.getElementById !== "undefined" && documentIsHTML ) {
				var node, i, elems,
					elem = context.getElementById( id );

				if ( elem ) {

					// Verify the id attribute
					node = elem.getAttributeNode("id");
					if ( node && node.value === id ) {
						return [ elem ];
					}

					// Fall back on getElementsByName
					elems = context.getElementsByName( id );
					i = 0;
					while ( (elem = elems[i++]) ) {
						node = elem.getAttributeNode("id");
						if ( node && node.value === id ) {
							return [ elem ];
						}
					}
				}

				return [];
			}
		};
	}

	// Tag
	Expr.find["TAG"] = support.getElementsByTagName ?
		function( tag, context ) {
			if ( typeof context.getElementsByTagName !== "undefined" ) {
				return context.getElementsByTagName( tag );

			// DocumentFragment nodes don't have gEBTN
			} else if ( support.qsa ) {
				return context.querySelectorAll( tag );
			}
		} :

		function( tag, context ) {
			var elem,
				tmp = [],
				i = 0,
				// By happy coincidence, a (broken) gEBTN appears on DocumentFragment nodes too
				results = context.getElementsByTagName( tag );

			// Filter out possible comments
			if ( tag === "*" ) {
				while ( (elem = results[i++]) ) {
					if ( elem.nodeType === 1 ) { //esns 只允许 ELEMENT_NODE，其他比如 comment node 都不可以
						tmp.push( elem );
					}
				}

				return tmp;
			}
			return results;
		};

	// Class
	Expr.find["CLASS"] = support.getElementsByClassName && function( className, context ) { //esns 如果不支持 getElementsByClassName 就被赋值为 null，比如 XML 文档
		if ( typeof context.getElementsByClassName !== "undefined" && documentIsHTML ) {
			return context.getElementsByClassName( className );
		}
	};

	/* QSA/matchesSelector
	---------------------------------------------------------------------- */

	// QSA and matchesSelector support

	// matchesSelector(:active) reports false when true (IE9/Opera 11.5)
	rbuggyMatches = []; //esns 储存处理支持 matches 功能 浏览器的 bug 集合

	// qSa(:focus) reports false when true (Chrome 21)
	// We allow this because of a bug in IE8/9 that throws an error
	// whenever `document.activeElement` is accessed on an iframe
	// So, we allow :focus to pass through QSA all the time to avoid the IE error
	// See https://bugs.jquery.com/ticket/13378
	rbuggyQSA = []; //esns 处理支持该功能 QuerySelectAll 浏览器的 bug

	if ( (support.qsa = rnative.test( document.querySelectorAll )) ) {
		// Build QSA regex
		// Regex strategy adopted from Diego Perini
		assert(function( el ) {
			// Select is set to empty string on purpose
			// This is to test IE's treatment of not explicitly
			// setting a boolean content attribute,
			// since its presence should be enough
			// https://bugs.jquery.com/ticket/12359
			docElem.appendChild( el ).innerHTML = "<a id='" + expando + "'></a>" +
				"<select id='" + expando + "-\r\\' msallowcapture=''>" +
				"<option selected=''></option></select>";

			// Support: IE8, Opera 11-12.16
			// Nothing should be selected when empty strings follow ^= or $= or *=
			// The test attribute must be unknown in Opera but "safe" for WinRT
			// https://msdn.microsoft.com/en-us/library/ie/hh465388.aspx#attribute_section
			if ( el.querySelectorAll("[msallowcapture^='']").length ) {
				rbuggyQSA.push( "[*^$]=" + whitespace + "*(?:''|\"\")" );
			}

			// Support: IE8
			// Boolean attributes and "value" are not treated correctly
			if ( !el.querySelectorAll("[selected]").length ) {
				rbuggyQSA.push( "\\[" + whitespace + "*(?:value|" + booleans + ")" );
			}

			// Support: Chrome<29, Android<4.4, Safari<7.0+, iOS<7.0+, PhantomJS<1.9.8+
			if ( !el.querySelectorAll( "[id~=" + expando + "-]" ).length ) {
				rbuggyQSA.push("~=");
			}

			// Webkit/Opera - :checked should return selected option elements
			// http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
			// IE8 throws error here and will not see later tests
			if ( !el.querySelectorAll(":checked").length ) {
				rbuggyQSA.push(":checked");
			}

			// Support: Safari 8+, iOS 8+
			// https://bugs.webkit.org/show_bug.cgi?id=136851
			// In-page `selector#id sibling-combinator selector` fails
			if ( !el.querySelectorAll( "a#" + expando + "+*" ).length ) {
				rbuggyQSA.push(".#.+[+~]");
			}
		});

		assert(function( el ) {
			el.innerHTML = "<a href='' disabled='disabled'></a>" +
				"<select disabled='disabled'><option/></select>";

			// Support: Windows 8 Native Apps
			// The type and name attributes are restricted during .innerHTML assignment
			var input = document.createElement("input");
			input.setAttribute( "type", "hidden" );
			el.appendChild( input ).setAttribute( "name", "D" );

			// Support: IE8
			// Enforce case-sensitivity of name attribute
			if ( el.querySelectorAll("[name=d]").length ) {
				rbuggyQSA.push( "name" + whitespace + "*[*^$|!~]?=" );
			}

			// FF 3.5 - :enabled/:disabled and hidden elements (hidden elements are still enabled)
			// IE8 throws error here and will not see later tests
			if ( el.querySelectorAll(":enabled").length !== 2 ) {
				rbuggyQSA.push( ":enabled", ":disabled" );
			}

			// Support: IE9-11+
			// IE's :disabled selector does not pick up the children of disabled fieldsets
			docElem.appendChild( el ).disabled = true;
			if ( el.querySelectorAll(":disabled").length !== 2 ) {
				rbuggyQSA.push( ":enabled", ":disabled" );
			}

			// Opera 10-11 does not throw on post-comma invalid pseudos
			el.querySelectorAll("*,:x");
			rbuggyQSA.push(",.*:");
		});
	}

	if ( (support.matchesSelector = rnative.test( (matches = docElem.matches ||
		docElem.webkitMatchesSelector ||
		docElem.mozMatchesSelector ||
		docElem.oMatchesSelector ||
		docElem.msMatchesSelector) )) ) {

		assert(function( el ) {
			// Check to see if it's possible to do matchesSelector
			// on a disconnected node (IE 9)
			support.disconnectedMatch = matches.call( el, "*" ); //esns 是否支持没有 parentNode 分离的 node

			// This should fail with an exception
			// Gecko does not error, returns false instead
			matches.call( el, "[s!='']:x" );
			rbuggyMatches.push( "!=", pseudos ); //esns 抵达这里要上面一行的代码 没有出现 error 才可以
		});
	}

	rbuggyQSA = rbuggyQSA.length && new RegExp( rbuggyQSA.join("|") ); //esns 用 pipe line 连接起来
	rbuggyMatches = rbuggyMatches.length && new RegExp( rbuggyMatches.join("|") );

	/* Contains
	---------------------------------------------------------------------- */
	hasCompare = rnative.test( docElem.compareDocumentPosition ); //esns 是否浏览器有确定 两个 Node 位置关系 的 compareDocumentPosition 函数 function

	// Element contains another
	// Purposefully self-exclusive
	// As in, an element does not contain itself
	contains = hasCompare || rnative.test( docElem.contains ) ? //esns 是否包含这个 Node 的函数 function
		function( a, b ) {
			var adown = a.nodeType === 9 ? a.documentElement : a, //esns 这里 adown 等于 a 本身，并没有向下移动
				bup = b && b.parentNode; //esns 有 b 存在的话，b就向上移动
			return a === bup || !!( bup && bup.nodeType === 1 && ( //esns 如果 bup 还是 ELEMENT_NODE，就 recursive 继续测试
				adown.contains ?
					adown.contains( bup ) : //esns 如果有contains 函数，就 recursive 测试，继续提升 bup
					a.compareDocumentPosition && a.compareDocumentPosition( bup ) & 16 //esns 如果有 compareDocumentPosition 函数就直接使用，阅读 https://developer.mozilla.org/en-US/docs/Web/API/Node/compareDocumentPosition
			));
		} :
		function( a, b ) {
			if ( b ) {
				while ( (b = b.parentNode) ) {
					if ( b === a ) {
						return true;
					}
				}
			}
			return false;
		};

	/* Sorting
	---------------------------------------------------------------------- */

	// Document order sorting
	sortOrder = hasCompare ? //esns 集合 sort 的时候用的 function 阅读 https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort
	function( a, b ) {

		// Flag for duplicate removal
		if ( a === b ) {
			hasDuplicate = true;
			return 0;
		}

		// Sort on method existence if only one input has compareDocumentPosition
		var compare = !a.compareDocumentPosition - !b.compareDocumentPosition;
		if ( compare ) {
			return compare;
		}

		// Calculate position if both inputs belong to the same document
		compare = ( a.ownerDocument || a ) === ( b.ownerDocument || b ) ?
			a.compareDocumentPosition( b ) :

			// Otherwise we know they are disconnected
			1;

		// Disconnected nodes
		if ( compare & 1 || //esns 比较用的 bit operator - 阅读 https://developer.mozilla.org/en-US/docs/Web/API/Node/compareDocumentPosition
			(!support.sortDetached && b.compareDocumentPosition( a ) === compare) ) {

			// Choose the first element that is related to our preferred document
			if ( a === document || a.ownerDocument === preferredDoc && contains(preferredDoc, a) ) {
				return -1;
			}
			if ( b === document || b.ownerDocument === preferredDoc && contains(preferredDoc, b) ) {
				return 1;
			}

			// Maintain original order
			return sortInput ?
				( indexOf( sortInput, a ) - indexOf( sortInput, b ) ) :
				0;
		}

		return compare & 4 ? -1 : 1;  
	} :
	function( a, b ) {
		// Exit early if the nodes are identical
		if ( a === b ) {
			hasDuplicate = true;
			return 0;
		}

		var cur,
			i = 0,
			aup = a.parentNode,
			bup = b.parentNode,
			ap = [ a ],
			bp = [ b ];

		// Parentless nodes are either documents or disconnected
		if ( !aup || !bup ) {
			return a === document ? -1 :
				b === document ? 1 :
				aup ? -1 :
				bup ? 1 :
				sortInput ?
				( indexOf( sortInput, a ) - indexOf( sortInput, b ) ) :
				0;

		// If the nodes are siblings, we can do a quick check
		} else if ( aup === bup ) {
			return siblingCheck( a, b );
		}

		// Otherwise we need full lists of their ancestors for comparison
		cur = a;
		while ( (cur = cur.parentNode) ) {
			ap.unshift( cur );
		}
		cur = b;
		while ( (cur = cur.parentNode) ) {
			bp.unshift( cur );
		}

		// Walk down the tree looking for a discrepancy
		while ( ap[i] === bp[i] ) {
			i++;
		}

		return i ?
			// Do a sibling check if the nodes have a common ancestor
			siblingCheck( ap[i], bp[i] ) :

			// Otherwise nodes in our document sort first
			ap[i] === preferredDoc ? -1 :
			bp[i] === preferredDoc ? 1 :
			0;
	};

	return document;
};

Sizzle.matches = function( expr, elements ) { //esns 筛选出符合 expr 的 elements，然后返回这些符合的 elements 数组 array
	return Sizzle( expr, null, null, elements ); //esns 使用 Sizzle 函数，达到上面的目的
};

Sizzle.matchesSelector = function( elem, expr ) { //esns 这个 elem 是否符合 expr selector 的条件
	// Set document vars if needed
	if ( ( elem.ownerDocument || elem ) !== document ) {
		setDocument( elem );
	}

	if ( support.matchesSelector && documentIsHTML &&
		!nonnativeSelectorCache[ expr + " " ] && 
		( !rbuggyMatches || !rbuggyMatches.test( expr ) ) && 
		( !rbuggyQSA     || !rbuggyQSA.test( expr ) ) ) { 

		try {
			var ret = matches.call( elem, expr ); //esns 这个不是 Sizzle.matches <981>，而是使用浏览器的对比 matches 函数，https://developer.mozilla.org/en-US/docs/Web/API/Element/matches

			// IE 9's matchesSelector returns false on disconnected nodes
			if ( ret || support.disconnectedMatch ||
					// As well, disconnected nodes are said to be in a document
					// fragment in IE 9
					elem.document && elem.document.nodeType !== 11 ) {
				return ret;
			}
		} catch (e) { //esns 出现非适当格式的 selector
			nonnativeSelectorCache( expr, true );
		}
	}

	return Sizzle( expr, document, null, [ elem ] ).length > 0; //esns 传进去的seed 就一个元素，所以得到的结果集合只要大于 0 就正好
};

Sizzle.contains = function( context, elem ) {
	// Set document vars if needed
	if ( ( context.ownerDocument || context ) !== document ) {
		setDocument( context );
	}
	return contains( context, elem ); //esns 如果需要以上的设定 setDocument，做完之后，使用 设置好的 contains 函数 <857>
};

Sizzle.attr = function( elem, name ) { //esns 寻找 元素 element 中 attribute 的值 val
	// Set document vars if needed
	if ( ( elem.ownerDocument || elem ) !== document ) {
		setDocument( elem );
	}

	var fn = Expr.attrHandle[ name.toLowerCase() ], 
		// Don't get fooled by Object.prototype properties (jQuery #13807)
		val = fn && hasOwn.call( Expr.attrHandle, name.toLowerCase() ) ?
			fn( elem, name, !documentIsHTML ) :
			undefined;

	return val !== undefined ?
		val :
		support.attributes || !documentIsHTML ?
			elem.getAttribute( name ) :
			(val = elem.getAttributeNode(name)) && val.specified ?
				val.value :
				null;
};

Sizzle.escape = function( sel ) { //esns 一个处理转义字符 string 的辅助函数 helper function
	return (sel + "").replace( rcssescape, fcssescape );
};

Sizzle.error = function( msg ) {
	throw new Error( "Syntax error, unrecognized expression: " + msg );
};

/**
 * Document sorting and removing duplicates
 * @param {ArrayLike} results
 */
Sizzle.uniqueSort = function( results ) {
	var elem,
		duplicates = [],
		j = 0,
		i = 0;

	// Unless we *know* we can detect duplicates, assume their presence
	hasDuplicate = !support.detectDuplicates;
	sortInput = !support.sortStable && results.slice( 0 ); //esns 使用 slice(0) 复制 results
	results.sort( sortOrder ); //esns 使用 sortOrder 函数，运行中会设置 hasDuplicate 这个 Sizzle scope global 变量 <882>

	if ( hasDuplicate ) {
		while ( (elem = results[i++]) ) { //esns 记住 results 已经 sort 过，所有重复的元素都 紧靠在一起
			if ( elem === results[ i ] ) {
				j = duplicates.push( i ); //esns 把 duplicate 的重复元素位置 index 放入 duplicates array 中
			}
		}
		while ( j-- ) {s
			results.splice( duplicates[ j ], 1 ); //esns 去掉 duplicate 的重复元素
		}
	}

	// Clear input after sorting to release objects
	// See https://github.com/jquery/sizzle/pull/225
	sortInput = null;

	return results;
};

/**
 * Utility function for retrieving the text value of an array of DOM nodes
 * @param {Array|Element} elem
 */
getText = Sizzle.getText = function( elem ) { //esns 获取 elem node 节点及其子节点的文本内容 
	var node,
		ret = "",
		i = 0,
		nodeType = elem.nodeType;

	if ( !nodeType ) {
		// If no nodeType, this is expected to be an array
		while ( (node = elem[i++]) ) {
			// Do not traverse comment nodes
			ret += getText( node ); //esns 通过 recursive 获取所有节点的 text
		}
	} else if ( nodeType === 1 || nodeType === 9 || nodeType === 11 ) { //esns 类别 https://developer.mozilla.org/en-US/docs/Web/API/Node/nodeType
		// Use textContent for elements
		// innerText usage removed for consistency of new lines (jQuery #11153)
		if ( typeof elem.textContent === "string" ) {
			return elem.textContent;
		} else {
			// Traverse its children
			for ( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
				ret += getText( elem );
			}
		}
	} else if ( nodeType === 3 || nodeType === 4 ) { //esns TEXT_NODE 和 CDATA_SECTION_NODE (仅适用于 xml 文档)
		return elem.nodeValue;
	}
	// Do not include comment or processing instruction nodes

	return ret;
};

Expr = Sizzle.selectors = {

	// Can be adjusted by the user
	cacheLength: 50,

	createPseudo: markFunction, // esns 扩展 pseudo setFilter 函数 function 的时候使用 <test/unit/extending.js:14>

	match: matchExpr, //esns <110>

	attrHandle: {},

	find: {},

	relative: {
		">": { dir: "parentNode", first: true }, //esns 这个 first 代表 在 addCombinator 函数 <1719> 中 只能使用第一个配对的元素，如果不是 true 的话，任何之后配对的元素 都可以用
		" ": { dir: "parentNode" }, //esns 这里 dir 代表 在 addCombinator 函数 <1719> 中 查询的方向 (parentNode/previousSibling)
		"+": { dir: "previousSibling", first: true },
		"~": { dir: "previousSibling" } 
	},

	preFilter: { //esns 在tokenize 函数 function 中 <1681> 简单的预处理 matchExpr 得到的 match，来进行简化
		"ATTR": function( match ) {
			match[1] = match[1].replace( runescape, funescape ); //esns 转义字符

			// Move the given value to match[3] whether quoted or unquoted
			match[3] = ( match[3] || match[4] || match[5] || "" ).replace( runescape, funescape ); //esns 配对的结果 归于 match[3]

			if ( match[2] === "~=" ) { //esns 如果是 match[2] 是 ～=, match[3] 两边要添加空格 
				match[3] = " " + match[3] + " ";
			}

			return match.slice( 0, 4 ); //esns 只需剩下 前面四个元素，0-3 index
		},

		"CHILD": function( match ) {
			/* matches from matchExpr["CHILD"]
				1 type (only|nth|...)
				2 what (child|of-type)
				3 argument (even|odd|\d*|\d*n([+-]\d+)?|...)
				4 xn-component of xn+y argument ([+-]?\d*n|)
				5 sign of xn-component
				6 x of xn-component
				7 sign of y-component
				8 y of y-component
			*/
			match[1] = match[1].toLowerCase();
			//esns 预处理关于 nth-* 的 child  selector
			if ( match[1].slice( 0, 3 ) === "nth" ) {
				// nth-* requires argument
				if ( !match[3] ) {
					Sizzle.error( match[0] );
				}

				// numeric x and y parameters for Expr.filter.CHILD
				// remember that false/true cast respectively to 0/1
				match[4] = +( match[4] ? match[5] + (match[6] || 1) : 2 * ( match[3] === "even" || match[3] === "odd" ) );
				match[5] = +( ( match[7] + match[8] ) || match[3] === "odd" );

			// other types prohibit arguments
			} else if ( match[3] ) {
				Sizzle.error( match[0] );
			}

			return match;
		},

		"PSEUDO": function( match ) {
			var excess,
				unquoted = !match[6] && match[2]; //esns 是否没有 单引号 双引号 配对

			if ( matchExpr["CHILD"].test( match[0] ) ) { //esns 是否应当属于 child selector
				return null; //esns 返回 null 给 tokenize 函数 function 进行适当的 Child 配对 Match 的机会
			}

			// Accept quoted arguments as-is
			if ( match[3] ) {
				match[2] = match[4] || match[5] || ""; //esns 其他都整理到 match[2]，最后结尾削减 slice(0,3)

			// Strip excess characters from unquoted arguments
			} else if ( unquoted && rpseudo.test( unquoted ) &&
				// Get excess from tokenize (recursively)
				(excess = tokenize( unquoted, true )) &&
				// advance to the next closing parenthesis
				(excess = unquoted.indexOf( ")", unquoted.length - excess ) - unquoted.length) ) {

				// excess is a negative index
				match[0] = match[0].slice( 0, excess );
				match[2] = unquoted.slice( 0, excess );
			}

			// Return only captures needed by the pseudo filter method (type and argument)
			return match.slice( 0, 3 );
		}
	},

	filter: { // 筛选 element 的函数集合 functions，在 matcherFromTokens <1920> 中 invoke 的时候 会返回一个 function (这个是 factory pattern??)

		"TAG": function( nodeNameSelector ) {
			var nodeName = nodeNameSelector.replace( runescape, funescape ).toLowerCase();
			return nodeNameSelector === "*" ? 
				function() { return true; } : //esns 如果是 * 那什么 tag 都可以
				function( elem ) {
					return elem.nodeName && elem.nodeName.toLowerCase() === nodeName; //是否相同的 tag name
				};
		},

		"CLASS": function( className ) {
			var pattern = classCache[ className + " " ]; //esns 如果已经创建 获取该 class 相对的 regexp pattern 缓存

			return pattern || //esns 返回已经 cache 的 pattern，如果没有，继续下一步，设置 pattern RegExp，然后返回一个函数方程 function
				(pattern = new RegExp( "(^|" + whitespace + ")" + className + "(" + whitespace + "|$)" )) &&
				classCache( className, function( elem ) {
					return pattern.test( typeof elem.className === "string" && elem.className || typeof elem.getAttribute !== "undefined" && elem.getAttribute("class") || "" );
				});
		},

		"ATTR": function( name, operator, check ) {//esns 这里的 check 是 invoke 时候传进来比对 element 用的 string 
			return function( elem ) {
				var result = Sizzle.attr( elem, name );

				if ( result == null ) {
					return operator === "!="; //esns 没有 result 在 != 时候 就是 true
				}
				if ( !operator ) {
					return true; //esns 通过上面就是有 result，如果没有 operator，就成功配对了，return true
				}

				result += ""; //esns 转换为 string
				//esns 阅读 https://developer.mozilla.org/en-US/docs/Web/CSS/Attribute_selectors
				return operator === "=" ? result === check : 
					operator === "!=" ? result !== check :
					operator === "^=" ? check && result.indexOf( check ) === 0 :
					operator === "*=" ? check && result.indexOf( check ) > -1 :
					operator === "$=" ? check && result.slice( -check.length ) === check :
					operator === "~=" ? ( " " + result.replace( rwhitespace, " " ) + " " ).indexOf( check ) > -1 :
					operator === "|=" ? result === check || result.slice( 0, check.length + 1 ) === check + "-" :
					false;
			};
		},

		"CHILD": function( type, what, argument, first, last ) {
			var simple = type.slice( 0, 3 ) !== "nth", //esns 阅读 https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/slice
				forward = type.slice( -4 ) !== "last", //esns 阅读 https://developer.mozilla.org/en-US/docs/Web/CSS/Pseudo-classes
				ofType = what === "of-type"; //esns 阅读 https://developer.mozilla.org/en-US/docs/Web/CSS/:last-of-type

			return first === 1 && last === 0 ?

				// Shortcut for :nth-*(n)
				function( elem ) {
					return !!elem.parentNode; //esns 这个 nth-*(n) 代表任何子集???
				} :
				//esns 判断 child 伪类的 情况
				function( elem, context, xml ) {
					var cache, uniqueCache, outerCache, node, nodeIndex, start,
						dir = simple !== forward ? "nextSibling" : "previousSibling", //esns 查询的方向 
						parent = elem.parentNode,
						name = ofType && elem.nodeName.toLowerCase(),
						useCache = !xml && !ofType,
						diff = false;

					if ( parent ) {

						// :(first|last|only)-(child|of-type)
						if ( simple ) { //esns 符合以上的都是简单类型，比如 (first-child,last-child,only-child 等等)
							while ( dir ) {
								node = elem;
								while ( (node = node[ dir ]) ) {
									if ( ofType ?
										node.nodeName.toLowerCase() === name :
										node.nodeType === 1 ) {

										return false;
									}
								}
								// Reverse direction for :only-* (if we haven't yet done so)
								start = dir = type === "only" && !start && "nextSibling";
							}
							return true;
						}

						start = [ forward ? parent.firstChild : parent.lastChild ];

						// non-xml :nth-child(...) stores cache data on `parent`
						if ( forward && useCache ) {

							// Seek `elem` from a previously-cached index

							// ...in a gzip-friendly way
							node = parent;
							outerCache = node[ expando ] || (node[ expando ] = {});

							// Support: IE <9 only
							// Defend against cloned attroperties (jQuery gh-1709)
							uniqueCache = outerCache[ node.uniqueID ] ||
								(outerCache[ node.uniqueID ] = {});

							cache = uniqueCache[ type ] || [];
							nodeIndex = cache[ 0 ] === dirruns && cache[ 1 ];
							diff = nodeIndex && cache[ 2 ];
							node = nodeIndex && parent.childNodes[ nodeIndex ];

							while ( (node = ++nodeIndex && node && node[ dir ] ||

								// Fallback to seeking `elem` from the start
								(diff = nodeIndex = 0) || start.pop()) ) {

								// When found, cache indexes on `parent` and break
								if ( node.nodeType === 1 && ++diff && node === elem ) {
									uniqueCache[ type ] = [ dirruns, nodeIndex, diff ];
									break;
								}
							}

						} else {
							// Use previously-cached element index if available
							if ( useCache ) {
								// ...in a gzip-friendly way
								node = elem;
								outerCache = node[ expando ] || (node[ expando ] = {});

								// Support: IE <9 only
								// Defend against cloned attroperties (jQuery gh-1709)
								uniqueCache = outerCache[ node.uniqueID ] ||
									(outerCache[ node.uniqueID ] = {});

								cache = uniqueCache[ type ] || [];
								nodeIndex = cache[ 0 ] === dirruns && cache[ 1 ];
								diff = nodeIndex;
							}

							// xml :nth-child(...)
							// or :nth-last-child(...) or :nth(-last)?-of-type(...)
							if ( diff === false ) {
								// Use the same loop as above to seek `elem` from the start
								while ( (node = ++nodeIndex && node && node[ dir ] ||
									(diff = nodeIndex = 0) || start.pop()) ) {

									if ( ( ofType ?
										node.nodeName.toLowerCase() === name :
										node.nodeType === 1 ) &&
										++diff ) {

										// Cache the index of each encountered element
										if ( useCache ) {
											outerCache = node[ expando ] || (node[ expando ] = {});

											// Support: IE <9 only
											// Defend against cloned attroperties (jQuery gh-1709)
											uniqueCache = outerCache[ node.uniqueID ] ||
												(outerCache[ node.uniqueID ] = {});

											uniqueCache[ type ] = [ dirruns, diff ];
										}

										if ( node === elem ) {
											break;
										}
									}
								}
							}
						}

						// Incorporate the offset, then check against cycle size
						diff -= last;
						return diff === first || ( diff % first === 0 && diff / first >= 0 );
					}
				};
		},

		"PSEUDO": function( pseudo, argument ) { //esns 例子 :not[div em] => pseudo = "not" , argument = "div em"
			// pseudo-class names are case-insensitive
			// http://www.w3.org/TR/selectors/#pseudo-classes
			// Prioritize by case sensitivity in case custom pseudos are added with uppercase letters
			// Remember that setFilters inherits from pseudos
			var args,
				fn = Expr.pseudos[ pseudo ] || Expr.setFilters[ pseudo.toLowerCase() ] || //esns 使用配对的 过滤函数 function，用户添加的 定制 function有大写，先优先使用
					Sizzle.error( "unsupported pseudo: " + pseudo );

			// The user may use createPseudo to indicate that
			// arguments are needed to create the filter function
			// just as Sizzle does
			if ( fn[ expando ] ) {
				return fn( argument );
			}

			// But maintain support for old signatures //esns 要兼容以前使用的 代码格式  <test/unit/extending.js:62>
			if ( fn.length > 1 ) { //esns 现在使用的 function 最多有一个 argument 的 parameter，超过一个就可能是以前的 代码格式
				args = [ pseudo, pseudo, "", argument ];
				return Expr.setFilters.hasOwnProperty( pseudo.toLowerCase() ) ? //esns 是否是 pseudo 伪类 的 setFilter
					markFunction(function( seed, matches ) {
						var idx,
							matched = fn( seed, argument ),
							i = matched.length;
						while ( i-- ) {
							idx = indexOf( seed, matched[i] );
							seed[ idx ] = !( matches[ idx ] = matched[i] );
						}
					}) :
					function( elem ) {
						return fn( elem, 0, args );
					};
			}

			return fn;
		}
	},
	//esns 提供 seed 各种 setMatcher 过滤函数 functions
	pseudos: {
		// Potentially complex pseudos //esns NOT 本身是一个 setMatcher，elems 传入反向测试
		"not": markFunction(function( selector ) { //esns :not(这里面可以是完整的多 selector) 阅读https://developer.mozilla.org/en-US/docs/Web/CSS/:not
			// Trim the selector passed to compile
			// to avoid treating leading and trailing
			// spaces as combinators
			var input = [],
				results = [],
				matcher = compile( selector.replace( rtrim, "$1" ) ); //esns 编译 not 里面 完整的 的一组 trim 的 selector 得到一个 superMatcher，然后反向验证即可
				//esns 传入 seed 到 supermatcher 中的 elementMatchers 和 setMatchers 测试，然后反向
			return matcher[ expando ] ? //esns NOT 里面 编译的superMatcher是否有 setMatcher
				markFunction(function( seed, matches, context, xml ) { //esns 通过 markFunction 告诉当前的superMatcher 要传入 seed，而不是下面的 elem
					var elem,
						unmatched = matcher( seed, null, xml, [] ), //esns 没有 context，因为 :NOT 里面 selector context 是独立全新的
						i = seed.length;

					// Match elements unmatched by `matcher`
					while ( i-- ) { //esns 把 unmatched 里面 seed 每一个 elems 的 boolean 再倒过来
						if ( (elem = unmatched[i]) ) { //esns elem = 每个通过 NOT内嵌(selector) 的元素
							seed[i] = !(matches[i] = elem);
						}
					}
				}) :
				function( elem, context, xml ) { //esns 只有 elementMatcher 的 superMatcher
					input[0] = elem;
					matcher( input, null, xml, results ); //esns 因为传入的是 supermatcher，要转换为 elem input array， 没有 context，因为 :NOT 里面 selector context 是独立全新的
					// Don't keep the element (issue #299)
					input[0] = null;
					return !results.pop(); //esns 传入元素是单独的elem，是否反向通过
				};
		}),

		"has": markFunction(function( selector ) {
			return function( elem ) {
				return Sizzle( selector, elem ).length > 0; //esns 这里 elem 作为 context 传入，阅读https://developer.mozilla.org/en-US/docs/Web/CSS/:has
			};
		}),

		"contains": markFunction(function( text ) { //esns 是否包含 text 文字的 elem
			text = text.replace( runescape, funescape );
			return function( elem ) {
				return ( elem.textContent || getText( elem ) ).indexOf( text ) > -1;
			};
		}),

		// "Whether an element is represented by a :lang() selector
		// is based solely on the element's language value
		// being equal to the identifier C,
		// or beginning with the identifier C immediately followed by "-".
		// The matching of C against the element's language value is performed case-insensitively.
		// The identifier C does not have to be a valid language name."
		// http://www.w3.org/TR/selectors/#lang-pseudo
		"lang": markFunction( function( lang ) { //esns :lang(en)/:lang(\*-Latn) 阅读https://developer.mozilla.org/en-US/docs/Web/CSS/:lang
			// lang value must be a valid identifier
			if ( !ridentifier.test(lang || "") ) { //esns 是否合法的字符串
				Sizzle.error( "unsupported lang: " + lang );
			}
			lang = lang.replace( runescape, funescape ).toLowerCase();
			return function( elem ) {
				var elemLang;
				do {
					if ( (elemLang = documentIsHTML ?
						elem.lang : //esns 阅读 https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/lang
						elem.getAttribute("xml:lang") || elem.getAttribute("lang")) ) {

						elemLang = elemLang.toLowerCase();
						return elemLang === lang || elemLang.indexOf( lang + "-" ) === 0;
					}
				} while ( (elem = elem.parentNode) && elem.nodeType === 1 );
				return false;
			};
		}),

		// Miscellaneous
		"target": function( elem ) { //esns 阅读 https://developer.mozilla.org/en-US/docs/Web/CSS/:target
			var hash = window.location && window.location.hash;
			return hash && hash.slice( 1 ) === elem.id;
		},

		"root": function( elem ) { //esns 阅读 https://developer.mozilla.org/en-US/docs/Web/CSS/:root
			return elem === docElem; //esns 如果是 detached node，就没有 parentNode 就会返回 false
		},

		"focus": function( elem ) {
			return elem === document.activeElement && (!document.hasFocus || document.hasFocus()) && !!(elem.type || elem.href || ~elem.tabIndex);
		},

		// Boolean properties
		"enabled": createDisabledPseudo( false ),
		"disabled": createDisabledPseudo( true ),

		"checked": function( elem ) {
			// In CSS3, :checked should return both checked and selected elements
			// http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
			var nodeName = elem.nodeName.toLowerCase();
			return (nodeName === "input" && !!elem.checked) || (nodeName === "option" && !!elem.selected);
		},

		"selected": function( elem ) {
			// Accessing this property makes selected-by-default
			// options in Safari work properly
			if ( elem.parentNode ) {
				elem.parentNode.selectedIndex; //esns 修复浏览器Safari 的 bug 
			}

			return elem.selected === true;
		},

		// Contents
		"empty": function( elem ) { //esns 阅读 https://developer.mozilla.org/en-US/docs/Web/CSS/:empty
			// http://www.w3.org/TR/selectors/#empty-pseudo
			// :empty is negated by element (1) or content nodes (text: 3; cdata: 4; entity ref: 5),
			//   but not by others (comment: 8; processing instruction: 7; etc.)
			// nodeType < 6 works because attributes (2) do not appear as children
			for ( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
				if ( elem.nodeType < 6 ) {
					return false;
				}
			}
			return true;
		},

		"parent": function( elem ) { //esns 阅读 https://api.jquery.com/parent-selector/
			return !Expr.pseudos["empty"]( elem );
		},

		// Element/input types
		"header": function( elem ) {
			return rheader.test( elem.nodeName );
		},

		"input": function( elem ) {
			return rinputs.test( elem.nodeName );
		},

		"button": function( elem ) {
			var name = elem.nodeName.toLowerCase();
			return name === "input" && elem.type === "button" || name === "button";
		},

		"text": function( elem ) { //esns 阅读 https://api.jquery.com/text-selector/
			var attr;
			return elem.nodeName.toLowerCase() === "input" &&
				elem.type === "text" &&

				// Support: IE<8
				// New HTML5 attribute values (e.g., "search") appear with elem.type === "text"
				( (attr = elem.getAttribute("type")) == null || attr.toLowerCase() === "text" );
		},
		
		// Position-in-collection
		"first": createPositionalPseudo(function() {
			return [ 0 ];  //esns 只有第一个符合
		}),

		"last": createPositionalPseudo(function( matchIndexes, length ) {
			return [ length - 1 ]; //esns 只有最后一个符合
		}),
		//esns 对比值 argument
		"eq": createPositionalPseudo(function( matchIndexes, length, argument ) {
			return [ argument < 0 ? argument + length : argument ]; //esns 负数 index 的话 就加 length 值
		}),
		
		"even": createPositionalPseudo(function( matchIndexes, length ) {
			var i = 0;
			for ( ; i < length; i += 2 ) {
				matchIndexes.push( i ); //esns 添加每个 偶数的
			}
			return matchIndexes;
		}),

		"odd": createPositionalPseudo(function( matchIndexes, length ) {
			var i = 1;
			for ( ; i < length; i += 2 ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		}),

		"lt": createPositionalPseudo(function( matchIndexes, length, argument ) {
			var i = argument < 0 ? //esns 调整 负数 和 大于 length 的 argument 值
				argument + length :
				argument > length ?
					length :
					argument;
			for ( ; --i >= 0; ) { // 减值 一个个 放入 array 中
				matchIndexes.push( i );
			}
			return matchIndexes;
		}),

		"gt": createPositionalPseudo(function( matchIndexes, length, argument ) {
			var i = argument < 0 ? argument + length : argument;
			for ( ; ++i < length; ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		})
	}
};

Expr.pseudos["nth"] = Expr.pseudos["eq"]; //esns 没有 这种 nth 的存在, Sizzle 转义成  eq

// Add button/input type pseudos
for ( i in { radio: true, checkbox: true, file: true, password: true, image: true } ) {
	Expr.pseudos[ i ] = createInputPseudo( i );
}
for ( i in { submit: true, reset: true } ) {
	Expr.pseudos[ i ] = createButtonPseudo( i );
}

// Easy API for creating new setFilters
function setFilters() {} //esns 以下这么做 让扩展 setFilter 可以在外部添加，不需要触碰 内部代码
setFilters.prototype = Expr.filters = Expr.pseudos; //esns 这里是 filterS 不是 filter，差一个S，fitlerS=pseudos 都是setFilters用于 setMatchers，filter是elementMatcher 使用
Expr.setFilters = new setFilters();

tokenize = Sizzle.tokenize = function( selector, parseOnly ) {
	var matched, match, tokens, type,
		soFar, groups, preFilters,
		cached = tokenCache[ selector + " " ];

	if ( cached ) { 
		return parseOnly ? 0 : cached.slice( 0 ); //esns 通过 slice(0) 返回一个复制的 array 而不是原件
	}

	soFar = selector;
	groups = []; 
	preFilters = Expr.preFilter;

	while ( soFar ) {

		// Comma and first runs
		if ( !matched || (match = rcomma.exec( soFar )) ) { //esns 有处理掉遇到的 css 元素 matched，才尝试测试分组用的 (^领头的) 逗号连接的几组 selector (例子: #nice p , #cool p)
			if ( match ) { //esns 下一个是分组用的 逗号 comma
				// Don't consume trailing commas as valid 
				soFar = soFar.slice( match[0].length ) || soFar; //esns 如果 soFar 只剩下逗号，slice 不会起作用，sofar 不会改变，就检测为不符合规格的 selector <1703>
			}
			groups.push( (tokens = []) ); // 第一次肯定执行(因为matched 是 undefined )  或  有 领头的 "^，" 合规格的 selector 才会添加新的一组
		}

		matched = false; //esns 重新设置 boolean 变量 matched 
		//esns 阅读 https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Selectors#Combinators
		// Combinators
		if ( (match = rcombinators.exec( soFar )) ) {
			matched = match.shift(); //esns 配对的 "+>~ " combinator
			tokens.push({
				value: matched,
				// Cast descendant combinators to space
				type: match[0].replace( rtrim, " " )
			});
			soFar = soFar.slice( matched.length );
		}

		//esns 去掉 combinator 后配对 各种元素 相对应 的 function
		for ( type in Expr.filter ) { 
			if ( (match = matchExpr[ type ].exec( soFar )) && (!preFilters[ type ] || //esns 如果有 preFilter 就要 启动 preFilter Function 预处理简化 match
				(match = preFilters[ type ]( match ))) ) { //esns 预处理来整理配对出来的 match
				matched = match.shift(); //esns 取出第一个元素，放到 matched 中
				tokens.push({
					value: matched,
					type: type,
					matches: match //esns 完整保留取出 matched 后剩下的 RegExp.exec 返回的 array 值
				});
				soFar = soFar.slice( matched.length ); //esns 去掉配对完的 字符串 string
			}
		}

		if ( !matched ) {
			break; //esns 如果没有 matched，就代表 selector 格式出问题了，到了这里 就直接退了
		}
	}

	// Return the length of the invalid excess
	// if we're just parsing
	// Otherwise, throw an error or return tokens
	return parseOnly ?
		soFar.length :
		soFar ? //esns 如果有剩余的 selector string 就代表 selector 格式是 invalid，就 throw error，然后结束
			Sizzle.error( selector ) ://esns 有语义错误的直接丢出 throw error
			// Cache the tokens
			tokenCache( selector, groups ).slice( 0 ); //esns 缓存后 返回复印本
};

function toSelector( tokens ) { //esns 把一组的 tokens 变成 css selector String
	var i = 0,
		len = tokens.length,
		selector = "";
	for ( ; i < len; i++ ) {
		selector += tokens[i].value;
	}
	return selector;
}
//esns 这个用来 决定 查找 上下左右 范围的 函数 function
function addCombinator( matcher, combinator, base ) { //esns 传入用来配对的自定义函数 matcher 和 combinator 范围方向函数 (factory pattern?)
	var dir = combinator.dir,
		skip = combinator.next,
		key = skip || dir,
		checkNonElements = base && key === "parentNode",
		doneName = done++;

	return combinator.first ? //esns 是否只查询第一个元素就完成 "+" [或者] ">"
		// Check against closest ancestor/preceding element
		function( elem, context, xml ) {
			while ( (elem = elem[ dir ]) ) { //ense 最近的一个而已，不一定是紧挨的，一层层按照查询方向更新 elem，传入下一个 elementMatcher 中
				if ( elem.nodeType === 1 || checkNonElements ) {
					return matcher( elem, context, xml ); //esns 返回一个 matcher 函数 进行判断 就结束 while loop
				}
			}
			return false; //esns 如果没有元素符合 elem.nodeType === 1 || checkNonElements
		} :

		// Check against all ancestor/preceding elements
		function( elem, context, xml ) {
			var oldCache, uniqueCache, outerCache,
				newCache = [ dirruns, doneName ];

			// We can't set arbitrary data on XML nodes, so they don't benefit from combinator caching
			if ( xml ) {
				while ( (elem = elem[ dir ]) ) {
					if ( elem.nodeType === 1 || checkNonElements ) {
						if ( matcher( elem, context, xml ) ) { //esns 通过这样子检测，单一的不符合，不会直接判断为 false
							return true; //esns 而如果通过一个，直接就返回 true
						}
					}
				}
			} else {
				while ( (elem = elem[ dir ]) ) {
					if ( elem.nodeType === 1 || checkNonElements ) {
						outerCache = elem[ expando ] || (elem[ expando ] = {}); //esns 使用 cache 来避免重复进行???，初始化为空 Object

						// Support: IE <9 only
						// Defend against cloned attroperties (jQuery gh-1709)
						uniqueCache = outerCache[ elem.uniqueID ] || (outerCache[ elem.uniqueID ] = {});

						if ( skip && skip === elem.nodeName.toLowerCase() ) {
							elem = elem[ dir ] || elem; //esns 跳过现在的这个，但几乎用不到，好像只有 inDisabledFieldset 有用到
						} else if ( (oldCache = uniqueCache[ key ]) &&
							oldCache[ 0 ] === dirruns && oldCache[ 1 ] === doneName ) {

							// Assign to newCache so results back-propagate to previous elements
							return (newCache[ 2 ] = oldCache[ 2 ]);
						} else {
							// Reuse newcache so results back-propagate to previous elements
							uniqueCache[ key ] = newCache;

							// A match means we're done; a fail means we have to keep checking
							if ( (newCache[ 2 ] = matcher( elem, context, xml )) ) { //esns 通过这样子检测，单一的不符合，不会直接判断为 false
								return true; //esns 而如果通过一个，直接就返回 true
							}
						}
					}
				}
			}
			return false; //esns 如果全部都不通过，才返回 false
		};
}
//esns 封装 matchers 到可一层层 内嵌的 elementMatcher
function elementMatcher( matchers ) { //esns 把 matchers 封装入 elementMatcher，之后 invoke 这个 elementMatcher 的时候就取出 matchers，并倒过来执行其中 每一个 matcher
	return matchers.length > 1 ? //esns 超过一个 matcher 就每个 matcher 比对
		function( elem, context, xml ) { //esns 这里的 context 是 addCombinator 查询的时候会用到
			var i = matchers.length;
			while ( i-- ) { //esns 倒过来，从底部验证起
				if ( !matchers[i]( elem, context, xml ) ) { //esns 可以 recrusive call 内嵌的 elementMatcher 
					return false; //esns 一旦不符合其中之一 就 return false
				}
			}
			return true; // 符合全部 matcher 才可以是 true
		} :
		matchers[0]; //esns 只有一个 matcher 的时候
}
//esns 多 contexts，postFinder 可以传入 多个 elementNode 当作 多个 contexts，一次性获取所有通过 setMatcher 的 elems
function multipleContexts( selector, contexts, results ) {
	var i = 0,
		len = contexts.length;
	for ( ; i < len; i++ ) {
		Sizzle( selector, contexts[i], results );
	}
	return results;
}
//esns 去掉false和空的元素 [和] 使用 filter (elementMatcher) function 进行简缩 (elems seed)
function condense( unmatched, map, filter, context, xml ) {
	var elem,
		newUnmatched = [],
		i = 0,
		len = unmatched.length,
		mapped = map != null; //esns 是否有设定 map array 跟踪 筛选的 元素 index

	for ( ; i < len; i++ ) {
		if ( (elem = unmatched[i]) ) { //esns 在 setMatcher 运行过程中，不符合的元素会被标记为 false，这里去掉false和空的元素，有存在的元素，才会添加到 newUnmatched，进而紧缩
			if ( !filter || filter( elem, context, xml ) ) { //esns 没有filter函数 [或] 有filter存在 而且通过 filter 的 elem
				newUnmatched.push( elem );
				if ( mapped ) {
					map.push( i ); //esns 追踪 筛选的 元素 index
				}
			}
		}
	}

	return newUnmatched;
}
//esns 传入的是 seed 集合 <1834 seed> 所以叫做 setMatcher，elementMatcher 是一个个 element 传入 测试 <1785 element>
function setMatcher( preFilter, selector, matcher, postFilter, postFinder, postSelector ) {
	if ( postFilter && !postFilter[ expando ] ) { //esns 用到 postFilter 的情况 <test/unit/selector.js:1020-1023>
		postFilter = setMatcher( postFilter ); //esns 需要变成最基本的 setMatcher 用于 matchOut 的 array 集合 seed
	}
	if ( postFinder && !postFinder[ expando ] ) { //esns 如果 postFinder 是 elementMatcher 的话
		postFinder = setMatcher( postFinder, postSelector ); //esns 需要变成最基本的 setMatcher，接受 elems array 用做 contexts 来搜寻
	}
	return markFunction(function( seed, results, context, xml ) { //esns 如果是通过 postFinder 创建的 setMatcher，传进来的context 是一个 array，hence multipleContext
		var temp, i, elem,
			preMap = [],
			postMap = [],
			preexisting = results.length,

			// Get initial elements from seed or context
			elems = seed || multipleContexts( selector || "*", context.nodeType ? [ context ] : context, [] ), //esns 在此处获得 elem 集合

			// Prefilter to get matcher input, preserving a map for seed-results synchronization
			matcherIn = preFilter && ( seed || !selector ) ? //esns 使用 preFilter 来进行预先筛选 
				condense( elems, preMap, preFilter, context, xml ) :
				elems,

			matcherOut = matcher ? //esns 这里的 ? 对应 最后的 : matcherIn，中间三行是内嵌的 (?:) ternary conditional operator
				// If we have a postFinder, or filtered seed, or non-seed postFilter or preexisting results,
				postFinder || ( seed ? preFilter : preexisting || postFilter ) ? //esns 如果有 postFinder [或] (同时有 seed 和 preFilter) [或] 没有 seed 的 postFilter 或者 已经存在的 results

					// ...intermediate processing is necessary
					[] :

					// ...otherwise use results directly
					results :
				matcherIn; //esns 如果没有 matcher 函数 function 的话 matchOut 直接就等于 matchIn

		// Find primary matches
		if ( matcher ) { //esns 没有 matcher 函数 就跳过
			matcher( matcherIn, matcherOut, context, xml ); //esns 输入值 matcherIn，通过 setFilter <530> <1437> 后的 输出值 matcherOut
		}

		// Apply postFilter
		if ( postFilter ) {
			temp = condense( matcherOut, postMap ); //esns 复制 matchOut 到 temp中，标记 matcherOut 的 元素 Index 在 postMap 当中
			postFilter( temp, [], context, xml );

			// Un-match failing elements by moving them back to matcherIn
			i = temp.length;
			while ( i-- ) {
				if ( (elem = temp[i]) ) {
					matcherOut[ postMap[i] ] = !(matcherIn[ postMap[i] ] = elem);
				}
			}
		}

		if ( seed ) {
			if ( postFinder || preFilter ) {
				if ( postFinder ) {
					// Get the final matcherOut by condensing this intermediate into postFinder contexts
					temp = []; //esns 使用 temp 来传递 变量，保存 matcherOut
					i = matcherOut.length;
					while ( i-- ) {
						if ( (elem = matcherOut[i]) ) {
							// Restore matcherIn since elem is not yet a final match
							temp.push( (matcherIn[i] = elem) );
						}
					}
					postFinder( null, (matcherOut = []), temp, xml );
				}
				//esns 得到的最终结果，还需要跟seed核对，筛选 <test/unit/selector.js:1066>
				// Move matched elements from seed to results to keep them synchronized
				i = matcherOut.length;
				while ( i-- ) {
					if ( (elem = matcherOut[i]) &&
						(temp = postFinder ? indexOf( seed, elem ) : preMap[i]) > -1 ) {

						seed[temp] = !(results[temp] = elem); //esns 把可行的 elem 放到 results 中，然后设 seed 中的集为 false
					}
				}
			}

		// Add elements to results, through postFinder if defined
		} else {
			matcherOut = condense(
				matcherOut === results ?
					matcherOut.splice( preexisting, matcherOut.length ) : //esns 切到重复的部分?
					matcherOut
			);
			if ( postFinder ) {
				postFinder( null, results, matcherOut, xml ); //esns 使用 筛选后 收缩的 matcherOut 作为 新的 contexts 来寻找符合下一步的 elems
			} else {
				push.apply( results, matcherOut ); //esns 没有 postFinder，那只有目前通过所有检测的符合 elements 作为结果集返回
			}
		}
	});
}
//esns 从 token 创建 matcher
function matcherFromTokens( tokens ) {
	var checkContext, matcher, j,
		len = tokens.length,
		leadingRelative = Expr.relative[ tokens[0].type ], //esns 是否有引导关系开头
		implicitRelative = leadingRelative || Expr.relative[" "], //esns 如果没有存在的引导关系，就默认为 " "，查询所有 parentNode
		i = leadingRelative ? 1 : 0, //esns 有引导关系，就把开头的 index 设定为 1
		//esns 最外层的检测 function 检测的 context 是否达到 或 包含于最外层的 context
		// The foundational matcher ensures that elements are reachable from top-level context(s)
		matchContext = addCombinator( function( elem ) {
			return elem === checkContext; //esns 元素的context 是否等于 目标最外层的 checkContext 变量
		}, implicitRelative, true ), 
		matchAnyContext = addCombinator( function( elem ) {
			return indexOf( checkContext, elem ) > -1; //esns 检测的 context 是否包含在 目标最外层的 checkContext 变量中
		}, implicitRelative, true ),
		matchers = [ function( elem, context, xml ) { //esns 这里是 function declaration 还没有 invoke 执行里面的逻辑，执行后才会返回最后执行的 matchContext/matchAnyContext 函数 function
			var ret = ( !leadingRelative && ( xml || context !== outermostContext ) ) || ( //esns 非引导关系 和 (xml文档 或 非最外层 context)
				(checkContext = context).nodeType ? //esns 这里设置 checkContext 值，这样才用到下面两个 matchContext 上面的函数中的变量才有值
					matchContext( elem, context, xml ) : //esns 这里 invoke 然后 返回 boolean 值
					matchAnyContext( elem, context, xml ) ); //esns 注意这里的 () 配对 不要看错了 用编辑器 来帮助看
			// Avoid hanging onto element (issue #299) 
			checkContext = null; //esns 去掉 checkContext 避开 bug
			return ret;
		} ];

	for ( ; i < len; i++ ) { //esns 如果有引导关系 上面的 i 就要设置为 1 开始，就会跳过第一个元素
		if ( (matcher = Expr.relative[ tokens[i].type ]) ) { //esns 这里 matcher 是传入 addCombinator <1719> 的 combinator object 而不是 function
			matchers = [ addCombinator(elementMatcher( matchers ), matcher) ]; //esns 压缩现在的 matchers 为一个 elementMatcher，然后使用 addCombinator 内嵌
		} else {
			matcher = Expr.filter[ tokens[i].type ].apply( null, tokens[i].matches ); //esns 使用 apply 来传递 array of argument 创建 单个 matcher 函数
			
			// Return special upon seeing a positional matcher
			if ( matcher[ expando ] ) {
				// Find the next relative operator (if any) for proper handling
				j = ++i; //esns 下一个 i 的 index
				for ( ; j < len; j++ ) { 
					if ( Expr.relative[ tokens[j].type ] ) {
						break; //esns 如果找到下一个 relative 关系 的 index，确定了下面postFilter 和 postFinder 用的 j 截点 index 就跳出
					}
				}
				return setMatcher( 
					i > 1 && elementMatcher( matchers ), //esns preFilter 使用多层内嵌的 elementMatcher 来核对元素
					i > 1 && toSelector( //esns selector - matcher 之前的 selector
						// If the preceding token was a descendant combinator, insert an implicit any-element `*`
						tokens.slice( 0, i - 1 ).concat({ value: tokens[ i - 2 ].type === " " ? "*" : "" }) //esns 如上的英文解释
					).replace( rtrim, "$1" ),
					matcher, //esns matcher - setFilter 的 函数
					i < j && matcherFromTokens( tokens.slice( i, j ) ), //esns postFilter 核对元素的函数
					j < len && matcherFromTokens( (tokens = tokens.slice( j )) ), //esns postFinder 使用筛选得出的 contexts 进一步搜寻 
					j < len && toSelector( tokens ) //esns postSelector - postFilter/matcher 之后的 selector
				);
			}
			matchers.push( matcher ); //esns 添加 matcher function
		}
	}

	return elementMatcher( matchers ); //esns 最后并到一个集合中
}
//esns 集合所有 selector 各组(逗号，)创建的 superMatcher，然后合并在 results 中集中返回所有符合的项目
function matcherFromGroupMatchers( elementMatchers, setMatchers ) {
	var bySet = setMatchers.length > 0,
		byElement = elementMatchers.length > 0,
		superMatcher = function( seed, context, xml, results, outermost ) {
			var elem, j, matcher,
				matchedCount = 0,
				i = "0",
				unmatched = seed && [],
				setMatched = [], //esns 通过 setMatcher 找到的 results
				contextBackup = outermostContext,
				// We must always have either seed elements or outermost context
				elems = seed || byElement && Expr.find["TAG"]( "*", outermost ), //esns 已经找好的筛选集合，如果没有而且是 byElement，就是用最外层所有可选择的 elements
				// Use integer dirruns iff this is the outermost matcher
				dirrunsUnique = (dirruns += contextBackup == null ? 1 : Math.random() || 0.1),
				len = elems.length;

			if ( outermost ) {
				outermostContext = context === document || context || outermost;
			}
			//esns 测试每个 集合中的 element 是否符合要求
			// Add elements passing elementMatchers directly to results
			// Support: IE<9, Safari
			// Tolerate NodeList properties (IE: "length"; Safari: <number>) matching elements by id
			for ( ; i !== len && (elem = elems[i]) != null; i++ ) {
				if ( byElement && elem ) {
					j = 0;
					if ( !context && elem.ownerDocument !== document ) {
						setDocument( elem );
						xml = !documentIsHTML;
					}
					while ( (matcher = elementMatchers[j++]) ) { 
						if ( matcher( elem, context || document, xml) ) {
							results.push( elem );
							break; //esns 通过 任何 "，" 分组的matcher 就已经符合条件，我们是 UNION 关系，而不是 Intersection，这样就省下配对时间，而且不会重复添加 element
						}
					}
					if ( outermost ) {
						dirruns = dirrunsUnique;
					}
				}

				// Track unmatched elements for set filters
				if ( bySet ) {
					// They will have gone through all possible matchers
					if ( (elem = !matcher && elem) ) {
						matchedCount--;
					}

					// Lengthen the array for every element, matched or not
					if ( seed ) {
						unmatched.push( elem );
					}
				}
			}

			// `i` is now the count of elements visited above, and adding it to `matchedCount`
			// makes the latter nonnegative.
			matchedCount += i;
			//esns 这里解释为什么 i 设定为 "0"，而不是数字的0
			// Apply set filters to unmatched elements
			// NOTE: This can be skipped if there are no unmatched elements (i.e., `matchedCount`
			// equals `i`), unless we didn't visit _any_ elements in the above loop because we have
			// no element matchers and no seed.
			// Incrementing an initially-string "0" `i` allows `i` to remain a string only in that
			// case, which will result in a "00" `matchedCount` that differs from `i` but is also
			// numerically zero.
			if ( bySet && i !== matchedCount ) {
				j = 0;
				while ( (matcher = setMatchers[j++]) ) {
					matcher( unmatched, setMatched, context, xml );
				}

				if ( seed ) {
					// Reintegrate element matches to eliminate the need for sorting
					if ( matchedCount > 0 ) {
						while ( i-- ) {
							if ( !(unmatched[i] || setMatched[i]) ) {
								setMatched[i] = pop.call( results );
							}
						}
					}

					// Discard index placeholder values to get only actual matches
					setMatched = condense( setMatched );
				}

				// Add matches to results
				push.apply( results, setMatched );

				// Seedless set matches succeeding multiple successful matchers stipulate sorting
				if ( outermost && !seed && setMatched.length > 0 &&
					( matchedCount + setMatchers.length ) > 1 ) {

					Sizzle.uniqueSort( results ); 
				}
			}

			// Override manipulation of globals by nested matchers
			if ( outermost ) {
				dirruns = dirrunsUnique;
				outermostContext = contextBackup;
			}

			return unmatched; //esns 给予 :not() 使用，保存所有 elems 这样 即使没有通过 也保存下来，才可以做倒转 <1439> ????
		};

	return bySet ? //esns 如果是 setMatcher 就标记一下，返回 superMatcher
		markFunction( superMatcher ) :
		superMatcher;
}
//esns 编译后 返回 function 函数
compile = Sizzle.compile = function( selector, match /* Internal Use Only */ ) { //esns 这里的 match 用来检测是否已经 tokenized，有就直接使用
	var i,
		setMatchers = [], 
		elementMatchers = [], 
		cached = compilerCache[ selector + " " ];

	if ( !cached ) { 
		// Generate a function of recursive functions that can be used to check each element
		if ( !match ) { //esns 是否已经 tokenized
			match = tokenize( selector );
		}
		i = match.length;
		while ( i-- ) { 
			cached = matcherFromTokens( match[i] );
			if ( cached[ expando ] ) { //esns 有标记的 matcher，就是 setMatcher
				setMatchers.push( cached );
			} else {
				elementMatchers.push( cached );
			}
		}
		
		// Cache the compiled function
		cached = compilerCache( selector, matcherFromGroupMatchers( elementMatchers, setMatchers ) );

		// Save selector and tokenization
		cached.selector = selector;
	}
	return cached;
};

/** 
 * A low-level selection function that works with Sizzle's compiled
 *  selector functions
 * @param {String|Function} selector A selector or a pre-compiled
 *  selector function built with Sizzle.compile
 * @param {Element} context
 * @param {Array} [results]
 * @param {Array} [seed] A set of elements to match against
 */
select = Sizzle.select = function( selector, context, results, seed ) { //esns 自制的原生 Sizzle Select
	var i, tokens, token, type, find,
		compiled = typeof selector === "function" && selector, //esns 是否已经编译成 function，不是就返回 false，如果是 返回编译的 function
		match = !seed && tokenize( (selector = compiled.selector || selector) ); //esns 是否已经有测试集，如果没有就要 tokenize selector

	results = results || [];
	//esns 限制 context 限制了 查询的范围 seed 限制了 查询的对象
	// Try to minimize operations if there is only one selector in the list and no seed
	// (the latter of which guarantees us context)
	if ( match.length === 1 ) { 
		//esns 收缩 context 范围 下面会描述细节
		// Reduce context if the leading compound selector is an ID
		tokens = match[0] = match[0].slice( 0 );
		if ( tokens.length > 2 && (token = tokens[0]).type === "ID" && //esns 测试 是否超过有2个selector + 是否是 ID 带头
				context.nodeType === 9 && documentIsHTML && Expr.relative[ tokens[1].type ] ) { //esns 是否 document node 和 第二个是否是 relative type
			//esns 收缩 context 范围 把 context 设定为 #ID 里面 通过 find[ID] 的 function 查询到的 element node
			context = ( Expr.find["ID"]( token.matches[0].replace(runescape, funescape), context ) || [] )[0];
			if ( !context ) { //esns 如果 主体文本 context 的查询集合 都是空的话 就没有必要查询
				return results;

			// Precompiled matchers will still verify ancestry, so step up a level
			} else if ( compiled ) {
				context = context.parentNode;
			}

			selector = selector.slice( tokens.shift().value.length ); //esns 去掉 ID 部分
		}

		// Fetch a seed set for right-to-left matching
		i = matchExpr["needsContext"].test( selector ) ? 0 : tokens.length; //esns 是否有 setMatcher 元素?，如果有使用 selector <1841> 在 setMatcher 中 预选 seed
		while ( i-- ) { //esns 从右到左 开始寻找 elems 的 seed
			token = tokens[i];

			// Abort if we hit a combinator
			if ( Expr.relative[ (type = token.type) ] ) { //esns 没有适当的 token 来收缩 seed
				break;
			}
			if ( (find = Expr.find[ type ]) ) { //esns 只有是 ID，TAG，CLASS 才使用适当的搜寻 function
				// Search, expanding context for leading sibling combinators
				if ( (seed = find( //esns 只有是 ID，TAG，CLASS 才创建顶层的核对筛选目标集 seed，有seed才会运行里面的逻辑
					token.matches[0].replace( runescape, funescape ),
					rsibling.test( tokens[0].type ) && testContext( context.parentNode ) || context
				)) ) {

					// If seed is empty or no tokens remain, we can return early
					tokens.splice( i, 1 ); //esns 去掉当前的这一个，把剩下的selector转换为 筛选函数 matcher，只有是 ID，TAG，CLASS 才可能到这一步
					selector = seed.length && toSelector( tokens ); //esns 上面后剩下的 在转换成 selector
					if ( !selector ) { //esns seed == 0 或者 整个 selector 就 一个 token 而已，没有剩下的 逻辑要处理
						push.apply( results, seed );
						return results; // 如果是 0 就返回空集 (最上层已经是空的)，或者返回当前的结果集(因为没有 核对筛选 的逻辑剩下来 	!selector )
					}

					break; //esns 如果有 seed，就不要再找了
				}
			}
		}
	}
	
	// Compile and execute a filtering function if one is not provided
	// Provide `match` to avoid retokenization if we modified the selector above 
	( compiled || compile( selector, match ) )( //esns 返回 supermatcher，然后invoke
		seed, 
		context,
		!documentIsHTML,
		results,
		!context || rsibling.test( selector ) && testContext( context.parentNode ) || context //esns 这里是设置 superMatcher 的变量 - outmost，而不是 context，如果是 sibling 最外层 context 用上一层 context
	);
	return results;
};

// One-time assignments

// Sort stability
support.sortStable = expando.split("").sort( sortOrder ).join("") === expando;  //esns 测试这个的时候，当前的sortOrder 只是测试是否有 hasDuplicate 没有改变位置

// Support: Chrome 14-35+
// Always assume duplicates if they aren't passed to the comparison function
support.detectDuplicates = !!hasDuplicate; //esns 可能 hasDuplicate 是 undefined

// Initialize against the default document
setDocument();

// Support: Webkit<537.32 - Safari 6.0.3/Chrome 25 (fixed in Chrome 27)
// Detached nodes confoundingly follow *each other*
support.sortDetached = assert(function( el ) {
	// Should return 1, but returns 4 (following)
	return el.compareDocumentPosition( document.createElement("fieldset") ) & 1; //esns 阅读 https://developer.mozilla.org/en-US/docs/Web/API/Node/compareDocumentPosition
});

// Support: IE<8
// Prevent attribute/property "interpolation"
// https://msdn.microsoft.com/en-us/library/ms536429%28VS.85%29.aspx
if ( !assert(function( el ) {
	el.innerHTML = "<a href='#'></a>";
	return el.firstChild.getAttribute("href") === "#" ;
}) ) {
	addHandle( "type|href|height|width", function( elem, name, isXML ) {
		if ( !isXML ) {
			return elem.getAttribute( name, name.toLowerCase() === "type" ? 1 : 2 );
		}
	});
}

// Support: IE<9
// Use defaultValue in place of getAttribute("value")
if ( !support.attributes || !assert(function( el ) {
	el.innerHTML = "<input/>";
	el.firstChild.setAttribute( "value", "" );
	return el.firstChild.getAttribute( "value" ) === "";
}) ) {
	addHandle( "value", function( elem, name, isXML ) {
		if ( !isXML && elem.nodeName.toLowerCase() === "input" ) {
			return elem.defaultValue;
		}
	});
}

// Support: IE<9
// Use getAttributeNode to fetch booleans when getAttribute lies
if ( !assert(function( el ) {
	return el.getAttribute("disabled") == null;
}) ) {
	addHandle( booleans, function( elem, name, isXML ) {
		var val;
		if ( !isXML ) {
			return elem[ name ] === true ? name.toLowerCase() :
					(val = elem.getAttributeNode( name )) && val.specified ?
					val.value :
				null;
		}
	});
}

// EXPOSE
var _sizzle = window.Sizzle;

Sizzle.noConflict = function() {
	if ( window.Sizzle === Sizzle ) {
		window.Sizzle = _sizzle;
	}

	return Sizzle;
};

if ( typeof define === "function" && define.amd ) {
	define(function() { return Sizzle; });
// Sizzle requires that there be a global window in Common-JS like environments
} else if ( typeof module !== "undefined" && module.exports ) {
	module.exports = Sizzle;
} else {
	window.Sizzle = Sizzle;
}
// EXPOSE

})( window );
