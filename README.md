sldr
====

Tiny javascript slider, created for my purposes

How to use
==========

```html
<div id="slider"></div>
<script>
	var slider = $('#slider')
	slider.sldr()
	slider.sldr('append', $('<div>slide 1</div>'))
	slider.sldr('append', $('<div>slide 2</div>'))
	slider.sldr('prepend', $('<div>slide -1</div>'))

	// and to change slide, call
	slider.sldr('mvleft')
	// or
	slider.sldr('mvright')

</script>
```
