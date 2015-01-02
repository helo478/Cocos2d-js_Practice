var HelloWorldLayer = cc.Layer.extend({
    sprite:null,
    ctor:function () {
        //////////////////////////////
        // 1. super init first
        this._super();

        /*
        /////////////////////////////
        // ask the window size
        var size = cc.winSize;
        */
        
        var screen = new ScreenAdapter();
        /*
        var playerPosition = screen.realP(1500, 100);
        var enemyPosition = screen.realP(100, 100);

        // Animate an axe sprite with a long arc
        var axeSprite = new cc.Sprite.create(res.CloseNormal_png);
        axeSprite.setAnchorPoint(0.5, 0.5);
        axeSprite.setPosition(playerPosition);
        this.addChild(axeSprite, 0);
        var axeBezier = [
            screen.realP(1000, 1000), 
            screen.realP(600, 1000),
            enemyPosition];
        
        var axeAction = cc.BezierTo.create(3, axeBezier);
        axeSprite.runAction(axeAction);

        // Animate a sword sprite with a long arc
        var swordSprite = new cc.Sprite.create(res.CloseNormal_png);
        swordSprite.setAnchorPoint(0.5, 0.5);
        swordSprite.setPosition(playerPosition);
        this.addChild(swordSprite, 0);
        var swordBezier = [
                         screen.realP(1000, 600), 
                         screen.realP(600, 600),
                         enemyPosition];

        var swordAction = cc.BezierTo.create(2, swordBezier);
        swordSprite.runAction(swordAction);

        // Animate a knife sprite with no arc
        var knifeSprite = new cc.Sprite.create(res.CloseNormal_png);
        knifeSprite.setAnchorPoint(0.5, 0.5);
        knifeSprite.setPosition(playerPosition);
        this.addChild(knifeSprite, 0);
        var axeAction = cc.MoveTo.create(1, enemyPosition);
        knifeSprite.runAction(axeAction);
        */
        
        // Put a spaceship at the bottom of the screen
        var spaceshipTitan = new cc.Sprite.create(res.Spaceship_Titan_png);
        spaceshipTitan.setAnchorPoint(0.5, 0);
        spaceshipTitan.setPosition(screen.realP(MAX_WIDTH / 2, 0));
        var spaceshipTitanScale = cc.ScaleTo.create(0, 0.5, 0.5);
        spaceshipTitan.runAction(spaceshipTitanScale);
        this.addChild(spaceshipTitan, 0);
        
        // Set up screen touch control of the spaceshipTitan sprite
        if(cc.sys.capabilities.hasOwnProperty('touches')) {
        	cc.eventManager.addListener(cc.EventListener.create({
        		event: cc.EventListener.TOUCH_ONE_BY_ONE,
        		swallowTouches: true,
        		onTouchBegan: function(touch, event) {
        			cc.log(touch.getLocationX(), touch.getLocationY());
        			
        			var origin = spaceshipTitan.getPosition();
        			var target = cc.p(touch.getLocationX(), 0);
        			var distance = screen.abstractDistance(origin, target);
        			
        			cc.log('Distance:', distance);
        			
        			var speed = .0005; // TODO make this dynamic
        			var duration = distance * speed;
        			
        			var spaceshipTitanMove = cc.MoveTo.create(duration, target);
        			spaceshipTitan.stopAllActions();
        			spaceshipTitan.runAction(spaceshipTitanMove);
        			return true;
        		}
        	}), 
        		this
        	);     	
        }
        else {
        	cc.log('The system lacks touch screen capability');
        }

        // Make the spaceship fire a laser blast repeatedly
        this.schedule(this.fireLaser, 0.1);
                
        ////////////////////////////////////////////////////////
        //
        // Make an asteroid approach from the top of the screen
        
        // Create a sprite for an asteroid
        var asteroid = new cc.Sprite.create(res.Asteroid_png);
        asteroid.setAnchorPoint(0.5, 0.5);
        asteroid.setPosition(screen.realP(100, MAX_HEIGHT + 100));
        this.addChild(asteroid);
        
        // Make the asteroid move down the screen
        var moveAsteroid = cc.RepeatForever.create(
        		cc.MoveBy.create(1, screen.realP(0, -100)));
        asteroid.runAction(moveAsteroid);
        //
        ////////////////////////////////////////////////////////
        
        this.schedule(this.spawnAsteroids, 5);
        
        // Add a soundtrack
        cc.audioEngine.playMusic(res.Soundtrack_ThrustSequence_0_mp3, true);
        cc.audioEngine.setMusicVolume(0.1);
        
        return true;
    },
    fireLaser: function(dt) {
    	
    	var screen = new ScreenAdapter();
    	
    	// Create a sprite for a laser blast
    	var laserBlast = new cc.Sprite.create(res.Laser_png);
    	laserBlast.setAnchorPoint(0.5, 0.5);
    	laserBlast.setPosition(screen.realCenter());
    	this.addChild(laserBlast, 0);

    	// Make the laser blast move up the screen
    	var projectLaser = cc.RepeatForever.create(
    			cc.MoveBy.create(1, screen.realP(0, 1000)));
    	laserBlast.runAction(projectLaser);
    },
    spawnAsteroids: function(dt) {
    	
    	var screen = new ScreenAdapter();
    	
    	// Create a sprite for an asteroid
    	var asteroid = new cc.Sprite.create(res.Asteroid_png);
    	asteroid.setAnchorPoint(0.5, 0.5);
    	asteroid.setPosition(screen.realP(100, MAX_HEIGHT + 100));
    	this.addChild(asteroid);

    	// Make the asteroid move down the screen
    	var moveAsteroid = cc.RepeatForever.create(
    			cc.MoveBy.create(1, screen.realP(0, -100)));
    	asteroid.runAction(moveAsteroid);
    }
});

var HelloWorldScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new HelloWorldLayer();
        this.addChild(layer);
    }
});