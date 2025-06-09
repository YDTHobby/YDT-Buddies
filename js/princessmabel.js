function loadPrincessMabel(Q) {

    /**
     * Class representing Princess Mabel.
     */
    Q.Sprite.extend('princess', {
        init: function(p) {
            this._super(p, {
                /**
                 * Image of Mabel.
                 */
                asset: 'princess.png',
                /**
                 * Mabel's starting position.
                 */
                x: 2000,
                y: 452,
                /**
                 * We activate Mabel's sensor.
                 */
                sensor: true,
                /**
                 * Kiss animation state
                 */
                isKissing: false,
                kissDistance: 50 // Distance in pixels to trigger kiss
            });
            /**
             * Required to deploy the sensor.
             */
            this.on('sensor');
            this.on('step');
        },
        /**
         * Princess Mabel's Sensor.
         */
        sensor: function() {
            this.p.sensor = false;
            Q('nugget').trigger('win');
        },
        /**
         * Check for proximity to Nugget
         */
        step: function(dt) {
            var nugget = Q('nugget').first();
            if (nugget && !this.p.isKissing) {
                var dx = Math.abs(this.p.x - nugget.p.x);
                var dy = Math.abs(this.p.y - nugget.p.y);
                var distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < this.p.kissDistance) {
                    this.p.isKissing = true;
                    // Trigger kiss animation
                    this.trigger('kiss');
                    // Wait a moment before triggering win
                    setTimeout(() => {
                        this.trigger('sensor');
                    }, 1000);
                }
            }
        }
    });
}
