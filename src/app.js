const PLAYER_SPACESHIP_TAG = 0;

var HelloWorldLayer = cc.Layer.extend({
    sprite:null,
    ctor:function () {

        // Call the super-constructor
        this._super();

        // Get a screen adapter object
        var screen = new ScreenAdapter();

        // Create a titan spaceship sprite and position it at the bottom center 
        // of the screen
        var spaceshipTitan = new cc.Sprite.create(res.Spaceship_Titan_png);
        spaceshipTitan.setTag(PLAYER_SPACESHIP_TAG);
        spaceshipTitan.setAnchorPoint(0.5, 0);
        spaceshipTitan.setPosition(screen.realP(MAX_WIDTH / 2, 0));
        var spaceshipTitanScale = cc.ScaleTo.create(0, 0.25, 0.25);
        spaceshipTitan.runAction(spaceshipTitanScale);
        this.addChild(spaceshipTitan, 0);
        
        // Set up screen-touch controls
        if(cc.sys.capabilities.hasOwnProperty('touches')) {
        	cc.log('The system has touch screen capability. '
        			+ 'Setting up screen touch handling. ');
        	
        	cc.eventManager.addListener(cc.EventListener.create({
        		event: cc.EventListener.TOUCH_ONE_BY_ONE,
        		swallowTouches: true,
        		onTouchBegan: function(touch, event) {
        			
        			// Calculate the abstract distance between input point
        			// and the spaceship's current location
        			var origin = spaceshipTitan.getPosition();
        			var target = cc.p(touch.getLocationX(), 0);
        			var distance = screen.abstractDistance(origin, target);
        			
        			// Calculate the duration of the new moveTo action,
        			// such that the speed of the spaceship is constant
        			var speed = .0005; // TODO make this dynamic
        			var duration = distance * speed;
        			
        			// Replace any current action with the new move action
        			// TODO make this operation atomic
        			var spaceshipTitanMove = cc.MoveTo.create(duration, target);
        			spaceshipTitan.stopAllActions();
        			spaceshipTitan.runAction(spaceshipTitanMove);
        			
        			return true;
        		}
        	}), 
        		this
        	);     	
        }
        // Set up mouse click controls
        else if(cc.sys.capabilities.hasOwnProperty('mouse')) {
        	cc.log('The system lacks touch screen capability. '
        			+ 'Setting up mouse click handling. ');
        	
        	cc.eventManager.addListener(cc.EventListener.create({
        		event: cc.EventListener.MOUSE,
        		onMouseDown: function(event) {
        			if(event.getButton() == cc.EventMouse.BUTTON_LEFT) {
        				
        				// Calculate the abstract distance between input point
        				// and the spaceship's current location
        				var origin = spaceshipTitan.getPosition();
        				var target = cc.p(event.getLocationX(), 0);
        				var distance = screen.abstractDistance(origin, target);

        				// Calculate the duration of the new moveTo action,
        				// such that the speed of the spaceship is constant
        				var speed = .0005; // TODO make this dynamic
        				var duration = distance * speed;

        				// Replace any current action with the new move action
        				// TODO make this operation atomic
        				var spaceshipTitanMove = cc.MoveTo.create(duration, target);
        				spaceshipTitan.stopAllActions();
        				spaceshipTitan.runAction(spaceshipTitanMove);
        			}
        		}
        		
        	}), 
        		this
        	);
        }

        // Make the spaceship fire a laser blast repeatedly
        this.schedule(this.fireLaser, 0.3);
                
        // Make asteroids spawn repeatedly
        this.schedule(this.spawnAsteroids, 5);
        
        // Add a soundtrack
        cc.audioEngine.playMusic(res.Soundtrack_ThrustSequence_0_mp3, true);
        cc.audioEngine.setMusicVolume(0.1); // For now, the volume is low
        
        return true;
    },
    fireLaser: function(dt) {
    	
    	var screen = new ScreenAdapter();
    	
    	// Get a reference to the player spaceship, die if error
    	var spaceship = this.getChildByTag(PLAYER_SPACESHIP_TAG);
    	if(!spaceship) {
    		throw new RuntimeException('Null reference to the player spaceship ' 
    				+ 'in fireLaser callback');
    	}
    	
    	// Create a sprite for a laser blast
    	var laserBlast = new cc.Sprite.create(res.Laser_png);
    	laserBlast.setAnchorPoint(0.5, 0.5);
    	laserBlast.setPosition(cc.p(spaceship.getPosition().x, screen.realY(200)));
    	this.addChild(laserBlast, 0);

    	// Make the laser blast move up the screen forever
    	var projectLaser = cc.RepeatForever.create(
    			cc.MoveBy.create(1, screen.realP(0, 1000)));
    	laserBlast.runAction(projectLaser);
    },
    spawnAsteroids: function(dt) {
    	
	    var screen = new ScreenAdapter();
	    	
	    // If an asteroid randomly spawns
	    if(Math.random() >= 0.5) {
	    	
	    	// Create a sprite for an asteroid
	    	// Randomize X coordinate
	    	var asteroid = new cc.Sprite.create(res.Asteroid_png);
	    	asteroid.setAnchorPoint(0.5, 0.5);
	    	asteroid.setPosition(screen.realP(Math.random() * MAX_WIDTH, MAX_HEIGHT + 100));
	    	this.addChild(asteroid);
	
	    	// Make the asteroid move down the screen
	    	var moveAsteroid = cc.RepeatForever.create(
	    			cc.MoveBy.create(1, screen.realP(0, -100)));
	    	asteroid.runAction(moveAsteroid);
	    }
    }
});

var HelloWorldScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new HelloWorldLayer();
        this.addChild(layer);
    }
});