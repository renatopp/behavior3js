this.b3view = this.b3view || {};

(function() {
    "use strict";

var UI = function(view, canvas) {
    this.initialize(view, canvas)
}

var p = UI.prototype;

    p.initialize = function(view, canvas) {
        this.view = view;

        // createjs and creatine variables
        this.canvas = canvas;
        this.stage = new createjs.Stage(canvas);
        this.display = new creatine.Display(canvas);

        this.display.setUserSelect(false);
        this.display.setTouchAction(false);
        this.stage.snapToPixelEnabled = true;
        createjs.Ticker.setFPS(60);

        // layers
        this.camera = new createjs.Container();
        this.layerConnections = new createjs.Container();
        this.layerBlocks = new createjs.Container();
        this.layerOverlay = new createjs.Container();

        this.applySettings(this.view.settings);

        // add children
        this.camera.addChild(this.layerConnections);
        this.camera.addChild(this.layerBlocks);
        this.camera.addChild(this.layerOverlay);
        this.stage.addChild(this.camera);
    }

    p.applySettings = function(settings) {
        this.canvas.style.background = settings.get('background_color');    
    }

b3view.UI = UI;
}());
