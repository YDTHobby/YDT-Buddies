/**
 * Indicates the background of the stage.
 * @type {Number}
 */
var fondo_escenario = 580;
window.addEventListener('load', function() {
    /**
     * Main variable of the Quintus.
     */
    var Q = Quintus({ audioSupported: ['mp3', 'ogg'] })
        /**
         * The modules required for the application to function are added.
         * the application.
         */
        .include('Sprites, Scenes, Input, 2D, Anim, Touch, UI, TMX, Audio')
        /**
         * The window is adjusted.
         */
        .setup("gameFrame", {
            width: 320,
            height: 480
        })
        /**
         * Functionality is added.
         */
        .controls().touch().enableSound();
    
    /**
     * We load the various components that we will use during the game.
     */
    loadNugget(Q);
    loadPrincessMabel(Q);
    loadDefaultEnemy(Q);
    loadTangledyarn(Q);
    loadCat(Q);
    loadYarnball(Q);
    loadEndGame(Q);
    loadMainTitle(Q);
    loadHUB(Q);
    loadWorldMap(Q);
    loadLevel1(Q);
    
    /**
     * Load saved progress from localStorage
     */
    if (typeof(Storage) !== "undefined") {
        var savedProgress = localStorage.getItem('ydtProgress');
        if (savedProgress) {
            Q.state.set('progress', JSON.parse(savedProgress));
        } else {
            // Set default progress if no save exists
            Q.state.set('progress', {
                unlockedLevels: 1,
                completedLevels: []
            });
        }
    } else {
        // No localStorage support, use default
        Q.state.set('progress', {
            unlockedLevels: 1,
            completedLevels: []
        });
    }
    
    /**
     * We load the files we need for the game.
     */
    Q.loadTMX('level.tmx, mainTitle.png, nugget_small.png, nugget_small.json, tangledyarn.png, tangledyarn.json, cat.png, cat.json, princess.png, yarnball.png, yarnball.json, music_main.mp3, music_main.ogg, music_die.mp3, music_die.ogg, music_level_complete.mp3, music_level_complete.ogg, yarnball.mp3, yarnball.ogg', function() {
        Q.compileSheets('nugget_small.png', 'nugget_small.json');
        Q.compileSheets('tangledyarn.png', 'tangledyarn.json');
        Q.compileSheets('cat.png', 'cat.json');
        Q.compileSheets('yarnball.png', 'yarnball.json');
        Q.stageScene('mainTitle');
    });
});
