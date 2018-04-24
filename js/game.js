window.addEventListener('load', function() {
    var fin_escenario = 580;
    /**
     * Variable principal del Quintus.
     */
    var Q = Quintus()
        /**
         * Se añaden los módulos necesarios para el funcionamiento de
         * la aplicación.
         */
        .include('Sprites, Scenes, Input, 2D, Anim, Touch, UI, TMX')
        /**
         * Se ajusta la ventana.
         */
        .setup({
            width: 320,
            height: 480
        })
        /**
         * Se le añade funcionalidad.
         */
        .controls().touch();

    /*--------------------------------------------MARIO BROS------------------------------------------*/
    Q.animations('mario animation', {
        'run_right': { frames: [1, 2, 3], rate: 1 / 7 },
        'run_left': { frames: [15, 16, 17], rate: 1 / 7 },
        'stand_right': { frames: [0] },
        'stand_left': { frames: [14] },
        'jumping_right': { frames: [4] },
        'jumping_left': { frames: [18] },
        'die': { frames: [12] }
    });
    /**
     * Clase que representa a Mario Bros.
     */
    Q.Sprite.extend('Mario', {
        /** 
         * Inicialización de la clase.
         */
        init: function(p) {
            this._super(p, {
                sprite: 'mario animation',
                /**
                 * Sprite de Mario.
                 */
                sheet: 'mario',
                /**
                 * Posición inicial de Mario.
                 */
                x: 150,
                y: 380,
                direction: 'right',
                /**
                 * Parámetros de velocidad de Mario.
                 */
                jumpSpeed: -400,
                speed: 200,
                vy: 10,

                die: false
            });
            /**
             * Los módulos Quintus necesarios.
             */
            this.add('2d, platformerControls, animation');
            /**
             * Definición de las funciones adicionales.
             */
            this.on('die');
            this.on('win');
        },
        /**
         * Mario muere.
         */
        die: function() {
            this.p.die = true;
            this.p.vy = -500;

            setTimeout(function() {
                Q('Mario').destroy();
                /**
                 * Se carga la pantalla de Game Over.
                 */
                Q.stageScene('endGame', 1, { label: 'Game Over' });
            }, 1000);
        },
        /**
         * Mario gana.
         */
        win: function() {
            Q.stageScene('endGame', 1, { label: 'You Win' });
            this.destroy();
        },
        /**
         * Ejecuta un paso de Mario.
         */
        step: function(dt) {
            if (this.p.die) {
                this.play('die');
            } else {
                if (this.p.vy != 0) {
                    this.play('jumping_' + this.p.direction)
                } else if (this.p.vx > 0) {
                    this.play('run_right');
                } else if (this.p.vx < 0) {
                    this.play('run_left');
                } else {
                    this.play('stand_' + this.p.direction);
                }
                /*
                 * En caso de caerse del escenario, Mario muere.
                 */
                if (this.p.y > fin_escenario) {
                    this.trigger('die');
                }
            }
        }
    });

    /*--------------------------------------------GOOMBA------------------------------------------*/
    Q.animations("goomba anim", {
        "live": { frames: [0, 1], rate: 1 / 5 },
        "die": { frames: [2] }
    });
    /**
     * Clase que representa al enemigo Goomba.
     */
    Q.Sprite.extend('Goomba', {
        init: function(p) {
            this._super(p, {
                sprite: 'goomba animation',
                /**
                 * Sprite del Goomba.
                 */
                sheet: 'goomba',
                /**
                 * Posición inicial del Goomba.
                 */
                x: 1660,
                y: 500,
                /**
                 * Parámetros de velocidad del Goomba.
                 */
                speed: 170,
                vx: 100
            });
            /**
             * Los módulos Quintus necesarios.
             */
            this.add('2d, aiBounce');
            /**
             * Definición de las funciones adicionales.
             */
            this.on('bump.top', 'top');
            this.on('bump.left, bump.right, bump.bottom', 'collision');
            this.on('die');

            this.play('live');
        },
        /**
         * Muere el Goomba.
         */
        die: function() {
            this.destroy();
        },
        /**
         * En caso de que Mario salte encima de él, el Goomba muere.
         */
        top: function(collision) {
            if (collision.obj.isA('Mario')) {
                this.trigger('die');
                collision.obj.p.vy = -300;
            }
        },
        /**
         * En caso de que Mario choque contra él, Mario muere.
         */
        collision: function(collision) {
            if (collision.obj.isA('Mario')) {
                collision.obj.trigger('die');
            }
        },
        /**
         * Ejecuta un paso de Goomba.
         */
        step: function(dt) {
            /**
             * En caso de caerse del escenario, Goomba muere.
             */
            if (this.p.y > fin_escenario) {
                this.trigger('die');
            }
        }
    });

    /*--------------------------------------------BLOOPA------------------------------------------*/
    /**
     * Clase que representa al enemigo Bloopa.
     */
    Q.Sprite.extend('Bloopa', {
        init: function(p) {
            this._super(p, {
                /**
                 * Sprite del Bloopa.
                 */
                sheet: 'bloopa',
                /**
                 * Posición inicial del Bloopa.
                 */
                x: 1190,
                y: 500,
                /**
                 * Parámetros de velocidad del Bloopa.
                 */
                gravity: 0,
                /**
                 * Atributos adicionales.
                 */
                time_jump: 0
            });
            /**
             * Los módulos Quintus necesarios.
             */
            this.add('2d');
            /**
             * Definición de las funciones adicionales.
             */
            this.on('bump.top', 'top');
            this.on('bump.left, bump.right, bump.bottom', 'collision');
            this.on('die');
        },
        /**
         * Muere el Bloopa.
         */
        die: function() {
            this.destroy();
        },
        /**
         * En caso de que Mario salte encima de él, el Bloopa muere.
         */
        top: function(collision) {
            if (collision.obj.isA('Mario')) {
                this.trigger('die');
                collision.obj.p.vy = -300;
            }
        },
        /**
         * En caso de que Mario choque contra él, Mario muere.
         */
        collision: function(collision) {
            if (collision.obj.isA('Mario')) {
                collision.obj.trigger('die');
            }
        },

        step: function(dt) {
            this.p.time_jump += dt;
            /**
             * Si toca está en el suelo, salta.
             */
            if (this.p.vy == 0) {
                this.p.vy = -70;
                this.p.time_jump = 0;
            }
            /**
             * Indicamos el tiempo al que baja el Boolpa.
             */
            if (this.p.time_jump >= 1.5) {
                this.p.vy = 70;
            }
            /**
             * En caso de caerse del escenario, Bloopa muere.
             */
            if (this.p.y > 580) {
                this.trigger('die');
            }
        }
    });

    /*--------------------------------------------PRINCESS------------------------------------------*/
    /**
     * Clase que representa a la Princesa Peach.
     */
    Q.Sprite.extend("Princess", {
        init: function(p) {
            this._super(p, {
                /**
                 * Imagen de Peach.
                 */
                asset: 'princess.png',
                /**
                 * Posición inicial de Peach.
                 */
                x: 2000,
                y: 452,
                /**
                 * Activamos el sensor de Peach.
                 */
                sensor: true
            });
            /**
             * Necesario para implementar el sensor.
             */
            this.on("sensor");
        },
        /**
         * Sensor de la princesa Peach.
         */
        sensor: function() {
            this.p.sensor = false;
            Q('Mario').trigger('win');
        }

    });

    /*--------------------------------------------ENDGAME------------------------------------------*/
    /**
     * Escena que representa a la pantalla fin de partida.
     */
    Q.scene('endGame', function(stage) {
        var container = stage.insert(new Q.UI.Container({
            x: Q.width / 2,
            y: Q.height / 2,
            fill: 'rgba(0,0,0,0.5)'
        }));

        var button = container.insert(new Q.UI.Button({
            x: 10,
            y: 10,
            fill: '#CCCCCC',
            label: 'Play Again'
        }));

        button.on('click', function() {
            Q.clearStages();
            Q.stageScene('mainTitle');
        });

        var label = container.insert(new Q.UI.Text({
            x: 10,
            y: -10 - button.p.h,
            label: stage.options.label
        }));

        container.fit(20);
    });
    /*--------------------------------------------MAINTITLE------------------------------------------*/
    /**
     * Escena que representa a la pantalla principal.
     */
    Q.scene('mainTitle', function(stage) {
        var container = stage.insert(new Q.UI.Container({
            x: Q.width / 2,
            y: 5,
            fill: 'rgba(0,0,0,0.0)'
        }));

        var button = container.insert(new Q.UI.Button({
            asset: 'mainTitle.png',
            x: 0,
            y: (Q.height / 2) - 5
        }));

        button.on('click', function() {
            Q.clearStages();
            Q.stageScene('level1');
        });

        var label = container.insert(new Q.UI.Text({
            x: 0,
            y: 10,
            label: 'Press Enter or click to start',
            size: 18,
            color: '#000000'
        }));

        container.fit(20);
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

    Q.loadTMX('level.tmx, mainTitle.png, mario_small.png, mario_small.json, goomba.png, goomba.json, bloopa.png, bloopa.json, princess.png', function() {
        Q.compileSheets('mario_small.png', 'mario_small.json');
        Q.compileSheets('goomba.png', 'goomba.json');
        Q.compileSheets('bloopa.png', 'bloopa.json');
        Q.stageScene('mainTitle');
    });
});