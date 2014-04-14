sldr
====

Tiny javascript slider, created for my purposes

How to use
==========

```html
<div id="slider"></div>
<script>
	$('#slider')
		.sldr()
		.sldr('append', $('<div>slide 1</div>'))
		.sldr('append', $('<div>slide 2</div>'))
		.sldr('prepend', $('<div>slide -1</div>'))

	// and to change slide, call
	$('#slider').sldr('mvleft')
	// or
	$('#slider').sldr('mvright')

</script>
```
