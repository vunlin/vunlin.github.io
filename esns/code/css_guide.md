Reset CSS


Global CSS, general design beliefs, general art design, and ideas


1. serif for <h1> heading title, san-serif for <p> etc for reading, font-family: monospace; for code/pre
2. color theory
3. more...


Layout Blocks

1. grid + flex

Individual Element Parts In Layou Blocks (BEM everything)


================== bulma --------

css chaining => :not(.is-multiple):not(.is-loading)::after
-webkit-touch-callout
user-select
border: 3px solid transparent;
pointer-events https://developer.mozilla.org/en-US/docs/Web/CSS/pointer-events
-moz-appearance https://developer.mozilla.org/en-US/docs/Web/CSS/appearance
border-radius: 290486px; basically a circle
.delete::before, .modal-close::before, .delete::after, .modal-close::after => center middle modal and delete with css <81>
.delete:active, .modal-close:active https://developer.mozilla.org/en-US/docs/Web/CSS/:active
padding-bottom: calc(0.375em - 1px); https://developer.mozilla.org/en-US/docs/Web/CSS/calc
cursor: not-allowed;
box-sizing https://developer.mozilla.org/en-US/docs/Web/CSS/box-sizing
-moz-osx-font-smoothing: grayscale;
-webkit-font-smoothing: antialiased;
text-rendering: optimizeLegibility;
text-size-adjust https://developer.mozilla.org/en-US/docs/Web/CSS/text-size-adjust
color: currentColor;
background-color: whitesmoke;
-webkit-overflow-scrolling: touch;
!important is like constant, when you has css name (.has-text-centered) you use (text-align: center !important)
box-shadow
white-space
opacity
list-style-position: outside https://developer.mozilla.org/en-US/docs/Web/CSS/list-style-position
figure https://developer.mozilla.org/en-US/docs/Web/HTML/Element/figure
-webkit-input-placeholder https://css-tricks.com/almanac/selectors/p/placeholder/
padding-top: 150% https://stackoverflow.com/questions/40106955/how-does-padding-top-100-work 
					&& https://bulma.io/documentation/elements/image/

:before :after animation pseudo class http://jsfiddle.net/MxTvw/
content: "\02192"; arrow
max-height: calc(100vh - 160px);
--columnGap: 0.75rem; https://developer.mozilla.org/en-US/docs/Web/CSS/column-gap
var (--columnGap)  https://developer.mozilla.org/en-US/docs/Web/CSS/var
min-content https://developer.mozilla.org/en-US/docs/Web/CSS/width

================== bootstrap --------

tap-highlight-color: https://developer.mozilla.org/en-US/docs/Web/CSS/-webkit-tap-highlight-color
caption-side https://developer.mozilla.org/en-US/docs/Web/CSS/caption-side
-webkit-appearance: button;
word-break https://developer.mozilla.org/en-US/docs/Web/CSS/word-break
prefers-reduced-motion: reduce https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion
calc(0.375rem + 1px);

data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 8 8'%3e%3cpath fill='%2328a745' d='M2.3 6.73L.6 4.53c-.4-1.04.46-1.4 1.1-.8l1.1 1.4 3.4-3.8c.6-.63 1.6-.27 1.2.7l-4 4.6c-.43.5-.8.4-1.1.1z'/%3e%3c/svg%3e

calc((1em + 0.75rem) * 3 / 4 + 1.75rem);

orphan/widow https://developer.mozilla.org/en-US/docs/Web/CSS/orphans / https://developer.mozilla.org/en-US/docs/Web/CSS/widows
column-count https://medium.com/@patrickbrosset/css-grid-css-multi-columns-7664f59bb60c
			 https://developer.mozilla.org/en-US/docs/Web/CSS/columns

backdrop-filter https://developer.mozilla.org/en-US/docs/Web/CSS/backdrop-filter
touch-action https://developer.mozilla.org/en-US/docs/Web/CSS/touch-action
backface-visibility https://developer.mozilla.org/en-US/docs/Web/CSS/backface-visibility
transition: opacity 0.15s ease; / this 0.15 to ensure 60+ fps ???  / but bulma transition-duration: 86ms; ????
position: sticky https://developer.mozilla.org/en-US/docs/Web/CSS/position
vw/vh unit
content: " (" attr(title) ")";
background-clip: border-box;
touch-action: pan-y;

======================== github

ms-hyphens - https://developer.mozilla.org/en-US/docs/Web/CSS/hyphens
-moz-tab-size: 10;
-webkit-touch-callout: none; https://developer.mozilla.org/en-US/docs/Web/CSS/-webkit-touch-callout
mask-image https://developer.mozilla.org/en-US/docs/Web/CSS/mask-image
resize: vertical;

======================= amazon
filter
text-rendering: optimizelegibility;
background-size: https://developer.mozilla.org/en-US/docs/Web/CSS/background-size
outline-offset https://developer.mozilla.org/en-US/docs/Web/CSS/outline-offset





