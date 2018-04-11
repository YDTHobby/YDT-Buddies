window.addEventListener('load', function() {
    // Set up an instance of the Quintus engine and include
    // the Sprites, Scenes, Input and 2D module. The 2D module
    // includes the `TileLayer` class as well as the `2d` componet.
    var Q = Quintus()
        .include('Sprites, Scenes, Input, 2D, Anim, Touch, UI, TMX')
        // Maximize this game to whatever the size of the browser is
        .setup({
            width: 320,
            height: 480
        })
        // And turn on default input controls and touch input (for UI)
        .controls().touch();

    Q.scene('level1', function(stage) {
        Q.stageTMX('level.tmx', stage);
        stage.add("viewport");
        stage.viewport.offsetX = 150;
        stage.viewport.offsetY = 380;
    });
    Q.loadTMX('level.tmx', function() {
        Q.stageScene('level1');
    });
});