function loadCat(Q) {

    Q.animations('Cat animation', {
        'live': { frames: [0, 1], rate: 1 / 2 },
        'die': { frames: [2], loop: false }
    });
    /**
     * Class that represents the Cat enemy.
     */
    Q.Sprite.extend('Cat', {
        init: function(p) {
            this._super(p, {
                sprite: 'Cat animation',
                /**
                 * Cat's Sprite.
                 */
                sheet: 'Cat',
                /**
                 * Posición inicial del Cat.
                 */
                x: 1190,
                y: 500,
                /**
                 * Cat. Starting Position
                 */
                gravity: 0,
                /**
                 * Additional attributes.
                 */
                time_jump: 0,
                die: false,
                collision: false
            });
            /**
             * The necessary Quintus modules.
             */
            this.add('defaultEnemy');
            /**
             * Definition of additional functions.
             */
            this.on('die');
        },
        /**
         * Cat dies.
         */
        die: function() {
            this.p.die = true;
            this.p.vy = 70;
            setTimeout(function() {
                Q('Cat').destroy();
            }, 200);
        },

        step: function(dt) {
            if (this.p.die) {
                this.play('die');
            } else {
                this.play('live');
                this.p.time_jump += dt;
                /**
                 * If you touch it is on the ground, jump.
                 */
                if (this.p.vy == 0) {
                    this.p.vy = -70;
                    this.p.time_jump = 0;
                }
                /**
                 * We indicate the time at which the Cat descends.
                 */
                if (this.p.time_jump >= 1.5) {
                    this.p.vy = 70;
                }
                /**
                 * If Cat falls off the stage, they dies.
                 */
                if (this.p.y > fondo_escenario) {
                    this.trigger('die');
                }
            }
        }
    });
}
