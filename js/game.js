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

    Q.Sprite.extend("Mario", {
        init: function(p) {
            this._super(p, {
                sheet: 'marioR',
                x: 150,
                y: 380
            });
            this.add('2d, platformerControls');
        },

        step: function(dt) {
            if (this.p.y > 580) { // Si Mario cae por debajo del escenario, vuelve al principio 
                this.p.x = 150;
                this.p.y = 380;
            }
        }

    });

    Q.Sprite.extend("Goomba", { // WIP colocarlo en un lugar apropiado del escenario
        init: function(p) {
            this._super(p, {
                sheet: 'goomba',
                x: 150,
                y: 500,
                vx: 100
            });
            this.add('2d, aiBounce');

            this.on("bump.top", function(collision) { // Si Mario le pisa, muere
                if (collision.obj.isA("Mario")) {
                    this.destroy();
                    collision.obj.p.vy = -300;
                }
            });

            this.on("bump.left,bump.right,bump.bottom", function(collision) { // Si toca a Mario desde cualquier otro lado, lo mata
                if (collision.obj.isA("Mario")) {
                    collision.obj.destroy();
                }
            });
        },

        step: function(dt) {
            if (this.p.y > 580) { // Si el goomba cae por debajo del escenario, muere
                this.destroy();
            }
        }
    });

    Q.scene('level1', function(stage) {
        Q.stageTMX('level.tmx', stage);
        var mario = stage.insert(new Q.Mario());
        var goomba = stage.insert(new Q.Goomba());

        stage.add("viewport").follow(mario, { x: true, y: true }, { minX: -100, maxX: 256 * 16, minY: 125, maxY: 32 * 16 });
    });


    Q.loadTMX('level.tmx, mario_small.png, mario_small.json, goomba.png, goomba.json', function() {
        Q.compileSheets('mario_small.png', 'mario_small.json');
        Q.compileSheets('goomba.png', 'goomba.json');
        Q.stageScene('level1');
    });
});