function loadDefaultEnemy(Q) {
    Q.component('defaultEnemy', {
        added: function() {
            this.entity.add('2d, animation');

            /**
             * Definition of additional functions.
             */
            this.entity.on('bump.top', this, 'top');
            this.entity.on('bump.left, bump.right, bump.bottom', this, 'collision');
        },
        /**
         * If Nugget jumps on Cat, the Cat dies.
         */
        top: function(collision) {
            if (collision.obj.isA('nugget')) {
                if(!this.entity.p.collision){
                    this.entity.trigger('die');
                    collision.obj.p.vy = -300;
                    this.entity.p.collision = true;
                }
                
            }
        },
        /**
         * If Nugget crashes into Cat, Nugget dies.
         */
        collision: function(collision) {
            if (collision.obj.isA('nugget')) {
                if(!this.entity.p.collision){
                    collision.obj.trigger('die');
                    this.entity.p.collision = true;
                }
            }
        }
    });
}
