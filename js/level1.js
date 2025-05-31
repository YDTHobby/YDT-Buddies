function loadLevel1(Q) {
    /**
     * Scene representing level 1.
     */
    Q.scene('level1', function(stage) {
        // Store reference to nugget for camera following
        var nugget = null;
        
        // Override the stage's insert method to capture nugget when it's created
        var originalInsert = stage.insert;
        stage.insert = function(obj) {
            var result = originalInsert.call(this, obj);
            
            // Check if this is our nugget
            if(obj.className === 'nugget' || (obj.p && obj.p.Class === 'nugget')) {
                nugget = obj;
                console.log("Nugget found and stored!");
            }
            
            return result;
        };
        
        // Load the TMX file - this will create all objects defined in Tiled
        Q.stageTMX('level.tmx', stage);
        
        // Restore original insert method
        stage.insert = originalInsert;
        
        // Set up camera to follow nugget if found
        if(nugget) {
            stage.add('viewport').follow(nugget, {
                x: true,
                y: true
            }, {
                minY: 120,
                maxY: 500
            });
            console.log("Camera following nugget");
        } else {
            console.error("Nugget not found! Creating one at default position.");
            // Fallback: create nugget manually if not in TMX
            nugget = stage.insert(new Q.nugget({ x: 150, y: 380 }));
            stage.add('viewport').follow(nugget, {
                x: true,
                y: true
            }, {
                minY: 120,
                maxY: 500
            });
        }
        
        // Load the HUD
        Q.stageScene('HUB', 1);
        
        // Start the music
        Q.audio.stop(); // Stop all current sounds
        Q.audio.play('music_main.mp3', { loop: true });
    });
}
