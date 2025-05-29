function loadTangledyarn(Q) {
    
    Q.animations('tangledyarn animation', {
        'live': { frames: [0, 1], rate: 1 / 5 },
        'die': { frames: [2], loop: false }
    });
    /**
     * Class that represents the enemy tangledyarn.
     */
    Q.Sprite.extend('tangledyarn', {
        init: function(p) {
            this._super(p, {
                sprite: 'tangledyarn animation',
                /**
                 * tangledyarn sprite.
                 */
                sheet: 'tangledyarn',
                /**
                 * Posición inicial del tangledyarn.
                 */
                x: 1660,
                y: 500,
                /**
                 * tangledyarn's starting position.
                 */
                speed: 170,
                vx: 100,
                /**
                 * Additional attributes.
                 */
                die: false,
                collision: false
            });
            /**
             * The necessary Quintus modules.
             */
            this.add('aiBounce, defaultEnemy');
            /**
             * Definition of additional functions.
             */
            this.on('die');
        },
        /**
         * The tangledyarn dies.
         */
        die: function() {
            this.p.die = true;
            this.p.speed = 0;
            this.p.vx = 0;

            setTimeout(function() {
                Q('tangledyarn').destroy();
            }, 200);
        },
        /**
         * Execute a tangledyarn step.
         */
        step: function(dt) {
            if (this.p.die) {
                this.play('die');
            } else {
                this.play('live');
                /**
                 * If tangledyarn falls off the stage, he dies.
                 */
                if (this.p.y > fondo_escenario) {
                    this.trigger('die');
                }
            }
        }
    });
}
