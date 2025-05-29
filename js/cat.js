function loadCat(Q) {

    Q.animations('cat animation', {
        'live': { frames: [0, 1], rate: 1 / 2 },
        'die': { frames: [2], loop: false }
    });
    /**
     * Class that represents the cat enemy.
     */
    Q.Sprite.extend('cat', {
        init: function(p) {
            this._super(p, {
                sprite: 'cat animation',
                /**
                 * cat's Sprite.
                 */
                sheet: 'cat',
                /**
                 * Posición inicial del cat.
                 */
                x: 1190,
                y: 500,
                /**
                 * cat. Starting Position
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
         * cat dies.
         */
        die: function() {
            this.p.die = true;
            this.p.vy = 70;
            setTimeout(function() {
                Q('cat').destroy();
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
                 * We indicate the time at which the cat descends.
                 */
                if (this.p.time_jump >= 1.5) {
                    this.p.vy = 70;
                }
                /**
                 * If cat falls off the stage, they dies.
                 */
                if (this.p.y > fondo_escenario) {
                    this.trigger('die');
                }
            }
        }
    });
}
