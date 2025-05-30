function loadLevel1(Q) {
    /**
     * Scene representing level 1.
     */
    Q.scene('level1', function(stage) {
        // Load the TMX file - this will create all objects defined in Tiled
        Q.stageTMX('level.tmx', stage);

        // Find nugget in the stage to set up camera following
        var nugget = Q('nugget', stage).first();
        
        if(nugget) {
            stage.add('viewport').follow(nugget, {
                x: true,
                y: true
            }, {
                minY: 120,
                maxY: 500
            });
        } else {
            console.error("Nugget not found in stage! Make sure it's defined in your TMX file.");
        }
        
        // Load the HUD
        Q.stageScene('HUB', 1);
        
        // Start the music
        Q.audio.play('music_main.mp3', { loop: true });
    });
}
