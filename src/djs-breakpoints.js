/**
 * @author Edouard Demotes-Mainard <https://github.com/EdouardDem>
 * @license http://opensource.org/licenses/BSD-2-Clause BSD 2-Clause License
 */

/**
 * Object djs for namespace
 */
window.djs = window.djs || {};
/**
 * Bind events to detect responsive breakpoints.
 * This object is "chainable"
 *
 * @see https://github.com/EdouardDem/djs-resize
 * @requires djs.resize <https://github.com/EdouardDem/djs-resize>
 */
breakpoints = {

	/**
	 * Used to store breakpoints values
	 * Default values, should be overriden
	 *
	 * @private
	 * @var {Object}
	 */
	_values: {
		xs: 0,
		sm: 600,
		md: 960,
		lg: 1240
	},
	/**
	 * Debug flag, for console logging
	 *
	 * @private
	 * @var {Boolean}
	 */
	_debug: false,
	/**
	 * Add the scroll bar width to the window width ?
	 * Should be true
	 *
	 * @private
	 * @var {Boolean}
	 */
	_dealWithScrollbar: true,
	/**
	 * Store the actual window width
	 *
	 * @private
	 * @var {Integer}
	 */
	_actualWidth: 0,
	/**
	 * Namespace used to bind events
	 *
	 * @private
	 * @var {String}
	 */
	_namespace: 'breakpoints',
	/**
	 * jQuery body element
	 *
	 * @private
	 * @var {Object}
	 */
	$body: null,
	/**
	 * jQuery html+body element
	 *
	 * @private
	 * @var {Object}
	 */
	$htmlBody: null,
	/**
	 * jQuery window element
	 *
	 * @private
	 * @var {Object}
	 */
	$window: null,
	scrollBarWidth: 0,

	/**
	 * Initialize the object
	 *
	 *
	 */
	init: function () {
		this.functions = {};
		this.$body = $('body');
		this.$htmlBody = $('html, body');
		this.$window = $(window);
		this.scrollBarWidth = this.getScrollBarWidth();
		this._actualWidth = this.getWindowWidth();
		this.setPoint();
		this.bind();
	},
	/**
	 * Bind les events resize avec l'appel des breakpoints
	 */
	bind: function () {
		resize.bind(this._namespace, this.run.bind(this), resize.stacks.core);
	},
	/**
	 * Unbind les events resize
	 */
	unbind: function () {
		resize.unbind(this._namespace, resize.stacks.core);
	},
	/**
	 * Appelle les fonctions de breakpoints après un resize
	 */
	run: function () {
		var w = this.getWindowWidth();
		var sens = w < this._actualWidth ? 'down' : 'up';
		var points = [];
		if (sens == 'up') {
			$.each(this._values, function (index, value) {
				if (value > this._actualWidth && w >= value) points.push(index);
			}.bind(this));
		} else {
			$.each(this._values, function (index, value) {
				if (value <= this._actualWidth && w < value) points.push(index);
			}.bind(this));
			points.reverse();
		}
		this._actualWidth = w;
		this.setPoint();

		//Run functions
		for (var i = 0; i < points.length; i++) {
			var point = points[i];
			if (this._debug) console.log('[breakpoints] ' + point + '-' + sens);
			if (!this.functions[point]) continue;
			if (!this.functions[point][sens]) continue;
			$.each(this.functions[point][sens], function (index, value) {
				for (var j = 0; j < value.length; j++) {
					value[j]();
				}
			});
		}
	},
	/**
	 * Ajoute un callback
	 *
	 * @param {String} value        Le breakpoint à détecters
	 * @param {String} sens            Le sens de resize
	 * @param {Object} _function    Le callback
	 * @param {String} tag            Optionnel, un tag identifiant la fonction
	 */
	add: function (value, sens, _function, tag) {
		if (tag == null) tag = '__';
		if (!this.functions[value]) this.functions[value] = {};
		if (!this.functions[value][sens]) this.functions[value][sens] = {};
		if (!this.functions[value][sens][tag]) this.functions[value][sens][tag] = [];
		this.functions[value][sens][tag].push(_function);
	},
	/**
	 * Supprime un callback
	 *
	 * @param {String} value        Le breakpoint à détecters
	 * @param {String} sens            Le sens de resize
	 * @param {String} tag            Optionnel, un tag identifiant la fonction
	 */
	remove: function (value, sens, tag) {
		if (tag == null) tag = '__';
		if (!this.functions[value]) return;
		if (!this.functions[value][sens]) return;
		if (!this.functions[value][sens][tag]) return;
		delete this.functions[value][sens][tag];
	},
	/**
	 * Redefini le point courant
	 */
	setPoint: function () {
		var point = null;
		var first = null;
		$.each(this._values, function (index, value) {
			if (first == null) first = index;
			if (this._actualWidth >= value) point = index;
		}.bind(this));
		if (point == null) point = first;
		this.actualPoint = point;
	},
	/**
	 * Check the current breakpoint
	 *
	 * @param {String} value        Expected breakpoint(s) (can be multiple : "xs, md")
	 * @return {Boolean}
	 */
	is: function (value) {
		// Split the value, for multiple value
		var values = value.split(',');
		// Compare values with actual point
		for (var i = 0; i < values.length; i++) {
			if (values[i].trim() == this.actualPoint) return true;
		}
		// If nothing found, return false
		return false;
	},
	/**
	 * Returns the points list form the first value to "value"
	 *
	 * @param {String} value        Expected breakpoint
	 * @return {String}				The list, joined by ','
	 */
	to: function (value) {
		var out = [];
		$.each(this._values, function (index, v) {
			out.push(index);
			if (index == value) return false;
		});
		return out.join(', ');
	},
	/**
	 * Returns the points list form "value" to last breakpoint
	 *
	 * @param {String} value        Expected breakpoint
	 * @return {String}				The list, joined by ','
	 */
	from: function (value) {
		var out = [];
		var started = false;
		$.each(this._values, function (index, v) {
			if (index == value) started = true;
			if (started) out.push(index);
		});
		return out.join(', ');
	},
	/**
	 * Return the current breakpoint
	 *
	 * @return {String}
	 */
	current: function () {
		return this.actualPoint;
	},


	/**
	 * Retourne la largeur de la scrollbar
	 *
	 * @return {Integer}
	 */
	getScrollBarWidth: function () {
		this.$htmlBody.css('overflow', 'scroll');
		var w1 = this.$body.outerWidth();
		this.$htmlBody.css('overflow', 'hidden');
		var w2 = this.$body.outerWidth();
		this.$htmlBody.css('overflow', '');
		return (w2 - w1);
	},
	/**
	 * Détecte si le body a une scroll bar
	 *
	 * @return {Boolean}
	 */
	bodyHasScrollbar: function () {
		return this.$body.height() > this.$window.height();
	},
	/**
	 * Retourne la largeur de la fenêtre
	 *
	 * @param {Boolean} asMediaQuery (default : true)
	 * @return {Boolean}
	 */
	getWindowWidth: function (asMediaQuery) {
		if (asMediaQuery == null) asMediaQuery = true;
		return (asMediaQuery && this._dealWithScrollbar && this.bodyHasScrollbar()) ?
		this.$window.width() + this.scrollBarWidth :
			this.$window.width();
	}
};
