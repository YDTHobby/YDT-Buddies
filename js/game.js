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


/* -------------- MARIO ---------------------------- */
    Q.Sprite.extend("Mario", {
        init: function(p) {
            this._super(p, {
                sheet: 'marioR',
                x: 150,
                y: 380
            });
            this.add('2d, platformerControls');
            this.on("die", this);
            this.on("win", this);
        },

        step: function(dt) {
            if (this.p.y > 580) { // Si Mario cae por debajo del escenario, vuelve al principio 
                this.die();
            }
        },

        die: function() {
            Q.stageScene("endGame",1, { label: "Game Over" });
            this.destroy();
        },

        win: function() {
            Q.stageScene("endGame",1, { label: "You Win" });
            this.destroy();
        }

    });


/* -------------- ENEMIES ---------------------------- */
    Q.Sprite.extend("Goomba", {
        init: function(p) {
            this._super(p, {
                sheet: 'goomba',
                x: 1660,
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
                    collision.obj.die();
                }
            });
        },

        step: function(dt) {
            if (this.p.y > 580) { // Si el goomba cae por debajo del escenario, muere
                this.destroy();
            }
        }
    });

    Q.Sprite.extend("Bloopa", {
        init: function(p) {
            this._super(p, {
                sheet: 'bloopa',
                x: 1190,
                y: 500
            });
            this.add('2d');

            this.on("bump.top", function(collision) { // Si Mario le pisa, muere
                if (collision.obj.isA("Mario")) {
                    this.destroy();
                    collision.obj.p.vy = -300;
                }
            });

            this.on("bump.left,bump.right,bump.bottom", function(collision) { // Si toca a Mario desde cualquier otro lado, lo mata
                if (collision.obj.isA("Mario")) {
                    collision.obj.die();
                }
                else{
                    this.p.vy = -120;
                    this.p.gravityY = 120;
                }
            });
        },

        step: function(dt) {
            if (this.p.y > 580) { // Si el goomba cae por debajo del escenario, muere
                this.destroy();
            }
        }
    });



/* -------------- PRINCESS ---------------------------- */

    Q.Sprite.extend("Princess", {
        init: function(p) {
            this._super(p, {
                asset: 'princess.png',
                x: 2000,
                y: 400,
                vy: 300
            });
            this.add('2d');


            this.on("bump.left, bump.right, bump.top, bump.bottom", function(collision) { // Si toca a Mario desde cualquier otro lado, lo mata
                if (collision.obj.isA("Mario")) {
                    collision.obj.win();
                }
            });
        }

    });

    Q.scene('level1', function(stage) {
        Q.stageTMX('level.tmx', stage);
        var mario = stage.insert(new Q.Mario());
        var goomba = stage.insert(new Q.Goomba());
        var bloopa = stage.insert(new Q.Bloopa());
        var princess = stage.insert(new Q.Princess());

        stage.add("viewport").follow(mario, {
            x: true,
            y: true
        }, {
            minY: 120,
            maxY: 500
        });

    });

    Q.scene('endGame',function(stage) {
      var container = stage.insert(new Q.UI.Container({
        x: Q.width/2, y: Q.height/2, fill: "rgba(0,0,0,0.5)"
      }));

      var button = container.insert(new Q.UI.Button({ x: 10, y: 10, fill: "#CCCCCC",
                                                      label: "Play Again" }))         
      var label = container.insert(new Q.UI.Text({x:10, y: -10 - button.p.h, 
                                                       label: stage.options.label }));

      button.on("click",function() {
        Q.clearStages();
        Q.stageScene('level1');
      });

      container.fit(20);
    });


    Q.loadTMX('level.tmx, mario_small.png, mario_small.json, goomba.png, goomba.json, bloopa.png, bloopa.json, princess.png', function() {
        Q.compileSheets('mario_small.png', 'mario_small.json');
        Q.compileSheets('goomba.png', 'goomba.json');
        Q.compileSheets('bloopa.png', 'bloopa.json');
        Q.stageScene('level1');
    });
});