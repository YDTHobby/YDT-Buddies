function loadLevel1(Q) {
    /**
     * Scene representing level 1.
     */
    Q.scene('level1', function(stage) {
        Q.stageTMX('level.tmx', stage);

        var nugget = stage.insert(new Q.nugget());
        var tangledyarn = stage.insert(new Q.tangledyarn());
        var cat = stage.insert(new Q.cat());
        var princess = stage.insert(new Q.princess());

        var yarnball1 = stage.insert(new Q.yarnball({ x: 200, y: 450 }));
        var yarnball2 = stage.insert(new Q.yarnball({ x: 230, y: 450 }));
        var yarnball3 = stage.insert(new Q.yarnball({ x: 260, y: 450 }));

        stage.add('viewport').follow(nugget, {
            x: true,
            y: true
        }, {
            minY: 120,
            maxY: 500
        });
        Q.stageScene('HUB', 1);
    });
}
