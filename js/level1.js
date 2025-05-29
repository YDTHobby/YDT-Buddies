// File: /js/level1.js
function loadLevel1(Q) {
    Q.scene('level1', function(stage) {
        Q.stageTMX('level.tmx', stage);

        var nugget = stage.insert(new Q.nugget({ x: 150, y: 460 })); // Center Y for Nugget

        // ... other sprite insertions ...
        var tangledyarn = stage.insert(new Q.tangledyarn({ x: 1660, y: 460 }));
        var cat = stage.insert(new Q.cat({ x: 1190, y: 460 }));
        var princess = stage.insert(new Q.princess({ x: 2000, y: 460 }));
        var yarnball1 = stage.insert(new Q.yarnball({ x: 200, y: 459 }));
        var yarnball2 = stage.insert(new Q.yarnball({ x: 230, y: 459 }));
        var yarnball3 = stage.insert(new Q.yarnball({ x: 260, y: 459 }));


        var tileLayer = stage.findOne("TileLayer") || (stage.lists.TileLayer && stage.lists.TileLayer[0]);

        if (tileLayer) {
            var vp = stage.add('viewport'); // Add viewport first
            vp.follow(nugget, { // Then call follow
                x: true,
                y: true
            }, {
                minX: 0,
                maxX: tileLayer.p.w,
                minY: 0,       // Top of the TMX level
                maxY: tileLayer.p.h  // Bottom of the TMX level (e.g., 612px)
            });

            // Adjust the viewport's Y offset.
            // A negative offsetY makes the camera "look higher" than the player's center,
            // thus positioning the player lower on the actual screen.
            // If Q.height is 480, and player center is 460.
            // Default camera Y center target is 460.
            // If offsetY = -100, camera Y center target becomes 460 - (-100) = 560.
            // This is not what we want.
            // The viewport will try to put (following.p.y - offsetY) at the center of the screen.
            // Center of screen Y = Q.height / 2 = 240.
            // We want `following.p.y` (e.g. 460) to appear at, say, `Q.height * (2/3)` which is `480 * 2/3 = 320`.
            // The viewport sets its `this.y` (top of viewport) to `(following.p.y - offsetY) - Q.height/2`.
            // So, `(460 - offsetY) - 240` is the top of the viewport.
            // If we want player at y=320 on screen, and player.p.y is 460 (world),
            // the amount of world visible above player is 320px.
            // The amount visible below is Q.height - 320 = 160px.
            // The player's world y (460) should correspond to screen y (320).
            // viewport.y (world_top_of_screen) = player_world_y - player_screen_y
            // viewport.y = 460 - 320 = 140.
            // The viewport wants to set its center (this.y + Q.height/2) to (player.p.y - this.offsetY)
            // So, 140 + 240 = 460 - offsetY
            // 380 = 460 - offsetY
            // offsetY = 460 - 380 = 80.

            vp.viewport.offsetY = 80; // Try this. A positive value should make the player appear lower.
                                       // If player is at 460, target is 460 - 80 = 380.
                                       // Viewport top = 380 - 240 = 140.
                                       // Viewport shows world Y from 140 to 140+480=620.
                                       // Player at world 460 will appear at screen 460 - 140 = 320. (Correct!)

        } else {
             stage.add('viewport').follow(nugget, { x: true, y: true },
               { minX: 0, maxX: 2040, minY: 0, maxY: Q.height });
        }

        Q.stageScene('HUB', 1);
    });
}
