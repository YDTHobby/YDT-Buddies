function loadWorldMap(Q) {
    // World Map Player - simplified movement
    Q.Sprite.extend('WorldPlayer', {
        init: function(p) {
            this._super(p, {
                sheet: 'nugget',  // Reuse Nugget sprite
                frame: 0,
                x: 100,  // Starting position at level 1
                y: 300,
                speed: 100,
                currentNode: 0,
                moving: false
            });
            
            this.add('2d, animation');
            this.p.gravity = 0;  // No gravity on world map
        },
        
        step: function(dt) {
            // Stop at destination
            if (this.p.moving && 
                Math.abs(this.p.x - this.p.destX) < 5 && 
                Math.abs(this.p.y - this.p.destY) < 5) {
                this.p.x = this.p.destX;
                this.p.y = this.p.destY;
                this.p.vx = 0;
                this.p.vy = 0;
                this.p.moving = false;
            }
        }
    });
    
    // Level Node sprite
    Q.Sprite.extend('LevelNode', {
        init: function(p) {
            this._super(p, {
                w: 48,
                h: 48,
                type: Q.SPRITE_UI,
                collisionMask: Q.SPRITE_NONE,
                locked: true,
                completed: false
            });
            
            this.add('2d');
            this.p.gravity = 0;
        },
        
        draw: function(ctx) {
            // Draw circle for level node
            ctx.beginPath();
            ctx.arc(0, 0, 20, 0, Math.PI * 2);
            
            if (this.p.completed) {
                ctx.fillStyle = '#4CAF50';  // Green for completed
            } else if (!this.p.locked) {
                ctx.fillStyle = '#FFC107';  // Yellow for available
            } else {
                ctx.fillStyle = '#666666';  // Grey for locked
            }
            
            ctx.fill();
            ctx.strokeStyle = '#000';
            ctx.lineWidth = 3;
            ctx.stroke();
            
            // Draw level number
            ctx.fillStyle = this.p.locked ? '#999' : '#000';
            ctx.font = 'bold 16px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(this.p.level, 0, 0);
            
            // Draw lock icon if locked
            if (this.p.locked) {
                ctx.font = '20px Arial';
                ctx.fillText('🔒', 0, 25);
            } else if (this.p.completed) {
                ctx.font = '20px Arial';
                ctx.fillText('⭐', 0, 25);
            }
        }
    });
    
    // World Map Scene
    Q.scene('worldMap', function(stage) {
        // Set background color
        stage.insert(new Q.UI.Container({
            x: Q.width/2,
            y: Q.height/2,
            w: Q.width,
            h: Q.height,
            fill: '#87CEEB'  // Sky blue
        }));
        
        // Title
        stage.insert(new Q.UI.Text({
            x: Q.width/2,
            y: 30,
            label: 'Select a Level',
            size: 24,
            color: '#000'
        }));
        
        // Get saved progress
        var progress = Q.state.get('progress') || { 
            unlockedLevels: 1,
            completedLevels: []
        };
        
        // Level positions (you can adjust these)
        var levelPositions = [
            {x: 100, y: 300, level: 1},
            {x: 200, y: 280, level: 2},
            {x: 300, y: 300, level: 3},
            {x: 400, y: 250, level: 4},
            {x: 500, y: 200, level: 5},
            {x: 600, y: 250, level: 6},
            {x: 700, y: 300, level: 7},
            {x: 800, y: 280, level: 8}
        ];
        
        // Draw paths between levels
        var pathGraphics = stage.insert(new Q.UI.Container({
            x: 0, y: 0, w: Q.width, h: Q.height
        }));
        
        pathGraphics.draw = function(ctx) {
            ctx.strokeStyle = '#8B4513';  // Brown path
            ctx.lineWidth = 6;
            ctx.setLineDash([10, 5]);  // Dashed line
            
            ctx.beginPath();
            for (var i = 0; i < levelPositions.length - 1; i++) {
                if (i === 0) {
                    ctx.moveTo(levelPositions[i].x, levelPositions[i].y);
                }
                ctx.lineTo(levelPositions[i + 1].x, levelPositions[i + 1].y);
            }
            ctx.stroke();
            ctx.setLineDash([]);  // Reset dash
        };
        
        // Create level nodes
        var nodes = [];
        levelPositions.forEach(function(pos, index) {
            var node = stage.insert(new Q.LevelNode({
                x: pos.x,
                y: pos.y,
                level: pos.level,
                locked: pos.level > progress.unlockedLevels,
                completed: progress.completedLevels.indexOf(pos.level) !== -1
            }));
            nodes.push(node);
        });
        
        // Create world player at first unlocked incomplete level
        var startNode = 0;
        for (var i = 0; i < nodes.length; i++) {
            if (!nodes[i].p.locked && !nodes[i].p.completed) {
                startNode = i;
                break;
            }
        }
        
        var player = stage.insert(new Q.WorldPlayer({
            x: levelPositions[startNode].x,
            y: levelPositions[startNode].y - 40,
            currentNode: startNode
        }));
        
        // Handle input
        Q.input.on('left', stage, function() {
            if (!player.p.moving && player.p.currentNode > 0) {
                player.p.currentNode--;
                player.p.destX = levelPositions[player.p.currentNode].x;
                player.p.destY = levelPositions[player.p.currentNode].y - 40;
                player.p.moving = true;
                
                // Calculate direction
                var dx = player.p.destX - player.p.x;
                var dy = player.p.destY - player.p.y;
                var dist = Math.sqrt(dx*dx + dy*dy);
                player.p.vx = (dx/dist) * player.p.speed;
                player.p.vy = (dy/dist) * player.p.speed;
            }
        });
        
        Q.input.on('right', stage, function() {
            if (!player.p.moving && player.p.currentNode < nodes.length - 1) {
                player.p.currentNode++;
                player.p.destX = levelPositions[player.p.currentNode].x;
                player.p.destY = levelPositions[player.p.currentNode].y - 40;
                player.p.moving = true;
                
                // Calculate direction
                var dx = player.p.destX - player.p.x;
                var dy = player.p.destY - player.p.y;
                var dist = Math.sqrt(dx*dx + dy*dy);
                player.p.vx = (dx/dist) * player.p.speed;
                player.p.vy = (dy/dist) * player.p.speed;
            }
        });
        
        Q.input.on('confirm', stage, function() {
            var selectedNode = nodes[player.p.currentNode];
            if (!selectedNode.p.locked) {
                Q.audio.play('yarnball.mp3');
                Q.clearStages();
                Q.state.set('currentLevel', selectedNode.p.level);
                Q.stageScene('level' + selectedNode.p.level);
            }
        });
        
        // Instructions
        stage.insert(new Q.UI.Text({
            x: Q.width/2,
            y: Q.height - 30,
            label: 'Use LEFT/RIGHT to move, ENTER to select',
            size: 14,
            color: '#000'
        }));
        
        // Viewport follows player
        stage.add('viewport').follow(player, {x: true, y: false}, {
            minX: 0,
            maxX: 900
        });
    });
}
