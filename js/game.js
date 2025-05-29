var fondo_escenario = 580;

window.addEventListener('load', function() {
    var Q = Quintus({ audioSupported: ['mp3', 'ogg'] })
        .include('Sprites, Scenes, Input, 2D, Anim, Touch, UI, TMX, Audio')
        .setup({
            width: 320,
            height: 480
        })
        .controls().touch().enableSound();// ENABLE KEYBOARD CONTROLS

    loadNugget(Q);
    loadPrincessMabel(Q);
    loadDefaultEnemy(Q);
    loadTangledyarn(Q);
    loadCat(Q);
    loadYarnball(Q);
    loadEndGame(Q);
    loadMainTitle(Q);
    loadHUB(Q);
    loadLevel1(Q);

    Q.loadTMX('level.tmx, mainTitle.png, nugget_small.png, nugget_small.json, tangledyarn.png, tangledyarn.json, cat.png, cat.json, princess.png, yarnball.png, yarnball.json, music_main.mp3, music_main.ogg, music_die.mp3, music_die.ogg, music_level_complete.mp3, music_level_complete.ogg, yarnball.mp3, yarnball.ogg', function() {
        Q.compileSheets('nugget_small.png', 'nugget_small.json');
        Q.compileSheets('tangledyarn.png', 'tangledyarn.json');
        Q.compileSheets('cat.png', 'cat.json');
        Q.compileSheets('yarnball.png', 'yarnball.json');
        Q.stageScene('mainTitle');
    });

    // Ensure arcade key mappings apply when embedded
    if (window.Q && window.parent !== window) {
        window.Q.input.keyboardControls();
    }
});
