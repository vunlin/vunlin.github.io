### HTML Tags

1. <!DOCTYPE html> 必须有这个才可避免 quirk mode

#### Main root

1. html - HTMLHtmlElement: 

#### Document metadata

1. base - HTMLBaseElement: **没人用** specifies the base URL to use for all relative URLs contained within a document
1. head - HTMLHeadElement: contains machine-readable information (metadata) about the document, like its title, scripts, and style sheets
1. link - specifies relationships between the current document and an external resource **(stylesheet, icons)**
1. meta - HTMLMetaElement: represents metadata that cannot be represented by other HTML meta-related elements, like <base>, <link>, <script>, <style> or <title>
1. style - contains style information for a document, or part of a document
1. title - defines the document's title that is shown in a browser's title bar or a page's tab

#### Sectioning root

1. body - HTMLBodyElement: represents the content of an HTML document

#### Content sectioning

1. address - provides contact information for a person or people, or for an organization.
1. article - 单独文章的分区
1. aside - 文章(旁白/离题话)文字区
1. footer - 一个分区中的 底部更细的分区
1. header - 一个分区中的 顶部更细的分区
1. h1,h2,h3,h4,h5,h6 - HTMLHeadingElement: six levels of section headings
1. hgroup - 包含 h1-h6 的分组，It groups a set of <h1>–<h6> elements
1. main - the dominant content of the <body> of a document.
1. nav - a section of a page whose purpose is to provide navigation links
1. section - represents a standalone section

#### Text content And Inline text semantics

1. a - HTMLAnchorElement: **anchor element** creates a hyperlink to other web pages, files, locations within the same page, email addresses, or any other URL
1. abbr - abbreviation or acronym
1. b - draw the reader's attention to the element's contents, This was formerly known as the Boldface element. However, you should not use <b> for styling text
1. bdi,bdo - **没人用** HTML Bidirectional Isolate/Overwrite element, 独立处理包含文字的 展示方向
1. br - produces a line break in text (carriage-return)
1. blockquote, q - HTMLQuoteElement: block quote ** <q> is inline quote**
1. cite - describe a reference to a cited creative work, and must include the title of that work
1. pre - preformatted text
1. code - a short fragment of computer code
1. data - **没人用** 给机器/程序使用的数据
1. dd, dl, dt - definition list
1. dfn - definition term
1. dir - The obsolete HTML Directory element (<dir>) is used as a container for a directory of files and/or folders
1. div - the generic container for flow content
1. p - a paragraph.
1. em - marks text that has stress emphasis
1. figure, figcaption - Figure With Optional Caption
1. hr - a thematic break between paragraph-level elements
1. ul, li, ol - list items 
1. i - marks text as difference, usually in italic type
1. kbd - denoting textual user input from a keyboard, voice input, or any other text entry device
1. mark - marked or highlighted
1. ruby, rb, rp, rt, rtc - **没人用** Ruby
1. s - strikethrough
1. samp - sample (or quoted) output from a computer program
1. small - makes the text font size one size smaller
1. span - a generic inline container for phrasing content
1. strong - indicates that its contents have strong importance
1. sub, sup - Subscript element, Superscript element
1. time - HTMLTimeElement: represents a specific period in time
1. tt - The obsolete HTML Teletype Text element which is presented using the user agent's default monospace font face
1. u - simple solid underline
1. var - a variable in a mathematical expression or a programming context
1. wbr - a word break opportunity 用于太长字串的时候???
1. del - HTMLModElement: represents a range of text that has been deleted from a document
1. ins - HTMLModElement: represents a range of text that has been added to a document

#### Image and multimedia

1. area, map -  **没人用** an image map (a clickable link area)
1. audio, video, track, source (HTMLTrackElement) - sound, video content in documents
1. img - embeds an image into the document

#### Embedded content

applet - The obsolete HTML Applet Element
embed, noembed - HTMLEmbedElement: embeds external content such as a browser plug-in
object, param - HTMLObjectElement: represents an external resource, which can be handled by a plugin
iframe - a nested browsing context
picture, source - provide versions of an image for different display/device scenario 多个图片资源，用于不同情况下

#### Scripting

1. canvas - HTMLCanvasElement: canvas scripting API or the WebGL API to draw graphics and animations
1. script, noscript - embed or reference executable code, typically JavaScript code

#### Table content

1. table - 	HTMLTableElement: represents tabular data
1. caption - HTMLTableCaptionElement: the caption (or title) of a table, and if used is always the first child of a <table>
1. colgroup, col - HTMLTableColElement: a group of columns
1. thead, tbody, tfoot - section of table
1. tr, th, td - row of table

#### Form

1. form - a document section that contains interactive controls for submitting information to a web server
1. fieldset, legend - 分区 group several controls as well as labels (<label>) within a web form
1. button, label, input, textarea - 控件 
1. meter - 米表 represents either a scalar value within a known range or a fractional value
1. progress - 进程表
1. select, optgroup, opt - a control that provides a menu of options
1. datalist - HTMLDataListElement: 给其他控件使用的数据
1. output - a container element into which a site or app can inject the results of a calculation or the outcome of a user action

#### Interactive elements

details, summary - 下滑菜单细表 reates a disclosure widget in which information is visible only when the widget is toggled
dialog - 对话弹窗
menu, menuitem - 菜单

#### Web Components

template - 模板

#### SVG

1. svg
1. polygon
1. path
1. g