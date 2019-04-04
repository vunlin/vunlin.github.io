### CSS

#### animation or transition
1. @keyframes (@-webkit-keyframes, @-moz-keyframes, @-ms-keyframes, @-o-keyframes)
1. animation-delay: <0.1-0.8s, -1000ms, -83.33333ms>; (-moz-animation-delay, -ms-animation-delay, -o-animation-delay, -webkit-animation-delay)
1. animation-direction: <normal> (-moz-animation-direction, -o-animation-direction, -webkit-animation-direction)
1. animation-duration: <0.5s, ms>; (-moz-animation-duration, -ms-animation-duration, -o-animation-duration, -webkit-animation-duration)
1. animation-fill-mode: <backward, both, forward>; (-moz-animation-fill-mode, -ms-animation-fill-mode, -o-animation-fill-mode, -webkit-animation-fill-mode)
1. animation-iteration-count: <1>; (-moz-animation-iteration-count, -ms-animation-iteration-count, -o-animation-iteration-count, -webkit-animation-iteration-count)
1. animation-name: <String>; (-moz-animation-name, -ms-animation-name, -o-animation-name, -webkit-animation-name)
1. animation-timing-function: <keyword method>; (-webkit-animation-timing-function)
1. animation: <String: name> <cubic-bezier , linear> <...shorthand>; (-moz-animation, -ms-animation, -o-animation, -webkit-animation)

1. transform-origin: <keyword, %, number>; (-moz-transform-origin, -ms-transform-origin, -o-transform-origin, -webkit-transform-origin)
1. transform-style: <preserve-3d>; (-moz-transform-style, -o-transform-style, -webkit-transform-style)
1. transform: <methods...>; (-moz-tranform, -ms-transform, -o-transform, -webkit-transform)
1. transition-delay: <Ns>; (-moz-transition-delay, -webkit-transition-delay)
1. transition-duration: <Ns,Nms>; (-webkit-transition-duration)
1. transition-property: <all, property keyword, -moz-transform, -ms-transform, -o-transform, transform>; (-moz-transition-property, -ms-transition-property, -o-transition-property, -webkit-transition-property)
1. transition-timing-function: <cubic-bezier, ease-in, keyword>; (-moz-transition-timing-function, -ms-transition-timing-function, -o-transition-timing-function, -webkit-transition-timing-function)
1. transition: <transform, -moz-transform, -ms-transform, -o-transform, -webkit-transform, keyword> <method shorthand...>; (-moz-transition, moz-webkit-transition, -ms-webkit-transition, -khtml-webkit-transition, -ms-transition, -o-transition, -o-webkit-transition, -webkit-transition)

#### Mobiles

1. @media
	1. max-width, min-width
	1. pointer
	1. prefers-reduced-motion
	1. all, only screen and, print
	1. orientation
	1. -webkit-max-device-pixel-ratio, -webkit-min-device-pixel-ratio 
	1. -webkit-backdrop-filter 
	1. -ms-high-contrast
	1. -ms-accelerator
	1. min-resolution

1. touch-action: <none, manipulation, pan-y>; (-ms-touch-action)
1. touch-callout: <none> (-webkit-touch-callout)

#### Font

1. @font-face
1. font: <shorthand...>;
1. font-display: <optional>;
1. font-family: <names>
1. font-size: <rem, em, px, 200%, pt, keyword - xx-small>;
1. font-stretch: <normal>;
1. font-style: <inherit, italic, normal>;
1. font-variant-numeric: <tabular-nums>;
1. font-variant: <normal, small-caps>;
1. font-weight: <number, keyword, var(--customVariable)>;
1. font-feature-settings: <liga>; (-moz-font-feature-settings, -webkit-font-feature-settings)
1. font-smooth: <always>;
1. font-smoothing: <antialiased, auto, subpixel-antialiased>; (-moz-font-smoothing, -ms-font-smoothing, -o-font-smoothing, -webkit-font-smoothing)
1. <auto, gray-scale>;  (-moz-osx-font-smoothing)

#### Box Mode

