### 字体

1. A single font “family” is made up of multiple font “faces”. Each font face is a different weight or style in the family. “Weight” refers to the boldness of a particular face, and “style” refers to whether it’s roman (upright), italic, condensed, extended, or some other variant in the family
https://internetingishard.com/html-and-css/web-typography/font-weights-and-styles-9bf7f0.png

In CSS, font weights are expressed as numeric values between 100 and 900. 

“Black” usually means 900, “bold” is 700, “regular” is 400, etc.

In high quality font, Each letter in every face is hand-crafted to ensure it provides a uniform flow to its text.

We didn’t supply a bold font face for the <strong> element to use, so the browser is trying to fake it by auto-converting Roboto Light into a thicker face

Typeface: 整体设计 The design of a collection of glyphs (e.g. letters, numbers, symbols)
Font: 其中一个 A specific size, weight, or style of a typeface (e.g. regular, bold, italic)
In essence, a typeface is like a song and a font is like its MP3 file

Originally, the typeface is a particular design of type, while a font is a type in a particular size and weight. In short, a typeface usually gathers many fonts.

The broadest split is between serif 衬线 and (无)sans-serif 非衬线 typefaces

* a monospace font has the same width

ligature 连字 ffi -> ffl


### 好的框架实现了有用但是困难实现的功能

#### JQuery => HTML5
1. Selector => QuerySelectAll
1. Ajax + Deferred => Fetch (阅读 https://developers.google.com/web/updates/2015/03/introduction-to-fetch)
1. Effects/Fx/Animate => requestanimationframe => Animation/transition/transform
1. Callbacks Object => Loose Coupling/PubSub Pattern/Custom Event

Jquery is a great example of how computer software evolve

New library help the computer software to performance better, computer software level up after absorbing library and make it obsolete.
-> repeat above step and recyle, recursive...

Mircrosoft has no external library effort to help its browser, hence it lag behind others.

No developer interested in Desktop and Microsoft Office like software to make problems for these two to compete.


