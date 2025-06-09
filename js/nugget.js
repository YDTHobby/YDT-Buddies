function loadNugget(Q) {
    /*--------------------------------------------Super YDT Buddies------------------------------------------*/

    Q.animations('nugget animation', {
        'run_right': { frames: [1, 2, 3], rate: 1 / 7 },
        'run_left': { frames: [15, 16, 17], rate: 1 / 7 },
        'stand_right': { frames: [0], loop: false },
        'stand_left': { frames: [14], loop: false },
        'jumping_right': { frames: [4], loop: false },
        'jumping_left': { frames: [18], loop: false },
        'die': { frames: [12], loop: false },
        'kiss': { frames: [5, 6, 7], rate: 1/5, loop: false }
    });
    /**
     * Class representing Nugget.
     */
    Q.Sprite.extend('nugget', {
        /** 
         * Class initialization.
         */
        init: function(p) {
            this._super(p, {
                sprite: 'nugget animation',
                /**
                 * Nugget Sprite.
                 */
                sheet: 'nugget',
                /**
                 * Nugget starting position.
                 */
                x: 150,
                y: 380,
                direction: 'right',
                /**
                 * Nugget velocity parameters.
                 */
                jumpSpeed: -500,
                speed: 200,
                vy: 10,
                /**
                 * Additional attributes.
                 */
                die: false,
                move: true,
                isKissing: false
            });
            /**
             * The necessary Quintus modules.
             */
            this.add('2d, platformerControls, animation, tween');
            /**
             * Definition of additional functions.
             */
            this.on('die');
            this.on('win');
            this.on('kiss');
        },
        /**
         * nugget dies.
         */
        die: function() {
            Q.audio.stop('music_main.mp3');
            if (!this.p.die) {
                Q.audio.play('music_die.mp3');
            }
            this.p.die = true;
            this.p.speed = 0;
            this.p.jumpSpeed = 0;

            var lose = function() {
                this.destroy();
                Q.stageScene('endGame', 1, { label: 'Game Over' });
            }
            var nuggetDie = function() {
                this.animate({ x: this.p.x, y: fondo_escenario, angle: 0 }, 0.5, { callback: lose });
            }
            this.animate({ y: this.p.y - 100, angle: 0 }, 0.3, { callback: nuggetDie });
        },
        /**
         * nugget wins.
         */
        win: function() {
            this.p.move = false;
            Q.audio.stop('music_main.mp3');
            Q.audio.play('music_level_complete.mp3');
            Q.stageScene('endGame', 1, { label: 'You Win' });
        },
        /**
         * Handle kiss animation
         */
        kiss: function() {
            this.p.isKissing = true;
            this.p.move = false;
            this.play('kiss');
            // After kiss animation completes, trigger win
            setTimeout(() => {
                this.trigger('win');
            }, 1000);
        },
        /**
         * Execute a nugget step.
         */
        step: function(dt) {
            /**
             * In case nugget dies.
             */
            if (this.p.die) {
                this.play('die');
                this.p.speed = 0;
                this.p.jumpSpeed = 0;
            } else if (this.p.isKissing) {
                // Keep playing kiss animation
                this.play('kiss');
            } else {
                /**
                 * Normal movement.
                 */
                if (this.p.move) {
                    if (this.p.vy != 0) {
                        this.play('jumping_' + this.p.direction)
                    } else if (this.p.vx != 0) {
                        this.play('run_' + this.p.direction );
                    } else {
                        this.play('stand_' + this.p.direction);
                    }
                    /*
                     * If he falls off the stage, Nugget dies.
                     */
                    if (this.p.y > fondo_escenario) {
                        this.trigger('die');
                    }
                }
                /**
                 * He has won the game.
                 */
                else {
                    this.play('stand_right');
                    this.p.speed = 0;
                    this.p.jumpSpeed = 0;
                }
            }
        }
    });
}
