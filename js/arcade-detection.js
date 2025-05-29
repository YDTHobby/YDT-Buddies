// Detect if game is running inside arcade machine
(function() {
    window.addEventListener('load', function() {
        if (window.parent !== window) {
            const body = document.body;
            if (body) body.classList.add('in-arcade');
        
        // Expose Q object to parent window for arcade controls
        window.addEventListener('load', function() {
            if (window.Q) {
                window.Q.arcadeMode = true;
                
                // Override input handling to work better with arcade controls
                var originalInput = window.Q.input.keyboardControls;
                window.Q.input.keyboardControls = function(keys) {
                    // Add arcade-specific key mappings
                    var arcadeKeys = keys || {};
                    arcadeKeys['SPACE'] = 'fire';
                    arcadeKeys['Z'] = 'fire';
                    arcadeKeys['X'] = 'action';
                    arcadeKeys['ENTER'] = 'confirm';
                    arcadeKeys['P'] = 'pause';
                    
                    return originalInput.call(this, arcadeKeys);
                };
                
                // Make Q accessible to parent window
                if (window.parent.postMessage) {
                    window.parent.postMessage({ type: 'quintus-ready' }, '*');
                }
            }
        });
        
        // Listen for control messages from arcade machine
        window.addEventListener('message', function(event) {
            if (event.data && event.data.type === 'arcade-control') {
                if (window.Q && window.Q.inputs) {
                    // Update game inputs based on arcade controls
                    if (event.data.input) {
                        window.Q.inputs[event.data.input] = event.data.state;
        }
    });
})();

        });
    }
})();
