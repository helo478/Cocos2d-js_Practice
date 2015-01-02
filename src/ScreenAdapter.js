/**
 * The maximum value of screen height in resolution-independent units
 */
const MAX_HEIGHT = 900;

/**
 * The maximum value of screen width in resolution-independent units
 */
const MAX_WIDTH = 1600;

/**
 * An abstraction of the real underlying screen size.
 * 
 */
function ScreenAdapter() {
	var screenSize = cc.winSize;

	/**
	 * Returns the maximum screen width in terms of real pixels on the
	 * underlying screen resolution
	 */
	this.realWidth = function() {
		return screenSize.width;
	};

	/**
	 * Returns the maximum screen height in terms of real pixels on the 
	 * underlying screen resolution
	 */
	this.realHeight = function() {
		return screenSize.height;
	};

	/**
	 * Returns the real X-axis pixel address for a given value in
	 * resolution-independent units.
	 * 
	 * @param i, a given X-axis value in resolution-independent units
	 */
	this.realX = function(i) {
		var returnValue =  Math.floor(screenSize.width / MAX_WIDTH * i);
		return returnValue;
	};

	/**
	 * Returns the real Y-axis pixel address for a given value in 
	 * resolution-independent units.
	 * 
	 * @param i, a given Y-axis value in resolution-independent units
	 */
	this.realY = function(i) {
		var returnValue = Math.floor(screenSize.height / MAX_HEIGHT * i);
		return returnValue;
	};

	/**
	 * Returns a cc.p object representing the real pixel address
	 * for a given pair of resolution-independent x, y coordinate units
	 * 
	 * @param x, a given X-axis value in resolution-independent units
	 * @param y, a given Y-axis value in resolution-independent units
	 */
	this.realP = function(x, y) {
		return cc.p(this.realX(x), this.realY(y));
	};

	/**
	 * Returns a cc.p object representing the real pixel address
	 * of the center of the screen
	 */
	this.realCenter = function() {
		return cc.p(screenSize.width / 2, screenSize.height / 2);
	}
}