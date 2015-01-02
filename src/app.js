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
        /////////////////////////////
        // manipulate sprites on the screen
        var sprite1 = new cc.Sprite.create(res.CloseNormal_png);
        sprite1.setAnchorPoint(cc.p(0.5, 0.5));
        sprite1.setPosition(screen.realCenter());
        this.addChild(sprite1, 0);
        
        var sprite2 = new cc.Sprite.create(res.CloseNormal_png);
        sprite2.setAnchorPoint(cc.p(0.5, 0.5));
        sprite2.setPosition(screen.realCenter());
        this.addChild(sprite2, 0);
        
        var sprite3 = new cc.Sprite.create(res.CloseNormal_png);
        sprite3.setAnchorPoint(cc.p(0.5, 0.5));
        sprite3.setPosition(screen.realCenter());
        this.addChild(sprite3, 0);
        
        var sprite4 = new cc.Sprite.create(res.CloseNormal_png);
        sprite4.setAnchorPoint(cc.p(0.5, 0.5));
        sprite4.setPosition(screen.realCenter());
        this.addChild(sprite4, 0);

        var sprite5 = new cc.Sprite.create(res.CloseNormal_png);
        sprite5.setAnchorPoint(cc.p(0.5, 0.5));
        sprite5.setPosition(screen.realCenter());
        this.addChild(sprite5, 0);
        
        // The first argument is the duration in seconds
        // The second argument is the target position relative to canvas
        var sprite_action1 = cc.MoveTo.create(2, screen.realP(0, 0));
        sprite1.runAction(sprite_action1);
        
        var sprite_action2 = cc.MoveBy.create(2, screen.realP(MAX_WIDTH / 2, 0 - MAX_HEIGHT / 2));
        sprite2.runAction(sprite_action2);
        
        // Third argument is the height of each jump
        // Fourth argument is how many jumps it takes to get there
        var sprite_action3 = cc.JumpTo.create(2, screen.realP(0, MAX_HEIGHT - 1), 50, 4);
        sprite3.runAction(sprite_action3);
        
        var sprite_action4 = cc.JumpBy.create(2, screen.realP(MAX_WIDTH / 2, MAX_HEIGHT / 2), 80, 6)
        sprite4.runAction(sprite_action4);
        
        var bezier1 = [screen.realP(0, MAX_HEIGHT / 2), screen.realP(100, -MAX_HEIGHT), screen.realP(100, 100)];
        var sprite_action5 = cc.BezierTo.create(3, bezier1);
        sprite5.runAction(sprite_action5);
        */
        
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
        
        // Put a spaceship at the bottom of the screen
        var spaceshipTitan = new cc.Sprite.create(res.Spaceship_Titan_png);
        spaceshipTitan.setAnchorPoint(0.5, 0);
        spaceshipTitan.setPosition(screen.realP(MAX_WIDTH / 2, 0));
        var spaceshipTitanScale = cc.ScaleTo.create(0, 0.5, 0.5);
        spaceshipTitan.runAction(spaceshipTitanScale);
        this.addChild(spaceshipTitan, 0);
        
        // Set up single touch response
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
        
        return true;
    }
});

var HelloWorldScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new HelloWorldLayer();
        this.addChild(layer);
    }
});