1. border-bottom-colors: <none>; (-moz-border-bottom-colors)
1. border-left-colors: <none>; (-moz-border-left-colors)
1. border-right-colors: <none>; (-moz-border-right-colors)
1. border-top-colors: <none>; (-moz-border-top-colors)
1. border-radius: <rem, em, px, 0-100%, inherit>; (-khtml-border-radius, -ms-border-radius, -moz-border-radius, -o-border-radius, -webkit-border-radius)
1. border-bottom-radius <0-px>
1. border-bottom-left-radius: <0-px>; (-moz-border-radius-bottomleft, -webkit-border-bottom-left-radius)
1. border-bottom-right-radius: <0-px>; (-moz-border-radius-bottomright, -webkit-border-bottom-right-radius)
1. border-top-left-radius: <0-px>; (-moz-border-radius-topleft, -webkit-border-top-left-radius)
1. border-top-right-radius: <0-px>; (-moz-border-radius-topright, -webkit-border-top-right-radius)
1. border-style: <solid, none, dashed, keyword...>;
	1. border-bottom-style, border-right-style, border-top-style
1. border-width: <0-px, rem, >;
	1. border-bottom-width, border-right-width
1. border: <shorthand...>;
	1. border-bottom, border-left, border-right, border-top
1. border-collapse: <collapse, separate>;
1. border-spacing: <0-px>;
1. border-color: <#(3/6), transparent, keyword, hsla, rgba, var(--customVariable)>;
	1. border-left-color, border-right-color, border-top-color
1. border-image: <none>;
1. margin, margin-bottom, margin-left, margin-top, margin-rigth: <UNIT, calc, none>;
1. padding, padding-bottom, padding-left, padding-top, padding-right: <UNIT, calc, none>;
1. outline: <shorthand...>
1. outline-color: <COLOR>;
1. outline-offset: <px>;
1. outline-style: <none>;
1. outline-width: <0-px>

#### Flex or Grid

1. align-content: <center>; (-webkit-align-content)
1. align-items: <center, flex-start, flex-end, initial, start, stretch>; (-moz-align-items, -webkit-align-items)
1. align-self: <center, flex-start>; (-moz-align-self, -webkit-align-self)
1. box-align: <center, end, start, stretch, initial>; (-moz-box-align, -webkit-box-align)
1. box-direction: <normal, reverse>; (-moz-box-direction, -webkit-box-direction)
1. box-flex: <0, 1, initial>; (-moz-box-flex, -webkit-box-flex)
1. box-orient: <horizontal, vertical>; (-moz-box-orient, -webkit-box-orient)
1. box-pack: <center, end, justify, start>; (-moz-box-pack, -webkit-box-pack)
1. flex-align: <keyword>; (-ms-flex-align)
1. flex-item-align:<keyword> ; (-ms-flex-item-align)
1. flex-line-pack:<keyword> ; (-ms-flex-line-pack)
1. flex-negative: <0,1>; (-ms-flex-negative)
1. flex-positive: <0,1>; (-ms-flex-positive)
1. flex-order: <number, initial>; (-ms-flex-order)
1. flex-pack: <keyword>; (-ms-flex-pack)
1. flex-preferred-size: <px, auto, %>; (-ms-flex-preferred-size)
1. flex-basis: <100px, 300px, 0, 100%, auto>; (-moz-flex-basis, -webkit-flex-basis)
1. flex-direction: <row, column, row-reverse, column-reverse>; (-moz-flex-direction, -ms-flex-direction, -webkit-flex-direction)
1. flex-flow: <column, row, nowrap, wrap>; (-moz-flex-flow, -ms-flex-flow, -webkit-flex-flow)
1. flex-grow: <1>; (-moz-flex-grow, -ms-flex-grow, -webkit-flex-grow)
1. flex-shrink: <0, 1>; (-moz-flex-shrink, -webkit-flex-shrink)
1. flex-wrap: <wrap, no-wrap, wrap-reverse>; (flex-wrap, -ms-flex-wrap, -webkit-flex-wrap)
1. flex: <shorthand...>; (-moz-flex, -ms-flex, -webkit-flex)
1. order: <number>; (-moz-order, -webkit-box-ordinal-group, -webkit-order)
1. justify-content: <center, flex-start, flex-end, space-between, space-around>; (-moz-justify-content, -webkit-justify-content)
1. grid-column-gap: <px>;
1. grid-column-start: <number>
1. grid-gap: <45px 16px>;
1. grid-row-gap: <13px>;
1. grid-template-columns: <fr, px, repeat(), auto>;

#### Display And Position

