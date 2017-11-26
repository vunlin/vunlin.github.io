Document Object Model (DOM)

### DOM Interfaces

Window
	Navigator 浏览器 (navigator.userAgent)
	Event (CustomEvent) https://developer.mozilla.org/en-US/docs/Web/API/Event
		EventTarget (event.target)

	URL: create URL object
	Console
	ClipBoard
	DragAndDrop
	History
	Location
	VTTCue

EventTarget (addEventListener, removeEventListener, dispatchEvent)
	Node (ChildNode, NodeList, ParentNode) Node Operation (CRUD, trasversal, all that: appendNode)
		Attr 属性
		CharacterData 数据 
			Text 文字
			Comment 批注 
		Document (doctype, stylesheet etc.)
			DocumentFragment (rather like template, construct parts for Document)
		Element
			HTMLElement <article> <section> <nav> <aside> <header> <footer> <address>
						<em> <strong> <small> <s> <cite> <dfn> <abbr> <ruby>
						<code> <var> <samp> <kbd> <sub> <sup> <i> <b> <u> <mark> <bdi> <bdo> 
						<span> <wbr> <summary> <dt> <dd> <figure> <figcaption> <main> <noscript>
				HTMLHtmlElement <html>
				HTMLHeadElement <head>
				HTMLBodyElement <body>
				HTMLTitleElement <title>
				HTMLBaseElement <base>
				HTMLLinkElement <link>
				HTMLMetaElement <meta>
				HTMLStyleElement <style>
				HTMLHeadingElement <h1-h6>
				HTMLPictureElement <picture>
				HTMLSourceElement <source> 
				HTMLImageElement <img>
				HTMLIFrameElement <iframe>
				HTMLEmbedElement <embed>
				HTMLObjectElement <object>
				HTMLParamElement <param>
				HTMLMediaElement (TimeRanges)
					HTMLVideoElement <video>
					HTMLAudioElement <audio>
				HTMLTrackElement <track>
				HTMLMapElement <map>
				HTMLAreaElement <area>
				HTMLCanvasElement <canvas>
				HTMLAnchorElement <a>
				HTMLQuoteElement <q> <blockquote>
				HTMLDataElement <data>
				HTMLTimeElement <time>
				HTMLBRElement <br>
				HTMLModElement <ins> <del>
				HTMLParagraphElement <p>
				HTMLHRElement <hr>
				HTMLPreElement <pre>
				HTMLOListElement <ol>
				HTMLUListElement <ul>
				HTMLLIElement <li>
				HTMLDListElement <dl>
				HTMLDivElement <div>
				HTMLTableElement <table>
				HTMLTableCaptionElement <caption>
				HTMLTableColElement <colgroup> <col>
				HTMLTableSectionElement <thead> <tbody> <tfoot>
				HTMLTableRowElement <tr>
				HTMLTableDataCellElement <td>
				HTMLTableHeaderCellElement <th>
				HTMLFormElement <form>
				HTMLLabelElement <label>
				HTMLInputElement <input>
				HTMLButtonElement <button>
				HTMLSelectElement <select>
				HTMLOptGroupElement <optgroup>
				HTMLOptionElement <option>
				HTMLDataListElement <datalist>
				HTMLTextAreaElement <textarea>
				HTMLOutputElement <output>
				HTMLProgressElement <progress>
				HTMLMeterElement <meter>
				HTMLFieldSetElement <fieldset>
				HTMLLegendElement <legend>
				HTMLScriptElement <script>
				HTMLTemplateElement <template>

navigator.geolocation (navigator)
https://developer.mozilla.org/en-US/docs/Web/API/Geolocation/Using_geolocation

Screen (window): screen information

Notifications API (window)
https://developer.mozilla.org/en-US/docs/Web/API/Notifications_API/Using_the_Notifications_API

IndexedDB API (window)
https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API

FileHandle API (window)
https://developer.mozilla.org/en-US/docs/Web/API/File_Handle_API
File API Blob - File(window)

Web worker (window) concurrent

Camera API (navigator)
	MediaDevice, MediaStream, MediaRecorder

localStorage (window)

WebSocket (window): send/receive message with server without polling

XMLHttpRequest (window): Server Data
	FormData (interface to construct form data)
Fetch API (window)

WebRTC (window) audio video input (navigator.getMedia): web meeting etc..

MutationObserver (MVVM) MutationRecord

Performance (window) Performance Timeline API
	Timing API (navigator)

WYSIWYG (Selection, Range)

Speech API: Convert Audio to Text

Plugins (navigator): get plugins information etc.

GlobalEventHandlers (see HTML.md)
