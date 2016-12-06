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
 * @see https://github.com/EdouardDem/djs-breakpoints
 * @requires djs.resize <https://github.com/EdouardDem/djs-ui-tools>
 * @requires djs.resize <https://github.com/EdouardDem/djs-resize>
 */
djs.breakpoints = {

	/**
	 * Used to store breakpoints values
	 * Default values, should be overridden
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
	 * Store the actual breakpoint
	 *
	 * @private
	 * @var {String}
	 */
	_actualPoint: null,
	/**
	 * Namespace used to bind events
	 *
	 * @private
	 * @var {String}
	 */
	_namespace: 'djs-breakpoints',
	/**
	 * Store the callbacks
	 *
	 * @private
	 * @var {Object}
	 */
	_callbacks: {},
	/**
	 * Default tag to store callbacks
	 *
	 * @private
	 * @var {String}
	 */
	_defaultTag: '__',

	/**
	 * Initialize the object
	 *
	 * @param {Object} points (optional)
	 * @return {Object}
	 */
	init: function (points) {

		// Set breakpoints
		if (points != null) {
			this._values = points;
		}

		// Define actual dimensions
		this._actualWidth = djs.tools.ui.getWindowWidth();

		// Refresh current point
		this._setPoint();

		// Bind events
		this._bind();

		return this;
	},
	/**
	 * Destroy the object
	 *
	 * @return {Object}
	 */
	destroy: function () {

		// Unbind events
		this._unbind();

		return this;
	},

	/**
	 * Bind the window resize event with djs.resize
	 * @see https://github.com/EdouardDem/djs-resize
	 *
	 * @private
	 * @return {Object}
	 */
	_bind: function () {

		// Use djs.resize
		// Add self callback to the first stack (core)
		djs.resize.bind(this._namespace, this._run.bind(this), djs.resize.stacks.core);

		return this;
	},
	/**
	 * Unbind from the window resize event
	 * @see https://github.com/EdouardDem/djs-resize
	 *
	 * @private
	 * @return {Object}
	 */
	_unbind: function () {

		// Use djs.resize
		djs.resize.unbind(this._namespace, djs.resize.stacks.core);

		return this;
	},
	/**
	 * Runs callbacks after a breakpoints has been passed through.
	 * Only if callbacks refers to this breakpoint in this sens.
	 *
	 * @private
	 * @return {Object}
	 */
	_run: function () {

		// Get actual window width
		var w = djs.tools.ui.getWindowWidth();

		// Define the sens regarding to the last calculation
		var sens = w < this._actualWidth ? 'down' : 'up';

		// Push and order points that have been passed through
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

		// Store the actual width
		this._actualWidth = w;

		// Define current breakpoint
		this._setPoint();

		// Run callbacks for catched breakpoints (if any)
		for (var i = 0; i < points.length; i++) {

			// Point name
			var point = points[i];

			//	Debug
			if (this._debug) console.log('[djs.breakpoints] ' + point + '-' + sens);

			// Check if a callback is defined
			if (!this._callbacks[point]) continue;
			if (!this._callbacks[point][sens]) continue;

			// If any, runs every callbacks in every tags
			$.each(this._callbacks[point][sens], function (index, value) {
				for (var j = 0; j < value.length; j++) {
					value[j]();
				}
			});
		}

		return this;
	},
	/**
	 * Add a callback to a breakpoint for a sens
	 *
	 * @param {String} value		The breakpoint to detect
	 * @param {String} sens         The sens to detect ('up' or 'down')
	 * @param {Object} callback		The callback
	 * @param {String} tag			Optional. A tag to store the function in a special group
	 * @return {Object}
	 */
	add: function (value, sens, callback, tag) {

		// If no tag is defined, used default tag
		if (tag == null) tag = this._defaultTag;

		// Create path to store callback
		if (!this._callbacks[value]) this._callbacks[value] = {};
		if (!this._callbacks[value][sens]) this._callbacks[value][sens] = {};
		if (!this._callbacks[value][sens][tag]) this._callbacks[value][sens][tag] = [];

		// Push the callback
		this._callbacks[value][sens][tag].push(callback);

		return this;
	},
	/**
	 * Alias for add(point, 'up', callback, tag)
	 *
	 * @param {String} value		The breakpoint to detect
	 * @param {Object} callback		The callback
	 * @param {String} tag			Optional. A tag to store the function in a special group
	 * @return {Object}
	 */
	up: function (value, callback, tag) {
		return this.add(value, 'up', callback, tag);
	},
	/**
	 * Alias for add(point, 'down', callback, tag)
	 *
	 * @param {String} value		The breakpoint to detect
	 * @param {Object} callback		The callback
	 * @param {String} tag			Optional. A tag to store the function in a special group
	 * @return {Object}
	 */
	down: function (value, callback, tag) {
		return this.add(value, 'down', callback, tag);
	},
	/**
	 * Remove a callback from a breakpoint and a sens
	 *
	 * @param {String} value		The breakpoint to detect
	 * @param {String} sens         The sens to detect ('up' or 'down')
	 * @param {String} tag			Optional. A tag, if the function in a special group
	 * @return {Object}
	 */
	remove: function (value, sens, tag) {

		// If no tag is defined, used default tag
		if (tag == null) tag = this._defaultTag;

		// Checks if path to storage exists
		if (!this._callbacks[value]) return;
		if (!this._callbacks[value][sens]) return;
		if (!this._callbacks[value][sens][tag]) return;

		// Delete the callback
		delete this._callbacks[value][sens][tag];

		return this;
	},
	/**
	 * Define current breakpoint
	 *
	 * @private
	 * @return {Object}
	 */
	_setPoint: function () {

		// Vars
		var point = null;
		var first = null;

		// Parse all points and store the last smaller than window width
		$.each(this._values, function (index, value) {
			if (first == null) first = index;
			if (this._actualWidth >= value) point = index;
		}.bind(this));

		// Fallback if nothing found
		if (point == null) point = first;

		// Store breakpoint
		this._actualPoint = point;

		return this;
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
			if (values[i].trim() == this._actualPoint) return true;
		}

		// If nothing found, return false
		return false;
	},
	/**
	 * Check if the current breakpoint is this value or less
	 *
	 * @param {String} value        Expected breakpoint
	 * @return {Boolean}
	 */
	max: function (value) {

		// Get the values under and test
		return this.is(this.to(value));
	},
	/**
	 * Check if the current breakpoint is this value or more
	 *
	 * @param {String} value        Expected breakpoint
	 * @return {Boolean}
	 */
	min: function (value) {

		// Get the values over and test
		return this.is(this.from(value));
	},
	/**
	 * Returns the points list form the first value to "value"
	 *
	 * @param {String} value        Expected breakpoint
	 * @return {String}				The list, joined by ','
	 */
	to: function (value) {

		// Enqueue points to value
		var out = [];
		$.each(this._values, function (index, v) {
			out.push(index);
			if (index == value) return false;
		});

		// Return points names joined with ','
		return out.join(', ');
	},
	/**
	 * Returns the points list form "value" to last breakpoint
	 *
	 * @param {String} value        Expected breakpoint
	 * @return {String}				The list, joined by ','
	 */
	from: function (value) {

		// Enqueue points starting at value
		var out = [];
		var started = false;
		$.each(this._values, function (index, v) {
			if (index == value) started = true;
			if (started) out.push(index);
		});

		// Return points names joined with ','
		return out.join(', ');
	},
	/**
	 * Return the current breakpoint
	 *
	 * @return {String}
	 */
	current: function () {
		return this._actualPoint;
	}
};
