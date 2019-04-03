Object
	(constructor)
	.freeze
	.seal ("https://stackoverflow.com/questions/21402108/difference-between-freeze-and-seal-in-javascript")
	.isFrozen
	.assign (React)
	.getPrototypeOf
	.prototype
		.toString (Every Object pretty much has similar toString, but not always the same)
		.hasOwnProperty
		.propertyIsEnumerable
		.constructor
	.create
	.keys  
	.values (plyr)
	.entries (plyr)
	.defineProperty  
	.defineProperties  
	.getOwnPropertyNames  
	.getOwnPropertySymbols (React)
	.isExtensible  
	.preventExtensions
	.getOwnPropertyDescriptor (PropertyDescriptor Object) 
		.configurable
		.get
		.set

Function
	new Function()
	.prototype  
		.call  
		.apply  
		.bind  

String
	(return string primivite NOT new String Constructor object)
	new String 
	.fromCharCode  
	.prototype
		.replace  
		.slice  
		.split  
		.charAt  
		.charCodeAt  
		.toLowerCase  
		.toUpperCase  
		.indexOf  
		.lastIndexOf  
		.match  
		.trim  
		.subString  
		.startsWith

window
	.parseFloat  
	.parseInt  
	.isFinite  
	.isNaN  
	.pageXOffset
	.pageYOffset
	.navigator  
		.userAgent  
		.languages (.userLanguages)
	.performance  
		.mark  
    	.measure  
    	.clearMarks  
    	.clearMeasures  
    	.now  
    .setTimeOut  
    .clearTimeOut  
    .requestAnimationFrame  
    .cancelAnimationFrame
    .ontransitionend  
    .onwebkittransitionend  
    .onanimationend  
    .onwebkitanimationend  
    .getComputedStyle  
    .getSelection
    .escape
    .event
    .matchMedia
    .localStorage
    	.getItem
    	.setItem
    	.removeItem
    .location
    	.host
    	.href
    	.protocol
    	.hash
    .URL
    	.createObjectURL
    .DOMParser
    .encodeURIComponent
    .console
		.error
		.warn 
		.info

Selection
	.prototype
		.anchorNode
		.anchorOffset
		.addRange
		.removeAllRanges
		.extend (React)

Range 
	.prototype
		.setStart
		.setEnd

Element (HTMLUnknownElement, SVGElement)
	.prototype
		.setAttributeNS  
		.setAttribute  
		.getAttribute  
		.tagName  
		.hasAttribute  
		.removeAttribute  
		.innerHTML  
		.outerHTML  
		.classList  
		.getClientRects (Jquery)
		.getBoundingClientRect  
		.insertAdjacentElement
		.getElementsByTagName
		.getElementsByClassName
		.matches
	HTMLElement  
		.prototype  
			.offsetHeight  
			.style  
			.focus
		HTMLSelectElement  
			.prototype  
				.options  
				.selectedIndex
		HTMLInputElement
			.prototype
				.selectionStart
				.selectionEnd
		HTMLMediaElement
			.prototype
				.canPlayType
				.currentTime
				.src
				.play
				.load
		HTMLIFrameElement
			.prototype
				.contentWindow

Node  
	.prototype
		.insertBefore  
		.removeChild  
		.appendChild  
		.parentNode  
		.nextSibling  
		.textContent  
		.hasChildNodes  
		.ownerDocument  
		.childNodes  
		.firstChild  
		.lastChild  
		.cloneNode  
		.textContent  
		.nodeType  
		.nodeName
		.nodeValue
		.replaceChild
		.compareDocumentPosition

document
	.createTextNode
	.createEvent (event object : "Event", "UIEvents", "MouseEvents", "MutationEvents", "HTMLEvents") 
	.createElement  
	.createElementNS  
	.createComment  
	.createRange
	.createDocumentFragment
	.querySelector  
	.querySelectorAll
	.activeElement  
	.hasFocus
	.body  
	.documentElement (root Element object) 
	.getElementById
	.getElementsByTagName
	.getElementsByClassName
	.defaultView
	.pictureInPictureEnabled
	.readyState

Event  
	.prototype  
		.type
		.currentTarget
		.timeStamp  
		.stopImmediatePropagation  
		.target (alias == .srcElement)
		.initEvent  
		.defaultPrevented
		.preventDefault
		.error
		.stopPropagation
		.cancelBubble
	UIEvent  
		.prototype  
			.which  
		CompositionEvent 
			.initCompositionEvent (compositionStart?)
		KeyboardEvent (is instanceOf KeyboardEvent)  
			.prototype  
				.keyCode  
				.key  
				.metaKey 
				.altKey
				.ctrlKey
				.shiftKey
	ErrorEvent (Not Supported? - React)
		.prototype
			.lineno

EventTarget  
	.prototype
		.addEventListener  
		.removeEventListener  
		.dispatchEvent  

CSSStyleDeclaration  
	.setProperty  

Math
	.floor  
	.max  
	.min  
	.round
	.abs
	.random
	.trunc
	.pow

Number
	.NaN
	.prototype
		.tofixed

DOMTokenList (Element.prototype.classList)
	.prototype  
		.add  
		.remove  
		.contains

DOMImplementation
	.prototype
		.createHTMLDocument

Array
	new Array()
	.isArray  
	.from
	.prototype
		.indexOf  
		.splice  
		.reduce  
		.concat  
		.every  
		.pop  
		.push  
		.map  
		.join  
		.slice  
		.sort  
		.shift  
		.unshift  
		.some  
		.forEach  
		.filter  
		.includes
		.reverse

Set (WeakSet)
	new Set()
	.prototype
		.add
		.delete
		.has

Map (WeakMap)
	new Map()
	.prototype
		.has

JSON
	.stringify  
	.parse

Date
	.now
	.prototype
		.getTime  

RegExp
	.prototype
		.test  
		.source  
		.exec  

Reflect
	.ownKeys (Object.keys if non-existant - vuejs)

Proxy (vuejs)
	new Proxy()

Symbol (vuejs, React)
	.iterator
	.for

Promise (MutationObserver for IE <fallback>-> setImmediate <fallback>-> setTimeOut - vuejs)
	new Promise()  
	.resolve  
	.reject  
	.prototype  
		.next  
		.catch  
		.finally  

XMLHttpRequest
	new XMLHttpRequest()
	.prototype
		.status
		.statusText
		.response
		.responseText
		.open
		.send
		.setRequestHeader
		.onload
		.onerror
		.onabort
		.ontimeout
		.getAllResponseHeaders
		.withCredentials
		.overrideMimeType

MessageChannel
	.prototype
		.port1 (MessagePort)
		.port2

MessagePort
	.prototype
		.onmessage
		.postMessage

Error 
	(Constructor)
	new Error()
	TypeError
		new TypeError()

Keyword  
	in  
	typeof  
	new  
	instanceof  
	throw  
	catch  
	try  
	this  
	arguments (Function)
		.length  
	void  
	>>> <<<  
	^  
	Iterators and generators ("https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Iterators_and_Generators")

LibraryVersions
	vuejs (v2_6_10)
	React (v16_8_6)
	plyr (v3_5_2)
	Jquery (v3_3_1)



