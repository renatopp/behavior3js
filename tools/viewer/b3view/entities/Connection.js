this.b3view = this.b3view || {};

(function() {
    "use strict";

var Connection = function(view) {
    this.initialize(view)
}

var p = Connection.prototype;

    p.initialize = function(view) {
        this.view = view;
        this.inBlock = null;
        this.outBlock = null;
        this.displayObject = new createjs.Shape();
        this.settings = null;

        // draw
        this.applySettings(this.view.settings);
    }

    p.addInBlock = function(block) {
        this.inBlock = block;
    }
    p.addOutBlock = function(block) {
        this.outBlock = block;
    }
    p.removeInBlock = function() {
        this.inBlock = null;
    }
    p.removeOutBlock = function() {
        this.outBlock = null;
    }

    p.applySettings = function(settings) {
        this.settings = settings;

        this.redraw();
    }

    p.redraw = function(x1, y1, x2, y2) {
        if (!this.inBlock && (x1==null&&y1==null) ||
            !this.outBlock && (x2==null&&y2==null)) {
            return;
        }

        var settings   = this.settings;
        var graphics   = this.displayObject.graphics;
        var width      = settings.get('connection_width');
        var color      = settings.get('connection_color');
        var diff       = settings.get('anchor_radius') + 
                        settings.get('anchor_border_width');
        var arrowWidth = settings.get('anchor_radius')/2;

        // TODO: error when outBlock or inBlock is null and x or y is 0
        x1 = (x1==0||x1)? x1 : this.inBlock.getRightAnchorX();
        x2 = (x2==0||x2)? x2 : this.outBlock.getLeftAnchorX() - diff;
        y1 = (y1==0||y1)? y1 : this.inBlock.displayObject.y;
        y2 = (y2==0||y2)? y2 : this.outBlock.displayObject.y;

        var dx = 2.5*(x2 - x1)/4;

        graphics.clear();
        graphics.setStrokeStyle(width, 'round');
        graphics.beginStroke(color);
        graphics.moveTo(x1, y1);
        graphics.bezierCurveTo(x1 + dx, y1, x2 - dx, y2, x2, y2);
        graphics.beginFill(color);
        graphics.drawPolyStar(x2-arrowWidth, y2, arrowWidth, 3, 0, 0);
        graphics.endFill();
        graphics.endStroke();
    }


b3view.Connection = Connection;
}());
