this.b3editor = this.b3editor || {};

(function() {
    "use strict";

var SelectionBox = function(view) {
    this.initialize(view);
}

var p = SelectionBox.prototype;

    p.initialize = function(view) {
        this.view = view;
        this.settings = null;
        this.displayObject = new createjs.Shape();
        this.displayObject.alpha = 0.3;
        this.displayObject.visible = false;

        // draw
        this.applySettings(this.view.settings);
    }

    p.applySettings = function(settings) {
        this.settings = settings;

        this.redraw();
    }

    p.redraw = function(x1, y1, x2, y2) {
        var color = this.settings.get('selection_color');
        var graphics = this.displayObject.graphics;

        var x = Math.min(x1, x2);
        var y = Math.min(y1, y2);
        var w = Math.abs(x1 -x2);
        var h = Math.abs(y1 -y2);

        graphics.clear();
        graphics.beginFill(color);
        graphics.drawRect(x, y, w, h);
        graphics.endFill();
    }


b3editor.SelectionBox = SelectionBox;
}());
