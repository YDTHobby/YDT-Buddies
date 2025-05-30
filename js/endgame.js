function loadEndGame(Q) {
    Q.scene('endGame', function(stage) {
        var container = stage.insert(new Q.UI.Container({
            x: Q.width / 2,
            y: Q.height / 2,
            fill: 'rgba(0,0,0,0.5)'
        }));

        var isWin = stage.options.label === 'You Win';
        
        // Update progress if won
        if (isWin) {
            var progress = Q.state.get('progress') || {
                unlockedLevels: 1,
                completedLevels: []
            };
            
            var currentLevel = Q.state.get('currentLevel') || 1;
            
            // Mark level as completed
            if (progress.completedLevels.indexOf(currentLevel) === -1) {
                progress.completedLevels.push(currentLevel);
            }
            
            // Unlock next level
            if (currentLevel >= progress.unlockedLevels && currentLevel < 8) {
                progress.unlockedLevels = currentLevel + 1;
            }
            
            Q.state.set('progress', progress);
            
            // Save to localStorage if available
            if (typeof(Storage) !== "undefined") {
                localStorage.setItem('ydtProgress', JSON.stringify(progress));
            }
        }

        var button = container.insert(new Q.UI.Button({
            x: 10,
            y: 10,
            fill: '#CCCCCC',
            label: isWin ? 'Continue' : 'Try Again'
        }));

        button.on('click', function() {
            Q.clearStages();
            if (isWin) {
                Q.stageScene('worldMap');
            } else {
                var currentLevel = Q.state.get('currentLevel') || 1;
                Q.stageScene('level' + currentLevel);
            }
        });

        var label = container.insert(new Q.UI.Text({
            x: 10,
            y: -10 - button.p.h,
            label: stage.options.label
        }));

        container.fit(20);
    });
}
