### Built-in objects

Boolean: typecast to Boolean from any value
Date 日期
Error 错误异常
	EvalError
	InternalError
	RangeError
	ReferenceError
	SyntaxError
	TypeError
	URIError
Function: create Function
Infinity: 无限值
Intl 多语言
	Intl.Collator
	Intl.DateTimeFormat
	Intl.NumberFormat
JSON: json 操作
Math: 数学
NaN: Not-A-Number 非数值
Number: 数值
Object: 对象
RegExp: regular expression
String: 字符串

$functions 操作
	decodeURI(): NOT recommended
	encodeURI(): NOT recommended
	https://stackoverflow.com/questions/747641/what-is-the-difference-between-decodeuricomponent-and-decodeuri
	decodeURIComponent(): Thumbs up
	encodeURIComponent(): Thumbs up
	escape(): escape special characters
	unescape()
	eval(): create object from string
	uneval(): create string from object
	isFinite(): is finite?
	isNaN(): is NaN?
	parseFloat()
	parseInt()
	null: one primitive type
	undefined: one primitive type

$grouping 结合数据组合
	Array 数组
	Map: key(object,function,value) => value Pairs
	Set: 集合 Only allow same value, as oppose from Array
	WeakMap: better for garbage collector(performance)
	WeakSet: better for garbage collector(performance)

$Meta Programming:  read, generate, analyse and even modify itself while running
	                https://en.wikipedia.org/wiki/Metaprogramming
Reflect: read, generate, analyse
Proxy: modify
Symbol: ??? unique id for property etc ???

$Memory Management 内存控制, 提高速度*
	https://hacks.mozilla.org/2017/06/a-crash-course-in-memory-management/
	ArrayBuffer 二进制数据(base64|local file binary|etc), 不可修改, 从其中创建TypeArray 和 DataView
	TypeArray(no constructor, more like interface)
		https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray
		Int8Array
		Uint8Array
		Uint8ClampedArray
		Int16Array
		Uint16Array
		Int32Array
		Uint32Array
		Float32Array
		Float64Array 
	DataView 提供处理ArrayBuffer在不同机器构架endianness的数据处理
	SharedArrayBuffer 共享内存
	Atomics (Static Object rather like Math) 共享内存控制

$Asynchronous Programing异步编程
	AsyncFunction: creates a new async function object
		Not Global Object => Object.getPrototypeOf(async function(){}).constructor
	Promise: (await-wait for a promise)
	解决异步加上顺序的问题, callbackhell.
	Generator (use yield to pause) 
	GeneratorFunction ( =function* )

Comma Operator 
=> Evaluates each of its operands (from left to right) and returns the value of the last operand.
https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Comma_Operator
a = b = 3, c = 4; // Returns 4 in console

delete Operator has nothing to do with freeing memory, NO POINT use it

void operator: The void operator evaluates the given expression and then returns undefined.
	<a href="javascript:void(0);">Click here to do nothing</a>

this keyword (who own this function, who is the owner) JavaScript's object oriented**
	https://www.smashingmagazine.com/2014/01/understanding-javascript-function-prototype-bind/
	function().bind(this) 捆绑this context

let keyword for block variable declearation

debugger keyword so to debug in IDE ???

module (export, import) 分享

