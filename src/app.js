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
        this.schedule(this.spawnAsteroids, 1);
        
        // Add a soundtrack
        cc.audioEngine.playMusic(res.Soundtrack_ThrustSequence_0_mp3, true);
        cc.audioEngine.setMusicVolume(0.1); // For now, the volume is low
        
        // Limit the volume of sound effects
        cc.audioEngine.setEffectsVolume(0.1);
        
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
    	laserBlast.setName("laserBlast");
    	this.addChild(laserBlast, 0);

    	// Make the laser blast move up the screen forever
    	var projectLaser = cc.RepeatForever.create(
    			cc.MoveBy.create(1, screen.realP(0, 1000)));
    	laserBlast.runAction(projectLaser);
    	laserBlast.schedule(function() {
				handleLaser(this);
		});
    	
    	cc.audioEngine.playEffect(res.laser_shooting_sfx_wav, false);
    },
    spawnAsteroids: function(dt) {
    	
	    var screen = new ScreenAdapter();
	    	
	    // If an asteroid randomly spawns
	    if(Math.random() >= 0.2) {
	    	
	    	// Create a sprite for an asteroid
	    	// Randomize X coordinate
	    	var asteroid = new cc.Sprite.create(res.Asteroid_png);
	    	asteroid.setAnchorPoint(0.5, 0.5);
	    	asteroid.setPosition(screen.realP(Math.random() * MAX_WIDTH, MAX_HEIGHT + 100));
	    	asteroid.setName("FooAsteroid");
	    	this.addChild(asteroid);
	
	    	// Make the asteroid move down the screen
	    	var moveAsteroid = cc.RepeatForever.create(
	    			cc.MoveBy.create(1, screen.realP(0, -100)));
	    	asteroid.runAction(moveAsteroid);
	    	asteroid.schedule(function() {
	    		handleAsteroid(this);
	    	})
	    }
    }
});

function handleLaser(sprite) {
	// Remove sprite if out of view port; 
	if (sprite.getPositionY() > cc.winSize.height)
	{
		sprite.removeFromParent(true);
		return;
	}
}

function handleAsteroid(sprite)
{
	// Remove sprite if out of view port; 
	if (sprite.getPositionY() < 0)
	{
		cc.log('Remove Astroiod');
		sprite.removeFromParent(true);
		return;
	}
	
	// Check for collisions with laser blasts
	var layer = sprite.getParent();
	var allChildren = layer.getChildren();
	for(var i = 0; i< allChildren.length; i++) {
		if (allChildren[i].getName() == "laserBlast"){
			
			var a = allChildren[i].getBoundingBox();
			var b = sprite.getBoundingBox();

			// If there is a collision, handle it
			if(cc.rectIntersectsRect(a, b)){
				sprite.removeFromParent(true);
				cc.audioEngine.playEffect(res.boom4_wav, false);
				return;
			}
		}
	}
}

var HelloWorldScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new HelloWorldLayer();
        this.addChild(layer);
    }
});