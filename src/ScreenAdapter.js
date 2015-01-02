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
	
	/** 
	 * Returns the resolution-independent X-axis pixel address for a given
	 * real X-axis pixel address
	 */
	this.abstractedX = function(x) {
		var returnValue = Math.floor((MAX_WIDTH * x) / screenSize.width);
		return returnValue;
	};
	
	/**
	 * Returns the resolution-independent Y-axis pixel address for a given
	 * real Y-axis pixel address
	 */
	this.abstractedY = function(y) {
		var returnValue = Math.floor((MAX_HEIGHT * y) / screenSize.height);
		return returnValue;
	};
	
	// Returns the integer rounded distance between two sets of x, y coordinates
	function getDistance(p1, p2) {
		cc.log(p1.x, p2.x);
		
		var xDiff = p1.x - p2.x;
		var yDiff = p1.y - p2.y;
		
		cc.log(xDiff * xDiff, yDiff * yDiff);
		
		return Math.round(Math.sqrt((xDiff * xDiff) + (yDiff * yDiff)));
	}
	
	/** 
	 * Returns the distance, in resolution-independent units between two
	 * given sets of real-pixel x, y coordinate pairs
	 */
	this.abstractDistance = function(rP1, rP2) {
		
		// convert each cc.p into the abstracted (x, y) coordinate
		var iP1 = {
			x: this.abstractedX(rP1.x),
			y: this.abstractedY(rP1.y)
		};
		var iP2 = {
			x: this.abstractedX(rP2.x),
			y: this.abstractedY(rP2.y)
		};
		
		// return the distance between x's
		return getDistance(iP1, iP2);
	};
}