1. position: <-webkit-sticky, absolute, fixed, inherit, initial, relative, static, sticky, unset>
1. opacity: <0-1>; (-khtml-opacity, -moz-opacity, -o-opacity, -webkit-opacity)
1. background-clip: <border-box , content-box, padding-box, padding, text>; (-moz-background-clip, -webkit-background-clip)
1. background-size: <contain, cover, %/%, px/px>; (-moz-background-size, -o-background-size, -webkit-background-size)
1. object-fit: <contain>; (-o-object-fit)
1. box-shadow: <none, inset> <em, px, pt> <color, rgba>; (-moz-box-shadow, -webkit-box-shadow)
1. overflow-style: <none, scrollbar, -ms-autohiding-scrollbar>; <-ms-overflow-style>
1. overflow-scrolling: <touch>; (-webkit-overflow-scrolling)
1. overflow, overflow-x, overflow-y: <visible, auto, hidden, keyword>; (-ms-overflow-y)
1. overflow-wrap: <break-word>;
1. outline-style: <none>; (-moz-outline-style)

1. text-decoration-skip-ink: <none>; (-webkit-text-decoration-skip-ink)
1. text-decoration-skip: objects; (-webkit-text-decoration-skip)
1. text-decoration-style: dotted; (-webkit-text-decoration-style)
1. text-decoration: <underline> <dotted>; (-moz-text-decoration, -webkit-text-decoration)
1. text-fill-color: <transparent>; (-webkit-text-fill-color)
1. text-stroke-width: <medium>; (-webkit-text-stroke-width)
1. text-stroke: <1.5px #000>; (-webkit-text-stroke)

1. tab-size: <4>; (-moz-tab-size)
1. text-overflow: <ellipsis, clip, wrap>; (-ms-text-overflow, -o-text-overflow)
1. text-rendering: <auto, optimizeLegibility, optimizeSpeed, geometricPrecision, inherit>; (-moz-text-rendering, -ms-text-rendering, -o-text-rendering, -webkit-text-rendering)
1. text-size-adjust: <100%>; (-moz-text-size-adjust, -ms-text-size-adjust, -webkit-text-size-adjust)

1. background-attachment: <fixed, scroll>;
1. background-blend-mode: <keyword>;
1. background-color: <#(3/6), keyword, rgba, hsla, transparent, unset, url, var(--customVariable)>
	1. border-bottom-color
1. background-image: <none, url(lilnk/data:image|svg)> 
	<linear-gradient , -moz-linear-gradient, -moz- oldlinear-gradient, -ms-linear-gradient, -o-linear-gradient -webkit-gradient, -webkit-linear-gradient>;
	<repeating-linear-gradient , radial-gradient>
1. background-origin: <border-box , content-box, padding-box>;
1. background-position: <px, %, keyword, calc, multiple set??>;
1. background-repeat: <no-repeat , repeat, repeat-x, repeat-y, round>;
1. background: <shorthand...>;

1. color: <#(3/6), transparent, keyword, hsla, rgba, var(--customVariable)>;
1. content: <counter(), attr(data-badge-caption), char entity, string, none, initial, normal, url>;
1. counter-increment: <variable>;
1. counter-reset: <variable>;
1. cursor: <keyword, url, zoom-in, zoom-out>;
1. direction: <inherit, ltr, rtl>;
1. display: <-moz-box, -moz-flex, -moz-flexbox, -moz-inline-flex, -moz-inline-box, -moz-inline-stack, -ms-flexbox, -ms-inline-flexbox, -webkit-box, -webkit-flex, -webkit-inline-box, -webkit-inline-flex>;
		<block, compact, flex, grid, inherit, inline, inline-block, inline-flex, inline-lock, inline-table, list-item, none>
		<run-in , table, table-cell, table-column, table-column-group, table-header-group, table-footer-group, table-row, table-row-group>

1. bottom,top,left,right: <em, rem, px, %>;
1. clear: <both, left, right, none, unset>;
1. height, width, max-height, min-height, max-width, min-width: <UNIT, calc, auto, unset, initial, inherit, device-width, max-content>;
1. letter-spacing: <Unit, normal>;
1. line-break: <auto>;
1. line-height: <Unit>;

1. list-style: <shorthand...>;
1. list-style-image: <none, url>;
1. list-style-position: <inside, outside>
1. list-style-type: <keyword, -moz-arabic-indic, devanagari, lower-alpha, lower-roman>;
1. scrollbar-width: <none>;

1. table-layout: <auto, fixed>;
1. text-align: <keyword>;
1. text-decoration-color: <var (--fds-secondary-text)>;
1. text-decoration-skip-ink: <none>;
1. text-decoration: <line-through , none, keyword, underline>;
1. text-indent: <unit>;
1. text-index: <-999px>;
1. text-shadow: <px, keyword..>;
1. text-size-adjust: <100%>
1. text-transform: <capitalize, uppercase, keyword>

