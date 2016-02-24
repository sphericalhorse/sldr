// create plugin
(function($) {
	// copy from bxslider
	var loadElements = function(selector, callback){
		var total = selector.find('img, iframe').length;
		if (total == 0){
			callback();
			return;
		}
		var count = 0;
		selector.find('img, iframe').each(function(){
			$(this).one('load', function() {
			  if(++count == total) callback();
			}).each(function() {
			  if(this.complete) $(this).load();
			});
		});
	}
	var arrfirst = function(arr) { return arr[0] }
	var arrlast = function(arr) { return arr[arr.length-1] }
	var arrprev = function(arr, item) { return arr[arr.indexOf(item) - 1] }
	var arrnext = function(arr, item) { return arr[arr.indexOf(item) + 1] }

	var Slide = function(content, $dummyContext) {
		this.$el = $('<div class="sldr-item" style="position:absolute" />')
		this.$el.append(content)
		
		// temporary put content into some dummy context to get ability to calculate it size
		$dummyContext.append(this.$el)
		this.width = undefined
		this.isvisible = undefined
		this.leftPos = undefined
		this.rightPos = undefined
	}
	$.extend(Slide.prototype, {
		show: function() {
			this.$el.css('display', 'block')
			this.width = parseInt(this.$el.outerWidth())
			this.rightPos = this.leftPos + this.width
			this.isvisible = true
		}
		, hide: function() {
			this.$el.css('display', 'none')
			this.isvisible = false
		}
		, setPos: function(pos) {
			pos = parseInt(pos)
			this.$el.css('left', pos)
			this.leftPos = pos
			this.rightPos = pos + this.width
		}
		, shiftOn: function(shift, cb) {
			var that = this
			var newPos = that.leftPos + shift
			that.$el.animate({'left': newPos}, function() {
				that.leftPos = newPos
				that.rightPos = that.leftPos + that.width
				cb()
			})
		}
	})


	var Slider = function(el) {
		var that = this

		that.$el = $(el)
		
		// invisible dummy container to calculate items size
		that.$dummyContainer = $('<div class="sldr-dummy" style="visibility:hidden" />')
		that.$el.append(that.$dummyContainer)

		that.animateIsOn = false
		that.sliderItems = []
		that.width = parseInt(that.$el.width())

		that.$el.css({'position': 'relative', 'overflow-x': 'hidden'})
	}
	$.extend(Slider.prototype, {
		append: function(el) {
			var that = this
			var slide = new Slide(el, that.$dummyContainer)
			loadElements(slide.$el, function() {
				var last = arrlast(that.sliderItems)
				that.sliderItems.push(slide)

				var newPos = false
				if(!last) {
					newPos = 0
				} else if(last.isvisible && last.rightPos < that.width) {
					newPos = last.rightPos
				}

				if(newPos === false && newPos < that.width) {
					slide.hide()
				} else {
					slide.show()
					slide.setPos(newPos)
				}


				that.$el.append(slide.$el)
			})
		}
		, prepend: function(el) {
			var that = this
			var slide = new Slide(el, that.$dummyContainer)
			loadElements(slide.$el, function() {

				var first = arrfirst(that.sliderItems)
				that.sliderItems.unshift(slide)

				var newPos = false
				if(!first) {
					newPos = 0
				} else if(first.isvisible && first.leftPos > 0) {
					newPos = first.leftPos - slide.width
				}

				if(newPos === false) {
					slide.hide()
				} else {
					slide.show()
					slide.setPos(newPos)
				}


				that.$el.prepend(slide.$el)
			})
		}
		, _getVisible: function() {
			var res = []
			$.each(this.sliderItems, function(index, item) {
				if(item.isvisible) res.push(item)
			})
			return res
		}
		, getVisible: function() {
			var res = []
			$.each(this.sliderItems, function(index, item) {
				if(item.isvisible) res.push(item.$el)
			})
			return $(res)
		}
		, mvleft: function(callback) {
			var slider = this

			if(slider.animateIsOn) {return}

			var visibles = slider._getVisible()
			var prev = arrprev(slider.sliderItems, visibles[0])

			if(!prev) {return}

			slider.animateIsOn = true


			prev.show()
			prev.setPos(arrfirst(visibles).leftPos - prev.width)

			visibles.unshift(prev)

			var animated = 0

			$.each(visibles, function(index, item) {
				item.shiftOn(prev.width, function() {
					if(++animated != visibles.length) {return}

					// recheck visibility
					var last = arrlast(visibles)
					if(last.leftPos > slider.width) last.hide()

					slider.animateIsOn = false
					if(callback) callback()
					if(slider.sliderItems.indexOf(prev) == 0) {slider.$el.trigger('sldr:firstVisible')}
				})
			})
		}
		, mvright: function(callback) {
			var slider = this

			if(slider.animateIsOn) {return}

			var visibles = slider._getVisible()
			var last = arrlast(visibles)
			last.show() // recalulate item's positions in case of resize
			var next = arrnext(slider.sliderItems, last)

			if(!next) {return}

			slider.animateIsOn = true

			next.show()
			next.setPos(last.rightPos)

			visibles.push(next)

			var animated = 0

			$.each(visibles, function(index, item) {
				item.shiftOn(-next.width, function() {
					if(++animated != visibles.length) {return}

					// recheck visibility
					var first = arrfirst(visibles)
					if(first.leftPos < 0) first.hide()

					slider.animateIsOn = false
					if(callback) callback()
					if(slider.sliderItems.indexOf(next) == (slider.sliderItems.length -1)) {slider.$el.trigger('sldr:lastVisible')}
				})
			})
		}
	})

	$.fn.sldr = function(method, options) {
		var el = this[0]
		if(typeof method != 'string' || method == 'init') {
			el.slider = new Slider(el, options)
			this.children(':not(.sldr-dummy)').each(function(index, item) {
				el.slider.append(item)
			})
		} else {
			return el.slider[method](options)
		}
		return this
	}

})(jQuery)