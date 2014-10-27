this.b3view = this.b3view || {};

(function() {
    "use strict";

var Block = function(view, node) {
    this.initialize(view, node)
}
var p = Block.prototype;

    p.initialize = function(view, node) {
        var dict = node.prototype;
        if (!dict)
            dict = node;

        this.id             = b3.createUUID();
        this.node           = node;
        this.name           = dict.name;
        this.category       = dict.category;
        this.title          = dict.title || this.name;
        this.description    = dict.description || '';
        this.parameters     = dict.parameters || {};
        this.properties     = dict.properties || {};

        this.view           = view;
        this.settings       = view.settings
        
        this.displayObject  = new createjs.Container();
        this.inConnection   = null;
        this.outConnections = [];
        this.isSelected     = false;
        this.isDragging     = false;
        this.dragOffsetX    = 0;
        this.dragOffsetX    = 0;
        
        this._width         = null;
        this._height        = null;
        this._shapeObject   = new createjs.Shape();
        this._shadowObject  = null;
        this._symbolObject  = null;

        this.applySettings();
    }

    p.applySettings = function(settings) {
        this.settings = settings || this.settings;
        this._shadowObject = new createjs.Shadow(
            this.settings.get('selection_color'), 0, 0, 5
        );

        this.redraw();
    }
    
    p.copy = function() {
        var block = new b3view.Block(this.view, this.node);

        block.displayObject.x = this.displayObject.x;
        block.displayObject.y = this.displayObject.y;
        block._width          = this._width;
        block._height         = this._height;
        block.anchorXOffset   = this.anchorXOffset;
        block.category        = this.category;
        block.title           = this.title;
        block.description     = this.description;

        return block;
    }

    p.redraw = function() {
        // Set variables
        var settings = this.settings;
        var name = this.name;
        var category = this.category.toLowerCase();
        var shape = this.view.shapes[category];
        
        var symbol = this.view.symbols[name] || b3view.draw.textSymbol;

        this._width  = settings.get('block_'+category+'_width');
        this._height = settings.get('block_'+category+'_height');

        this.displayObject.removeAllChildren();

        // Draw symbol
        this._symbolObject = symbol(this, settings);

        // Draw shape
        this._shapeObject.graphics.clear();
        shape(this, settings);

        // Add to display
        this.displayObject.addChild(this._shapeObject);
        this.displayObject.addChild(this._symbolObject);
    }

    // SELECTION ==============================================================
    p.select = function() {
        this.isSelected = true;
        this._shapeObject.shadow = this._shadowObject;
    }

    p.deselect = function() {
        this.isSelected = false;
        this._shapeObject.shadow = null;
    }
    // ========================================================================

    // CONNECTIONS ============================================================
    p.getOutNodeIds = function() {
        var nodes = [];
        for (var i=0; i<this.outConnections.length; i++) {
            nodes.push(this.outConnections[i].outBlock.id);
        }

        return nodes;
    }
    p.getOutConnectionsByOrder = function() {
        var conns = this.outConnections.slice(0);
        conns.sort(function(a, b) {
            return a.outBlock.displayObject.y - 
                   b.outBlock.displayObject.y;
        })

        return conns;
    }

    p.addInConnection = function(connection) {
        this.inConnection = connection;
    }

    p.addOutConnection = function(connection) {
        this.outConnections.push(connection)
    }

    p.removeInConnection = function() {
        this.inConnection = null;
    }

    p.removeOutConnection = function(connection) {
        var index = this.outConnections.indexOf(connection);
        if (index > -1) {
            this.outConnections.splice(index, 1);
        }
    }
    // ========================================================================

    // HITTESTING =============================================================
    p.hitTest = function(x, y) {
        x = x - this.displayObject.x;
        y = y - this.displayObject.y;

        // return this.displayObject.hitTest(x, y);
        return this._shapeObject.hitTest(x, y);
    }

    p.isContainedIn = function(x1, y1, x2, y2) {
        if (x1 < this.displayObject.x-this._width/2 &&
            y1 < this.displayObject.y-this._height/2 &&
            x2 > this.displayObject.x+this._width/2 &&
            y2 > this.displayObject.y+this._height/2) {
            return true;
        }

        return false;
    }

    p.getLeftAnchorX = function() {
        return this.displayObject.x-this._width/2-this.settings.get('anchor_offset_x');
    }

    p.getRightAnchorX = function() {
        return this.displayObject.x+this._width/2+this.settings.get('anchor_offset_x');
    }

    // after hitTest returned true, verify if click was in block
    p.mouseInBlock = function(x, y) {
        return (Math.abs(x - this.displayObject.x) < this._width/2)
    }

    // after hitTest returned true, verify if click was in left anchor
    p.mouseInLeftAnchor = function(x, y) {
        var dx = x - this.displayObject.x;

        return (Math.abs(dx) > this._width/2 && dx < 0);
    }

    // after hitTest returned true, verify if click was in right anchor
    p.mouseInRightAnchor = function(x, y) {
        var dx = x - this.displayObject.x;

        return (Math.abs(dx) > this._width/2 && dx > 0);
    }
    // ========================================================================


b3view.Block = Block;
}());
