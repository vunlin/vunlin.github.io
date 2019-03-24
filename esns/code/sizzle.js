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
(function( window ) { //esns 这里是 function expression 而不是 function declaration

var i, //esns 临时变量
	support, //esns 浏览器是否对各种功能支持
	Expr, //esns 处理 selector 用的 Expr Object
	getText, //esns 用于获取 Node 的 text 的一个 function
	isXML, //esns 是否 XML 文件
	tokenize, //esns tokenize 函数 function name
	compile, //esns compile 函数 function name
	select, //esns 自己定制的 select  函数 function name
	outermostContext, //esns 最外层 DOM 环境
	sortInput, //esns 排序的输入数据
	hasDuplicate, //esns 是否有同一个元素的 boolen 值

	// Local document vars
	setDocument, //esns 设置当前 document 内的环境变量 的一个函数 function name
	document, //esns 设置 local variable -> 所以 document 不等于 window.document -> document !== window.document
	docElem, //esns 变量 documentElement (当前文档 最顶层 DOM 元素 - root element of the document)
	documentIsHTML, //esns 是否 XML 文件
	rbuggyQSA, //esns 浏览器支持 querySelectAll, 记录该浏览器bugs 的 array，选择用自己的 select 函数 如果 用户的selector 用这些buggy selector
	rbuggyMatches, //esns 浏览器的 matches 有哪些 bugs
	matches, //esns 函数function name = 浏览器支持 documentElement.matches (该元素是否符合 selector 的条件要求，可以进行筛选)
	contains, //esns 函数function name (A Element 是否包含 B Element)

	// Instance-specific data
	expando = "sizzle" + 1 * new Date(), //esns 特定的ID 创建自己插入的元素 不会出现冲突 而且容易寻找
	preferredDoc = window.document, //esns 希望的 document 文件
	dirruns = 0, //esns 记录进行了几次 上下左右的查询，来优化 可能性 ??
	done = 0, //esns 记录完成几次查询??
	classCache = createCache(), //esns selector 的 class cache
	tokenCache = createCache(), //esns 字符分解的 cache
	compilerCache = createCache(), //esns 编译的 cache
	nonnativeSelectorCache = createCache(), //esns 非浏览器本身的选择器处理的 cache
	sortOrder = function( a, b ) { //esns 排序的 function 变量
		if ( a === b ) {
			hasDuplicate = true; //esns 组合中有相同元素
		}
		return 0;
	},

	// Instance methods
	hasOwn = ({}).hasOwnProperty, //esns 简化各种函数名，Object的发生hasOwnProperty函数
	arr = [], //esns 以下简化 Array 函数名
	pop = arr.pop,
	push_native = arr.push,
	push = arr.push,
	slice = arr.slice,
	// Use a stripped-down indexOf as it's faster than native
	// https://jsperf.com/thor-indexof-vs-for/5
	indexOf = function( list, elem ) { //esns 自己定制的 indexOf 函数，因为更快
		var i = 0,
			len = list.length;
		for ( ; i < len; i++ ) {
			if ( list[i] === elem ) {
				return i;
			}
		}
		return -1;
	},
	//esns HTML中的 使用的 booleans 属性值
	booleans = "checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped",

	// Regular expressions
	//esns 所有连续 \\ 等于 一个 \ 还有 \\\\ -> \\ 然后 \\\\. = \\.
	// http://www.w3.org/TR/css3-selectors/#whitespace
	whitespace = "[\\x20\\t\\r\\n\\f]", //esns \x20 等于 space 空格

	// http://www.w3.org/TR/CSS21/syndata.html#value-def-identifier
	identifier = "(?:\\\\.|[\\w-]|[^\0-\\xa0])+",    //esns 匹配 \(.) 代表 \后必须要接字符 不能连续\\ 或 (\w = A-Za-z0-9)- 或 \xao 以上的 unicode字符串  
	// 匹配[ attrName ^= 'attrVal' ]
	// Attribute selectors: http://www.w3.org/TR/selectors/#attribute-selectors
	attributes = "\\[" + whitespace + "*(" + identifier + ")(?:" + whitespace + //esns 属性选择 ([name *= "value"]) 开头的 [ 
		// Operator (capture 2) -> 详见 https://developer.mozilla.org/en-US/docs/Web/CSS/Attribute_selectors
		"*([*^$|!~]?=)" + whitespace + //esns 接下来的 combinator (*^$|!~) 加上 = 
		// "Attribute values must be CSS identifiers [capture 5] or strings [capture 3 or capture 4]"
		"*(?:'((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\"|(" + identifier + "))|)" + whitespace + //esns 匹配 'string' 或 "string" 或 identifier 或 最后的 (|空) 直接匹配空值 [name] { b(a|) 匹配 b/ba }
		"*\\]", //esns 尾部的 ]
		// '((?:\\\\.|[^\\\\'])*)' => 'string'  || \"((?:\\\\.|[^\\\\\"])*)\" => "string" || (" + identifier + ") || 空
	pseudos = ":(" + identifier + ")(?:\\((" + //esns 开头 : + identifier + ( => {:nth-child(4n) | :not(.fancy) 等}
		// To reduce the number of selectors needing tokenize in the preFilter, prefer arguments:
		// 1. quoted (capture 3; capture 4 or capture 5)
		"('((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\")|" + //esns 匹配 'string' 或 "string" => string: \(.) 或 非\和'和"
		// 2. simple (capture 6)
		"((?:\\\\.|[^\\\\()[\\]]|" + attributes + ")*)|" + //esns 属性值匹配 \\\\. = \(.) 或 [^\\\\()[\\]] = 不可以包含 \()[] 
		// 3. anything else (capture 2)
		".*" +
		")\\)|)", //esns 尾部的 ) 或 空值 {:required}
	//esns 前置r -> 代表 regular expression object
	// Leading and non-escaped trailing whitespace, capturing some non-whitespace characters preceding the latter
	rwhitespace = new RegExp( whitespace + "+", "g" ),
	rtrim = new RegExp( "^" + whitespace + "+|((?:^|[^\\\\])(?:\\\\.)*)" + whitespace + "+$", "g" ),  //esns 去掉开头的空格 或 {空 或 非\字符 紧跟 \(.)}跟尾部的空格 (B&W?" may be written as "B\&W\?" or "B\26 W\3F" - https://www.w3.org/TR/CSS21/syndata.html#value-def-identifier)
	//esns 测试 rtrim - "\\c\\d  ".match(rtrim) => ["\c\d  "]
	rcomma = new RegExp( "^" + whitespace + "*," + whitespace + "*" ),
	rcombinators = new RegExp( "^" + whitespace + "*([>+~]|" + whitespace + ")" + whitespace + "*" ), //esns  ^是否直接开始 (空格)>+~ 或者 空格，阅读https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Selectors#Combinators
	rdescend = new RegExp( whitespace + "|>" ), //esns 空格 或者 > 

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
	rheader = /^h\d$/i,

	rnative = /^[^{]+\{\s*\[native \w/, //esns 测试是否是浏览器的 native code

	// Easily-parseable/retrievable ID or TAG or CLASS selectors
	rquickExpr = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/, //esns 简单匹配模式 # -> ID, div -> TAG, .class -> CLASS， 可以使用定义好的三种 select 函数 function

	rsibling = /[+~]/,

	// CSS escapes
	// http://www.w3.org/TR/CSS21/syndata.html#escaped-characters
	runescape = new RegExp( "\\\\([\\da-f]{1,6}" + whitespace + "?|(" + whitespace + ")|.)", "ig" ),  //esns 开头\ 跟1-6位长的数字和a-f 或 任何字符
	funescape = function( _, escaped, escapedWhitespace ) { //esns _ = 全部的配对 "\----"，escaped = \后面的 "----"，出现的 whitespace
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
	fcssescape = function( ch, asCodePoint ) { // esns https://stackoverflow.com/questions/27331819/whats-the-difference-between-a-character-a-code-point-a-glyph-and-a-grapheme
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

	inDisabledFieldset = addCombinator( //esns 是否包含在 disabledFieldset 当中，disabled and it is a fieldset
		function( elem ) {
			return elem.disabled === true && elem.nodeName.toLowerCase() === "fieldset";
		},
		{ dir: "parentNode", next: "legend" }
	);
//esns 按照不同浏览器定义适合的 array push 函数
// Optimize for push.apply( _, NodeList )
try {
	push.apply(
		(arr = slice.call( preferredDoc.childNodes )), //esns 快速 复制一份 copy preferredDoc.childNodes，然后叠加
		preferredDoc.childNodes
	);
	// Support: Android<4.0
	// Detect silently failing push.apply
	arr[ preferredDoc.childNodes.length ].nodeType; //esns 调用 nodeType 验证 Android<4.0 然后 使用 catch 来定义不同可以用的 push 函数 function
} catch ( e ) {
	push = { apply: arr.length ?

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
//esns 必须要 selector 和 context (默认为 document) 才可以使用 3 个基本的 选择器功能
function Sizzle( selector, context, results, seed ) { //esns 这个是 function declaration
	var m, i, elem, nid, match, groups, newSelector,
		newContext = context && context.ownerDocument, //esns 如果 context 是 element node，但是 getElementById 只能在 document 中使用，所以使用 newContext 存储 document context，然后使用 contains 测试

		// nodeType defaults to 9, since context defaults to document
		nodeType = context ? context.nodeType : 9; //esns 默认为 文件类型 9: DOCUMENT_NODE，ElEMENT_NODE = 1

	results = results || []; //esns 传递已有的 results 或者 initiate - 配对成功的结果集合，包含各个不同组(",")分开的 selector

	// Return early from calls with invalid selector or context
	if ( typeof selector !== "string" || !selector || //esns 简单测试直接返回不符合要求的 selector
		nodeType !== 1 && nodeType !== 9 && nodeType !== 11 ) { //esns 只允许类别 1 - ELEMENT_NODE <div> <p> | DOCUMENT_NODE = 9 | DOCUMENT_FRAGMENT_NODE = 11 
		
		return results;
	}

	// Try to shortcut find operations (as opposed to filters) in HTML documents
	if ( !seed ) { //esns 如果需要筛选种子选手 seed，就只能使用自定义的 select

		if ( ( context ? context.ownerDocument || context : preferredDoc ) !== document ) { //esns 是否非 document 的 context
			setDocument( context ); // 设置 document 的环境 函数
		}
		context = context || document; //esns 如果没有 context 就默认为 document

		if ( documentIsHTML ) { //esns 只适用 html 文档

			// If the selector is sufficiently simple, try using a "get*By*" DOM method
			// (excepting DocumentFragment context, where the methods don't exist)
			if ( nodeType !== 11 && (match = rquickExpr.exec( selector )) ) { //esns 符合简单的 selector 和不是 fragment.noteType == 11 因为 fragment 没有 需要的功能

				// ID selector
				if ( (m = match[1]) ) {

					// Document context
					if ( nodeType === 9 ) { //esns 如果是 document context 的话 就不要 测试 contains
						if ( (elem = context.getElementById( m )) ) {

							// Support: IE, Opera, Webkit
							// TODO: identify versions
							// getElementById can match elements by name instead of ID
							if ( elem.id === m ) { //esns 确保没有用 name 来配对 id
								results.push( elem );
								return results;
							}
						} else {
							return results;
						}

					// Element context
					} else {

						// Support: IE, Opera, Webkit
						// TODO: identify versions
						// getElementById can match elements by name instead of ID
						if ( newContext && (elem = newContext.getElementById( m )) &&
							contains( context, elem ) && //esns 要保证 等到的结果 包含在 指定的 非 document 的原先 context 当中
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
			if ( support.qsa && //esns 如果支持 querySelectAll，就使用
				!nonnativeSelectorCache[ selector + " " ] && //esns 是否已经测试过后存在 cache 中
				(!rbuggyQSA || !rbuggyQSA.test( selector )) && //esns 测试是否在这个有 QSA 功能的浏览器中 有 QSA BUG, 有就 不可以用，要用自己的 select 函数

				// Support: IE 8 only
				// Exclude object elements
				(nodeType !== 1 || context.nodeName.toLowerCase() !== "object") ) {

				newSelector = selector; //esns 准备修改 selector 为新的 newSelector
				newContext = context; //esns 设置为 之前的 context，因为 querySelectAll 支持 Element https://developer.mozilla.org/en-US/docs/Web/API/Element/querySelectorAll

				// qSA considers elements outside a scoping root when evaluating child or
				// descendant combinators, which is not what we want.
				// In such cases, we work around the behavior by prefixing every selector in the
				// list with an ID selector referencing the scope context.
				// Thanks to Andrew Dupont for this technique.
				if ( nodeType === 1 && rdescend.test( selector ) ) { //esns 解决可能出现的 上面的问题 如果有空格 或者 > 

					// Capture the context ID, setting it first if necessary
					if ( (nid = context.getAttribute( "id" )) ) { //esns 如果有 id 的话 就获取，要不然就设置为 expando 值
						nid = nid.replace( rcssescape, fcssescape ); //esns 正确的 escape string 来使用
					} else {
						context.setAttribute( "id", (nid = expando) );
					}

					// Prefix every selector in the list
					groups = tokenize( selector );
					i = groups.length;
					while ( i-- ) {
						groups[i] = "#" + nid + " " + toSelector( groups[i] ); //esns 添加 #id 到 每一组 处理的 CSS selector 前 这样查询更加快速
					}
					newSelector = groups.join( "," ); //esns 合并所有 各组的添加了 #id 的 css selector 一次性传给 浏览器的 selector (不一定是有效的CSS selector)
					
					// Expand context for sibling selectors 
					newContext = rsibling.test( selector ) && testContext( context.parentNode ) || //esns 如果是sibling的 selector，因为添加了 上层#id <test:selector.js: 412/414/416>， 必须用到上一级的 Node Context 才可以检测到需要的结果
						context;
				}

				try {
					push.apply( results,
						newContext.querySelectorAll( newSelector ) //esns 使用适当的 selector 和 context
					);
					return results;
				} catch ( qsaError ) { // 错误: CSS selector syntaxError 来自 * 所以用有效的 CSS 可以使用浏览器自身的 querySelectAll
					nonnativeSelectorCache( selector, true ); // 储存到 cache 中
				} finally {
					if ( nid === expando ) {
						context.removeAttribute( "id" ); //esns 去掉设置的 id 属性值
					}
				}
			}
		}
	}

	// All others
	return select( selector.replace( rtrim, "$1" ), context, results, seed ); // 如果需要，就使用自己定制的 select 函数
}

/**
 * Create key-value caches of limited size
 * @returns {function(string, object)} Returns the Object data after storing it on itself with
 *	property name the (space-suffixed) string and (if the cache is larger than Expr.cacheLength)
 *	deleting the oldest entry
 */
function createCache() {
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
//esns 标记来 对特别的 variable 或者 function etc 进行区别，比如 setMatcher 区别 elementMatcher
/**
 * Mark a function for special use by Sizzle
 * @param {Function} fn The function to mark
 */
function markFunction( fn ) {
	fn[ expando ] = true;
	return fn;
}

/**
 * Support testing using an element
 * @param {Function} fn Passed the created element and returns a boolean result
 */
function assert( fn ) { //esns 创建fieldset元素，执行fn函数，用来实现浏览器能力检测，又一个 factory pattern
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
function addHandle( attrs, handler ) { //esns IE8，IE9 的帮助函数 function，factory pattern 函数
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
//esns 开头有 create 都是工厂 factory pattern，传入不同特定的元素，其他剩下的都一样
/**
 * Returns a function to use in pseudos for input types
 * @param {String} type
 */
function createInputPseudo( type ) { //esns 伪类-控件类型参数核对函数 function - 是 input 和相对应的 type
	return function( elem ) {
		var name = elem.nodeName.toLowerCase();
		return name === "input" && elem.type === type;
	};
}

/**
 * Returns a function to use in pseudos for buttons
 * @param {String} type
 */
function createButtonPseudo( type ) { //esns 伪类-按钮类型参数核对函数 function - 是 input 和相对应的 type = submit/reset
	return function( elem ) {
		var name = elem.nodeName.toLowerCase();
		return (name === "input" || name === "button") && elem.type === type;
	};
}

/**
 * Returns a function to use in pseudos for :enabled/:disabled
 * @param {Boolean} disabled true for :disabled; false for :enabled
 */
function createDisabledPseudo( disabled ) { //esns 伪类-是否被禁止参数核对函数 - disabled

	// Known :disabled false positives: fieldset[disabled] > legend:nth-of-type(n+2) :can-disable
	return function( elem ) {

		// Only certain elements can match :enabled or :disabled
		// https://html.spec.whatwg.org/multipage/scripting.html#selector-enabled
		// https://html.spec.whatwg.org/multipage/scripting.html#selector-disabled
		if ( "form" in elem ) {

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
function createPositionalPseudo( fn ) { //esns 第一层 factory pattern，传入相对应的 函数 fn
	return markFunction(function( argument ) { //esns 第二层 factory pattern，由 filter 创建是 传入相对的 argument 例子 :not[div em] => pseudo = "not" , argument = "div em"
		argument = +argument;
		return markFunction(function( seed, matches ) { //esns 这个才是最终用来 筛选 seed 用的 setMatcher 函数 function
			var j,
				matchIndexes = fn( [], seed.length, argument ), //esns 符合的位置 array -> 由 第一层 创建时候 传进来的 function (fn) 决定
				i = matchIndexes.length;

			// Match elements found at the specified indexes
			while ( i-- ) {
				if ( seed[ (j = matchIndexes[i]) ] ) {
					seed[j] = !(matches[j] = seed[j]); //esns 这里通过 ! 省下一步 设置 seed[j] 为 false
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
function testContext( context ) { //esns 是否有效 context 通过测试 getElementsByTagName
	return context && typeof context.getElementsByTagName !== "undefined" && context; // 最后添加 && context 这样 true 的话可以返回 context
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
		docElem = (elem.ownerDocument || elem).documentElement; //esns 如果是elementNode 那就有 ownerDocument，要不然就已经是decument

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
	if ( doc === document || doc.nodeType !== 9 || !doc.documentElement ) { //esns 已经设定好 或者 无效 doc
		return document; //esns 使用 preferredDoc
	}
	//esns 这里的 document 是 scope variable 不是 window.document 不要搞错了
	// Update global variables
	document = doc; //esns 这个不是 window.document，而是设定 function scope 中的的 document，可以是 html 或者 xml 文件
	docElem = document.documentElement; 
	documentIsHTML = !isXML( document );

	// Support: IE 9-11, Edge
	// Accessing iframe documents after unload throws "permission denied" errors (jQuery #13936)
	if ( preferredDoc !== document &&
		(subWindow = document.defaultView) && subWindow.top !== subWindow ) { //esns 如果是 iframe 的话，添加 IE 的 unload 处理 error

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
	// esns 寻找 ID Class Tag 的最基础 功能，filter 是筛选结果集，find 是得出结果集
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
					if ( elem.nodeType === 1 ) { //esns 只允许 ELEMENT_NODE
						tmp.push( elem );
					}
				}

				return tmp;
			}
			return results;
		};

	// Class
	Expr.find["CLASS"] = support.getElementsByClassName && function( className, context ) { //esns 不支持 getElementsByClassName 就等于 null?
		if ( typeof context.getElementsByClassName !== "undefined" && documentIsHTML ) {
			return context.getElementsByClassName( className );
		}
	};

	/* QSA/matchesSelector
	---------------------------------------------------------------------- */

	// QSA and matchesSelector support

	// matchesSelector(:active) reports false when true (IE9/Opera 11.5)
	rbuggyMatches = []; // 处理支持该功能 浏览器的 bug

	// qSa(:focus) reports false when true (Chrome 21)
	// We allow this because of a bug in IE8/9 that throws an error
	// whenever `document.activeElement` is accessed on an iframe
	// So, we allow :focus to pass through QSA all the time to avoid the IE error
	// See https://bugs.jquery.com/ticket/13378
	rbuggyQSA = []; // 处理支持该功能 QuerySelectAll 浏览器的 bug

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
			support.disconnectedMatch = matches.call( el, "*" );

			// This should fail with an exception
			// Gecko does not error, returns false instead
			matches.call( el, "[s!='']:x" );
			rbuggyMatches.push( "!=", pseudos );
		});
	}

	rbuggyQSA = rbuggyQSA.length && new RegExp( rbuggyQSA.join("|") ); //esns 用pipe连接起来
	rbuggyMatches = rbuggyMatches.length && new RegExp( rbuggyMatches.join("|") );

	/* Contains
	---------------------------------------------------------------------- */
	hasCompare = rnative.test( docElem.compareDocumentPosition ); //esns 是否浏览器有确定 两个 Node 位置关系 function

	// Element contains another
	// Purposefully self-exclusive
	// As in, an element does not contain itself
	contains = hasCompare || rnative.test( docElem.contains ) ? //esns 是否包含这个 Node 的函数
		function( a, b ) {
			var adown = a.nodeType === 9 ? a.documentElement : a, //esns 这里没有 向下 adown 等于 a 本身 
				bup = b && b.parentNode; //esns b存在的话，向上移
			return a === bup || !!( bup && bup.nodeType === 1 && ( //esns 如果 bup 还是 ELEMENT_NODE，就recursive 继续测试
				adown.contains ?
					adown.contains( bup ) : //esns 如果有contains 函数，就recursive 测试，继续提升 bup
					a.compareDocumentPosition && a.compareDocumentPosition( bup ) & 16 //esns 如果有 compareDocumentPosition 函数就使用 https://developer.mozilla.org/en-US/docs/Web/API/Node/compareDocumentPosition
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
	sortOrder = hasCompare ?
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
		if ( compare & 1 || //esns 比较 bit operator - https://developer.mozilla.org/en-US/docs/Web/API/Node/compareDocumentPosition
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

Sizzle.matches = function( expr, elements ) { //esns 筛选符合 expr 的 elements，然后返回符合的 elements 数组 array
	return Sizzle( expr, null, null, elements ); 
};

Sizzle.matchesSelector = function( elem, expr ) { //esns 是否这个 elem 符合 expr selector 的条件
	// Set document vars if needed
	if ( ( elem.ownerDocument || elem ) !== document ) {
		setDocument( elem );
	}

	if ( support.matchesSelector && documentIsHTML &&
		!nonnativeSelectorCache[ expr + " " ] && //esns 是否有cache记录
		( !rbuggyMatches || !rbuggyMatches.test( expr ) ) && //esns 在当前浏览器中 expr 是否有 matches 函数 bugs
		( !rbuggyQSA     || !rbuggyQSA.test( expr ) ) ) { //esns 在当前浏览器中 expr 是否 有 QuerySelectAll 函数 bugs

		try {
			var ret = matches.call( elem, expr ); //esns 这个不是 Sizzle.matches，而是使用浏览器的对比 matches 函数，https://developer.mozilla.org/en-US/docs/Web/API/Element/matches

			// IE 9's matchesSelector returns false on disconnected nodes
			if ( ret || support.disconnectedMatch ||
					// As well, disconnected nodes are said to be in a document
					// fragment in IE 9
					elem.document && elem.document.nodeType !== 11 ) {
				return ret;
			}
		} catch (e) { //esns 出现异常 invalid selector
			nonnativeSelectorCache( expr, true ); //esns 记录到cache中 然后使用自制的 select 函数 function
		}
	}

	return Sizzle( expr, document, null, [ elem ] ).length > 0; //esns 传进去的seed 就一个元素，只要大于0就正好
};

Sizzle.contains = function( context, elem ) {
	// Set document vars if needed
	if ( ( context.ownerDocument || context ) !== document ) {
		setDocument( context );
	}
	return contains( context, elem ); //esns 如果需要以上的设定 setDocument，做完之后，使用 scope global 中的 contains 函数
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

Sizzle.escape = function( sel ) { //esns 一个处理字符 string 的辅助函数 helper function
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
	sortInput = !support.sortStable && results.slice( 0 ); //esns 复制 results 使用 slice(0)
	results.sort( sortOrder ); //esns 使用 sortOrder 函数，设置 hasDuplicate 这个 scope global 变量

	if ( hasDuplicate ) {
		while ( (elem = results[i++]) ) { //esns 记住 results 已经 sort 过，所有相同的元素都 紧靠在一起
			if ( elem === results[ i ] ) {
				j = duplicates.push( i ); //esns 把 duplicate 的元素位置index 放入 duplicates array 中
			}
		}
		while ( j-- ) {
			results.splice( duplicates[ j ], 1 ); //esns 去掉 duplicate 的元素
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
getText = Sizzle.getText = function( elem ) { //esns 获取节点及子节点的文本内容 
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

	createPseudo: markFunction, // esns 扩展 pseudo setFilter 函数 function的时候使用 <test/unit/extending.js:14>

	match: matchExpr,

	attrHandle: {},

	find: {},

	relative: {
		">": { dir: "parentNode", first: true }, //esns 紧跟其后的 childNode，first 代表第一个元素
		" ": { dir: "parentNode" }, //esns 非紧跟其后的 childNode，dir 代表 cominator 查询的方向是 parentNode
		"+": { dir: "previousSibling", first: true }, //esns 紧跟其后的 sibling，dir 这里 查询的方向是 previousSibling
		"~": { dir: "previousSibling" } //esns 非紧跟其后的 sibling
	},

	preFilter: { //esns 在tokenize 函数 function 中 <1681> 配合之前的 matchExpr 进行简单的预处理，来简化
		"ATTR": function( match ) {
			match[1] = match[1].replace( runescape, funescape ); //esns 去掉 escape character

			// Move the given value to match[3] whether quoted or unquoted
			match[3] = ( match[3] || match[4] || match[5] || "" ).replace( runescape, funescape ); //esns 去掉 escape character

			if ( match[2] === "~=" ) { //esns 如果是 ～= 两边要添加空格 阅读https://developer.mozilla.org/en-US/docs/Web/CSS/Attribute_selectors
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
				unquoted = !match[6] && match[2]; //esns 是否没有 引号 <'|">

			if ( matchExpr["CHILD"].test( match[0] ) ) { //esns 是否应当属于 child selector
				return null; //esns 返回 null 给 tokenize 函数 function 进行适当的 Child 配对 Match
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

	filter: { // 筛选所有的 elements, 封存相关联的 variable

		"TAG": function( nodeNameSelector ) {
			var nodeName = nodeNameSelector.replace( runescape, funescape ).toLowerCase();
			return nodeNameSelector === "*" ? //esns 返回一个函数方程 function
				function() { return true; } : //esns 如果是 * 那什么 tag 都可以
				function( elem ) {
					return elem.nodeName && elem.nodeName.toLowerCase() === nodeName; //是否相同的 tag name
				};
		},

		"CLASS": function( className ) {
			var pattern = classCache[ className + " " ]; //esns 如果已经创建 获取该class 相对的 regexp pattern

			return pattern || //esns 返回已经cache 的pattern，如果没有，继续下一步，设置 pattern RegExp，然后返回一个函数方程 function
				(pattern = new RegExp( "(^|" + whitespace + ")" + className + "(" + whitespace + "|$)" )) &&
				classCache( className, function( elem ) {
					return pattern.test( typeof elem.className === "string" && elem.className || typeof elem.getAttribute !== "undefined" && elem.getAttribute("class") || "" );
				});
		},

		"ATTR": function( name, operator, check ) {
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
				return operator === "=" ? result === check : //esns 这里的 check 是传进来比对用的 string 
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
						if ( simple ) { //esns 符合以上的都是简单类型
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

						start = [ forward ? parent.firstChild : parent.lastChild ]; //esns 决定开始的方向

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

			// But maintain support for old signatures //esns 以前使用的 代码 要 compatible <test/unit/extending.js:62>
			if ( fn.length > 1 ) { //esns 现在使用的 function 最多有一个 argument 的 parameter
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
	//esns 提供各种 pseudo 过滤验证
	pseudos: {
		// Potentially complex pseudos //esns NOT 本身就是一个 setMatcher，从左到右，elems 传入反向测试，这样子集小，就更快
		"not": markFunction(function( selector ) { //esns :not(这里可以是完整的多 selector) 阅读https://developer.mozilla.org/en-US/docs/Web/CSS/:not
			// Trim the selector passed to compile
			// to avoid treating leading and trailing
			// spaces as combinators
			var input = [],
				results = [],
				matcher = compile( selector.replace( rtrim, "$1" ) ); //esns 编译 not 里面 完整的 的一组 trim 的 selector 构成的 matcher，然后反向验证即可
				//esns 这里 matcher 是 superMatcher (seed, context, xml, results, outermost)
			return matcher[ expando ] ? //esns 传入 seed 到 supermatcher 中的 elementMatchers 和 setMatchers 测试，然后反向
				markFunction(function( seed, matches, context, xml ) {
					var elem,
						unmatched = matcher( seed, null, xml, [] ), //esns 没有 context，因为 :NOT 里面 selector context 是独立全新的
						i = seed.length;

					// Match elements unmatched by `matcher`
					while ( i-- ) { //esns 把 unmatched 里面每一个配对的 elems 的 boolean 再倒过来
						if ( (elem = unmatched[i]) ) { //esns elem = 每个通过 NOT内嵌(selector) 的元素
							seed[i] = !(matches[i] = elem);
						}
					}
				}) :
				function( elem, context, xml ) { //esns 还是 elementMatcher，然后一个个传入到 superMatcher 中测试
					input[0] = elem;
					matcher( input, null, xml, results ); //esns 因为是 supermatcher，要转换为 elem input array， 没有 context，因为 :NOT 里面 selector context 是独立全新的
					// Don't keep the element (issue #299)
					input[0] = null;
					return !results.pop(); //esns 是否有配对的 元素，results 是 scope local variable，上面传递下来的
				};
		}),

		"has": markFunction(function( selector ) {
			return function( elem ) {
				return Sizzle( selector, elem ).length > 0; //esns 这里elem作为context传入，阅读https://developer.mozilla.org/en-US/docs/Web/CSS/:has
			};
		}),

		"contains": markFunction(function( text ) { //esns 是否包含 text 文字的 string
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
		//esns 用于 setMatchers 在选项集合中的位置
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
		//esns matchIndexes 一开始都是空的 array []
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

Expr.pseudos["nth"] = Expr.pseudos["eq"]; //esns 不能传入(3n)等 只可以是数字，没有 这种nth的存在 Sizzle 自定义的 变成  eq

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

tokenize = Sizzle.tokenize = function( selector, parseOnly ) {//esns 分解 selector 有语义错误的直接丢出 throw error
	var matched, match, tokens, type,
		soFar, groups, preFilters,
		cached = tokenCache[ selector + " " ];

	if ( cached ) { //esns 有 cache 就直接返回 一个复制本
		return parseOnly ? 0 : cached.slice( 0 ); //esns 通过 slice(0) 返回一个复制的 array 而不是原件
	}

	soFar = selector;
	groups = []; 
	preFilters = Expr.preFilter;

	while ( soFar ) {

		// Comma and first run
		if ( !matched || (match = rcomma.exec( soFar )) ) { //esns 有 matched 遇到符合的 css 元素，才尝试分组用的 (^领头的) 逗号连接的几组 selector (#nice p , #cool p)
			if ( match ) {
				// Don't consume trailing commas as valid //esns 如果最后是一个，而已，就会返回空集，导致不变，而返回"，"，就是无效 selector
				soFar = soFar.slice( match[0].length ) || soFar; //esns 去掉分割用的 comma (",")，comma不属于 有效 selector 的一部分
			}
			groups.push( (tokens = []) ); // 第一次(肯定，因为matched 是undefined )  或  有 领头的 "^，" 才会添加新的一组
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

		//esns 去掉 combinator 后配对 各种元素，Expr.filter 是函数 function，matchExpr 是 RegExp Object
		for ( type in Expr.filter ) { 
			if ( (match = matchExpr[ type ].exec( soFar )) && (!preFilters[ type ] || //esns 如果有 preFilter 就要 启动 preFilter Function
				(match = preFilters[ type ]( match ))) ) { //esns 预处理来整理配对出来的 match
				matched = match.shift();
				tokens.push({
					value: matched,
					type: type,
					matches: match //esns 完整保留剩下的 RegExp.exec 返回的 array 值
				});
				soFar = soFar.slice( matched.length );
			}
		}

		if ( !matched ) {
			break; //esns 如果没有matched，就代表 selector 格式出问题了，到了这里 就直接退了
		}
	}

	// Return the length of the invalid excess
	// if we're just parsing
	// Otherwise, throw an error or return tokens
	return parseOnly ?
		soFar.length :
		soFar ? //esns 如果有剩余的 selector string 就代表 selector 格式是 invalid，就 throw error，然后结束
			Sizzle.error( selector ) :
			// Cache the tokens
			tokenCache( selector, groups ).slice( 0 ); //esns 缓存后 返回复印本
};

function toSelector( tokens ) { //esns 把每组的 token 变成 css selector String
	var i = 0,
		len = tokens.length,
		selector = "";
	for ( ; i < len; i++ ) {
		selector += tokens[i].value;
	}
	return selector;
}
//esns 这个用来 决定 查找 上下左右 范围的 函数 function，配合 elementMatcher (matcher) 的 变量 进行全方位 查询
function addCombinator( matcher, combinator, base ) { //esns 用来配对的自定义函数 matcher
	var dir = combinator.dir,
		skip = combinator.next,
		key = skip || dir,
		checkNonElements = base && key === "parentNode",
		doneName = done++;

	return combinator.first ? //esns 是否查询最近的一个元素 "+" 或者 ">"
		// Check against closest ancestor/preceding element
		function( elem, context, xml ) {
			while ( (elem = elem[ dir ]) ) { //ense 最近的一个而已，不一定是紧挨的，修改更新 elem，传入下一个 elementMatcher 中
				if ( elem.nodeType === 1 || checkNonElements ) {
					return matcher( elem, context, xml ); //esns 返回一个 matcher 函数 进行判断 就结束 whle loop
				}
			}
			return false;
		} :

		// Check against all ancestor/preceding elements
		function( elem, context, xml ) {
			var oldCache, uniqueCache, outerCache,
				newCache = [ dirruns, doneName ];

			// We can't set arbitrary data on XML nodes, so they don't benefit from combinator caching
			if ( xml ) {
				while ( (elem = elem[ dir ]) ) {
					if ( elem.nodeType === 1 || checkNonElements ) {
						if ( matcher( elem, context, xml ) ) { //esns 通过检测，这样子单一的不符合，不会直接判断为 false
							return true; //esns 而如果通过一个，直接就返回 true
						}
					}
				}
			} else {
				while ( (elem = elem[ dir ]) ) {
					if ( elem.nodeType === 1 || checkNonElements ) {
						outerCache = elem[ expando ] || (elem[ expando ] = {}); //esns 使用 cache 来避免重复进行，初始化为空 Object

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
							if ( (newCache[ 2 ] = matcher( elem, context, xml )) ) { //esns 通过检测，这样子单一的不符合，不会直接判断为 false，
								return true; //esns 而如果通过一个，直接就返回 true
							}
						}
					}
				}
			}
			return false; //esns 如果全部都不通过，才返回 false
		};
}
//esns 封装 matchers 的 可一层层 内嵌的 elementMatcher
function elementMatcher( matchers ) { //esns 把 matchers 封装入 elementMatcher，之后invoke 这个 elementMatcher 的时候就取出 matchers，并倒过来执行其中 每一个 matcher
	return matchers.length > 1 ? //esns 超过一个 matcher 就每个 matcher 比对
		function( elem, context, xml ) { //esns 这里的 context 是 combinator 查询的时候使用
			var i = matchers.length;
			while ( i-- ) { //esns 倒过来，从底部验证起
				if ( !matchers[i]( elem, context, xml ) ) { //esns 如果内嵌 addcombinator 函数 就 recrusive call -> elementMatcher 
					return false; //esns 一旦不符合其中之一 就 return false
				}
			}
			return true; // 符合全部 matcher 才可以是 true
		} :
		matchers[0]; //esns 只有一个就 invoke 一次就好
}
//esns 多 context，postFinder 可以传入 多个 elementNode 当作 多个 contexts，一次性获取所有通过setMatcher的 elems
function multipleContexts( selector, contexts, results ) {
	var i = 0,
		len = contexts.length;
	for ( ; i < len; i++ ) {
		Sizzle( selector, contexts[i], results );
	}
	return results;
}
//esns 使用 filter (elementMatcher) function 进行简缩 (elems seed)，或者去掉false和空的元素
function condense( unmatched, map, filter, context, xml ) {
	var elem,
		newUnmatched = [],
		i = 0,
		len = unmatched.length,
		mapped = map != null; //esns 是否有设定 map array 跟踪 筛选的 元素 index

	for ( ; i < len; i++ ) {
		if ( (elem = unmatched[i]) ) { //esns 在setMatcher过程中，不符合的元素会被标记为 false，这里去掉false和空的元素，有存在的元素，才会添加到 newUnmatched，进而紧缩
			if ( !filter || filter( elem, context, xml ) ) { //esns 当没有filter函数 或 进一步通过 filter 的函数 function 来收紧
				newUnmatched.push( elem );
				if ( mapped ) {
					map.push( i ); //esns 追踪 筛选的 元素 index
				}
			}
		}
	}

	return newUnmatched;
}
//esns 传入的是 seed 集合 <1834 seed> 所以 是 setMatcher，elementMatcher 是一个个 element 传入 测试 <1785 element>
function setMatcher( preFilter, selector, matcher, postFilter, postFinder, postSelector ) {
	if ( postFilter && !postFilter[ expando ] ) {
		postFilter = setMatcher( postFilter ); //esns postFilter 都应当是 setMatcher 用于 matchOut 的 array上
	}
	if ( postFinder && !postFinder[ expando ] ) { //esns 如果 postFinder 是 elementMatcher 的话
		postFinder = setMatcher( postFinder, postSelector ); //esns 需要变成最基本的 setMatcher，接受 elems array 用做 contexts 来搜寻
	}
	return markFunction(function( seed, results, context, xml ) { //esns 通过 postFinder 创建的 setMatcher，invoke的时候，传进来的context 是一个 array，hence multipleContext
		var temp, i, elem,
			preMap = [],
			postMap = [],
			preexisting = results.length, // esns 记录存在几个 results 元素，等一下 condense 可以用到

			// Get initial elements from seed or context
			elems = seed || multipleContexts( selector || "*", context.nodeType ? [ context ] : context, [] ), //esns 在此处获得setMatcher的配对集合，如果是一个 context的话，就创建 一个context 的 array，要不然就直接传递到函数multipleContext 中

			// Prefilter to get matcher input, preserving a map for seed-results synchronization
			matcherIn = preFilter && ( seed || !selector ) ? //esns 如果没有 seed 或者 已经使用 selector，就使用 preFilter (elementMatcher?) 来进行预先筛选 
				condense( elems, preMap, preFilter, context, xml ) :
				elems,

			matcherOut = matcher ? //esns 这里的 ? 对应 最后的 : matcherIn，中间三行是内嵌的 (?:) ternary conditional operator
				// If we have a postFinder, or filtered seed, or non-seed postFilter or preexisting results,
				postFinder || ( seed ? preFilter : preexisting || postFilter ) ? //esns 如果有postFinder 或 (同时有 seed 和 preFilter) 或 没有 seed 的 postFilter 或者 已经存在的 results

					// ...intermediate processing is necessary
					[] :

					// ...otherwise use results directly
					results :
				matcherIn; //esns 如果没有 matcher 函数 function 的话 matchOut 直接就等于 matchIn

		// Find primary matches
		if ( matcher ) { //esns 没有 matcher 函数 就跳过
			matcher( matcherIn, matcherOut, context, xml ); //esns 输入值 matcherIn，通过 matcher 后的 输出值 matcherOut
		}

		// Apply postFilter
		if ( postFilter ) {
			temp = condense( matcherOut, postMap ); //esns 复制matchOut 到temp中，标记 matcherOut 的 元素 Index 在 postMap 当中
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
				//esns 得到的最终结果，还需要跟seed核对，筛选
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
				postFinder( null, results, matcherOut, xml ); //esns 使用 筛选后 收缩的 matcherOut 作为 新的 context
			} else {
				push.apply( results, matcherOut ); //esns 通过所有检测的 符合 elements
			}
		}
	});
}
//esns 从 token 创建 matcher
function matcherFromTokens( tokens ) {
	var checkContext, matcher, j,
		len = tokens.length,
		leadingRelative = Expr.relative[ tokens[0].type ], //esns 是否引导关系开头
		implicitRelative = leadingRelative || Expr.relative[" "], //esns 如果有存在的引导关系，就使用来查询最近的"一个"parentNode 或 sibling 要不就默认为 " "，查询所有 parentNode
		i = leadingRelative ? 1 : 0, //esns 是否引导关系
		//esns 最外层的检测 function 是否达到 或 包含于最外层的 context
		// The foundational matcher ensures that elements are reachable from top-level context(s)
		matchContext = addCombinator( function( elem ) {
			return elem === checkContext; //esns 元素的context 是否等于 目标最外层的 checkContext 变量
		}, implicitRelative, true ), 
		matchAnyContext = addCombinator( function( elem ) {
			return indexOf( checkContext, elem ) > -1; //esns 元素的context 包含在 目标最外层的 checkContext 变量中
		}, implicitRelative, true ),
		matchers = [ function( elem, context, xml ) { //esns 这里是 function declaration 还没有invoke 执行里面的逻辑，执行后才会返回最后执行的 matchContext 函数 function
			var ret = ( !leadingRelative && ( xml || context !== outermostContext ) ) || ( //esns 非引导关系 和 (xml文档 或 非最外层 context)
				(checkContext = context).nodeType ? //esns 这里设置 checkContext 值，这样才用到下面两个 matchContext 上面的函数中的变量才有值
					matchContext( elem, context, xml ) : //esns 这里 invoke 然后 返回 boolean 值
					matchAnyContext( elem, context, xml ) ); //esns 注意这里的 () 配对 不要看错了 用编辑器 来帮助看
			// Avoid hanging onto element (issue #299) 
			checkContext = null; //esns 去掉 checkContext 避开 bug
			return ret;
		} ];

	for ( ; i < len; i++ ) { //esns 如果有 适合的引导关系 上面的 i 就要设置为 1开始，就会跳过第一个元素
		if ( (matcher = Expr.relative[ tokens[i].type ]) ) { //esns 这里 matcher 是 object 而不是 function
			matchers = [ addCombinator(elementMatcher( matchers ), matcher) ]; //esns elementMatcher 单体的多层 matcher，加上 addCombinator 进行 上下左右 范围值查询，合并为新的 matchers 的第一个 元素
		} else { //esns 接上面，倒过来 invoke 到这个刚封装的第一个元素的时候，addCombinator 配合传入的 elementMatcher 函数就完全展开
			matcher = Expr.filter[ tokens[i].type ].apply( null, tokens[i].matches ); //esns 使用 apply 来传递 array of argument，单个的 筛选 函数 function
			//esns 给setMatcher条件为 positional matcher? 因为他们才有 markFunction 给予标记
			// Return special upon seeing a positional matcher
			if ( matcher[ expando ] ) {
				// Find the next relative operator (if any) for proper handling
				j = ++i; //esns 下一个 I 的 index
				for ( ; j < len; j++ ) { //esns 如果找到下一个 relative 关系 的 index，确定下面postFilter 和 postFinder 用的 j 截点 index 就跳出
					if ( Expr.relative[ tokens[j].type ] ) {
						break;
					}
				}
				return setMatcher( 
					i > 1 && elementMatcher( matchers ), //esns preFilter 使用 elementMatcher 来核对元素
					i > 1 && toSelector( //esns selector - matcher 之前的 selector
						// If the preceding token was a descendant combinator, insert an implicit any-element `*`
						tokens.slice( 0, i - 1 ).concat({ value: tokens[ i - 2 ].type === " " ? "*" : "" }) //esns 如上的解释
					).replace( rtrim, "$1" ),
					matcher, //esns matcher 用以 filter 的 函数
					i < j && matcherFromTokens( tokens.slice( i, j ) ), //esns postFilter (matcher 到 postFinder 之间)
					j < len && matcherFromTokens( (tokens = tokens.slice( j )) ), //esns postFinder 使用 matcherFromTokens 继续 使用得出的 contexts 筛选
					j < len && toSelector( tokens ) //esns postSelector - postFilter/matcher 之后的 selector
				);
			}
			matchers.push( matcher ); // 添加 matcher function
		}
	}

	return elementMatcher( matchers ); // 最后一并在包一层 到一个集合中
}
//esns 集合所有selector各组(逗号，)创建的matcher，然后合并在 results 中集中返回所有符合的项目
function matcherFromGroupMatchers( elementMatchers, setMatchers ) {
	var bySet = setMatchers.length > 0,
		byElement = elementMatchers.length > 0,
		superMatcher = function( seed, context, xml, results, outermost ) { //esns 这里的 context 主要是 combinator match 的时候使用
			var elem, j, matcher,
				matchedCount = 0,
				i = "0",
				unmatched = seed && [], //esns 空 (如果有 seed) 或者 undefined (如果没有 seed)
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
							break; // 通过 任何 "，" 分组的matcher 就已经符合条件，我们是 UNION 关系，而不是 Intersection，这样就省下配对时间，而且不会重复添加 element
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

					Sizzle.uniqueSort( results ); //esns 去掉 重合的元素 如果没有 seed 传入的话
				}
			}

			// Override manipulation of globals by nested matchers
			if ( outermost ) {
				dirruns = dirrunsUnique;
				outermostContext = contextBackup;
			}

			return unmatched; //esns 给予 :not() 使用，保存所有 elems 这样 即使没有通过 也保存下来，才可以做倒转
		};

	return bySet ? //esns 如果是 setMatcher 就标记一下
		markFunction( superMatcher ) :
		superMatcher;
}
//esns 编译后 返回 function 函数
compile = Sizzle.compile = function( selector, match /* Internal Use Only */ ) { //esns 这里的 match 用来检测是否已经 tokenized，有就直接使用
	var i,
		setMatchers = [], 
		elementMatchers = [], 
		cached = compilerCache[ selector + " " ];

	if ( !cached ) { //esns 是否有 cache 先，如果没有就创建 一组 recursive 函数 function 来验证每个 elems
		// Generate a function of recursive functions that can be used to check each element
		if ( !match ) { //esns 是否已经 tokenized
			match = tokenize( selector );
		}
		i = match.length;
		while ( i-- ) { // 最后一组 先来
			cached = matcherFromTokens( match[i] );
			if ( cached[ expando ] ) { //esns 有标记的 matcher，就是 setMatcher
				setMatchers.push( cached );
			} else {
				elementMatchers.push( cached );
			}
		}
		//esns 合并 matchers 然后 cache 起来
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
	if ( match.length === 1 ) { //esns 只有一组 selector 的话，而不是用","连接的多组 selector，多组的就要 condense 等其他处理，直接跳至 compile
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
	( compiled || compile( selector, match ) )( //esns 如果是 compiled 那这个是一个 Function, 然后 Invoke, 要不然 compile 然后返回 function 然后 invoke
		seed, //esns 预筛选的目标集合
		context,
		!documentIsHTML,
		results,
		!context || rsibling.test( selector ) && testContext( context.parentNode ) || context //esns 这里是设置变量-outmost，而不是 conext，如果是 sibling 最外层 context 用上一层 context
	);
	return results;
};

// One-time assignments

// Sort stability
support.sortStable = expando.split("").sort( sortOrder ).join("") === expando;  //esns 测试中 现在的sortOrder 只是测试是否有 hasDuplicate 没有改变位置

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
