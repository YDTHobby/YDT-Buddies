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
                sensor: true
            });
            /**
             * Required to deploy the sensor.
             */
            this.on('sensor');
        },
        /**
         * Princess Mabel's Sensor.
         */
        sensor: function() {
            this.p.sensor = false;
            Q('Mario').trigger('win');
        }
    });
}