1. unicode-bidi: <isolate, -moz-isolate, -webkit-isolate, embed, bidi-override>
1. vertical-align: <UNIT(px,em,%), keyword>, sub, super, text-top, text-bottom>;
1. visibility: <0s 1s, collapse, hidden, inherit, visible>
1. white-space: <-moz-pre-wrap, -o-pre-wrap, pre-wrap, initial, inherit, normal, nowrap, pre, pre-line, pre-wrap>

1. word-break: <break-all , break-word, keep-all>
1. word-spacing: <UNIT>;
1. word-wrap: <break-word , normal>;
1. z-index: <Number -100-1000000>;
1. zoom: <Number>;
	
#### Column

1. column-break-inside: <avoid>; (-moz-column-break-inside, -webkit-column-break-inside)
	1. break-inside: <avoid, avoid-column>;
1. column-count: <2, 3>; (-moz-column-count, -webkit-column-count)
1. column-fill: <balance>; (-moz-column-fill, -webkit-column-fill)
1. column-gap: <em, rem, px>; (-moz-column-gap, -webkit-column-gap)
1. column-rule-color: <rgba(255, 255, 255, 0.2)>;
1. column-rule: <1px solid #e5e5e5>;
1. column-span: <all>;
1. columns: <2>;
1. column-width: <em, px>; (-moz-column-width, -webkit-column-width)

#### Page

1. @page: Printing
1. page-break-after: <avoid>
1. page-break-before: <avoid>
1. page-break-inside: <auto, avoid>

#### SVG

1. stroke-dasharray: <px, number>;
1. stroke-dashoffset: <number>;
1. stroke-linecap: <round>;
1. stroke-opacity: <0-1>;
1. stroke-width: <unit>;
1. stroke: <COLOR>;
1. fill-opacity: <0-1>;
1. fill: <COLOR>;


#### others

--custom-variable 
1. @supports: Feature Dectction
1. @-ms-viewport
1. @-moz-document
1. user-select: <none, text>; (-khtml-user-select, -moz-user-select, -ms-user-select, -o-user-select, -webkit-user-select)
1. pointer-events: <all, none, painted, unset, auto>
1. appearance: <none, textfield, button, listbox, radio>; (-moz-appearance, -o-appearance, -webkit-appearance)
1. windows: <1, 2, 3>;
1. will-change: <bottom, opacity, left, right, scroll-position, keyword>;
1. backface-visibility: <hidden>; (-moz-backface-visibility, -o-backface-visibility, -webkit-backface-visibility)
1. box-sizing: <border-box, content-box, inherit> <!important>; (-moz-box-sizing, -ms-box-sizing, -o-box-sizing, -webkit-box-sizing)
1. filter: <blur(45px) brightness(0.85), keyword method>; (-moz-filter, -ms-filter, -o-filter, -webkit-filter)
1. backdrop-filter: <keyword method>; (-webkit-backdrop-filter)
1. mask-image: <-webkit-radial-gradient, none, url>; (-webkit-mask-image)
1. nbsp-mode: <normal>; (-webkit-nbsp-mode)
1. high-contrast-adjust: <none>; (-ms-high-contrast-adjust)
1. tap-highlight-color: <rgba, transparent>; (-webkit-tap-highlight-color)
1. force-broken-image-icon: <1>; (-moz-force-broken-image-icon)
1. line-clamp: <number>; (-webkit-line-clamp)
1. padding-start: <0>; (-webkit-padding-start)
1. hyphens: <auto, none>; (-moz-hyphens, -ms-hyphens, -o-hyphens, -webkit-hyphens)
1. interpolation-mode: <bicubic>; (-ms-interpolation-mode)
1. perspective: <1000, 500px>; (-moz-perspective, -o-perspective, -webkit-perspective)
1. writing-mode: <lr-tb , horizontal-tb;>; (-ms-writing-mode, -webkit-writing-mode)
1. user-modify: <read-write-plaintext-only>; (-webkit-user-modify)
1. caption-side: <bottom>;
1. caret-color: <#000, #FFF>;
1. clip-path: polygon(0 0, 0 0, 0 0, 0 0);
1. clip: <auto, rect>;
1. dominant-baseline: <text-before-edge>;
1. image-rendering: <-webkit-optimize-contrast, optimize-contrast>;
1. isolation: <auto>;
1. mix-blend-mode: <keyword>;
1. overscroll-behavior-x: <contain>
1. overscroll-behavior-y: <contain>
1. overscroll-behavior: <contain>
1. resize: <none, both, horizontal, vertical>;
1. quote: <none, '\201C''\201D''\2018''\2019'>;