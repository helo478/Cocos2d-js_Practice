var res = {
    HelloWorld_png : "res/HelloWorld.png",
    CloseNormal_png : "res/CloseNormal.png",
    CloseSelected_png : "res/CloseSelected.png",
    
    Spaceship_Titan_png : "res/Spaceships/Titan.png",
    Laser_png : "res/Laser.png",
    Asteroid_png : "res/Asteroid.png",
    
    // Sound Effects
    laser_shooting_sfx_wav : "res/laser_shooting_sfx.wav",
    boom4_wav : "res/boom4.wav",
    	
    // Soundtrack
    Soundtrack_ThrustSequence_0_mp3 : "res/Soundtrack/Thrust_Sequence_0.mp3"
};

var g_resources = [];
for (var i in res) {
    g_resources.push(res[i]);
}