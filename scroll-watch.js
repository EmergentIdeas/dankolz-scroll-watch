
/**
 * Watches elements and calls some code when they come into view. By default, adds
 * the class `visible` to the element.
 */
class ScrollWatch {

	/**
	 * Constructs an object to watch elements for when they scroll into view.
	 * @param {string} selector Defines which elements to look at
	 * @param {object} options Changes to the bahvior
	 * @param {int} options.visibleBy Sets an additional number of pixels that the element
	 * must be visible by before the handler is triggered.
	 * @param {function} options.handler The function called when the element should change
	 * based on its visibility. Argument is the element to change. By default, it adds the 
	 * class `visible`. Should return true the handler should NOT be notified about this
	 * element again.
	 */
	constructor(selector, {visibleBy, handler, showOnVisible} = {}) {
		this.selector = selector
		Object.assign(this, {
			visibleBy: 0
			, showOnVisible: true
			, lastWindowPosition: 0
			, handler: (el) => {
				el.classList.add('visible')
				return true
			}
		}, arguments[1])
	}

	evalPositions() {
		let windowPosition = window.scrollY
		let windowHeight = window.innerHeight
		let windowBottom = windowPosition + windowHeight
		
		if(this.lastWindowPosition <= windowPosition) {
			[...document.querySelectorAll(this.selector)].forEach((el) => {
				if(!el.getAttribute('watcher-done')) {
					let offset = this.getCoords(el).top
					let vizPix
					if(('' + this.visibleBy).indexOf('%') > -1) {
						vizPix = windowHeight * (parseInt(this.visibleBy) / 100)
					}
					else {
						vizPix = parseInt(this.visibleBy)
					}

					if(windowBottom > (offset + vizPix)) {
						requestAnimationFrame(() => {
							if(this.handler(el)) {
								el.setAttribute('watcher-done', 'invoked')
							}
						})
					}
				}
			})
			this.lastWindowPosition = windowPosition
		}
	}

	getCoords(elem) { 
		let box = elem.getBoundingClientRect()

		let body = document.body
		let docEl = document.documentElement

		let scrollTop = window.pageYOffset || docEl.scrollTop || body.scrollTop
		let scrollLeft = window.pageXOffset || docEl.scrollLeft || body.scrollLeft

		let clientTop = docEl.clientTop || body.clientTop || 0
		let clientLeft = docEl.clientLeft || body.clientLeft || 0

		let top  = box.top +  scrollTop - clientTop
		let left = box.left + scrollLeft - clientLeft

		return { top: Math.round(top), left: Math.round(left) };
	}
	
	start() {
		window.addEventListener('scroll', () => {
			this.evalPositions(true)
		})
	}
			
}
module.exports = ScrollWatch