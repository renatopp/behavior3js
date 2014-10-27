this.b3view = this.b3view || {};

(function() {
    "use strict";

/**
 *  Organizer
**/
var Organizer = function(view) {
    this.initialize(view)
}
var p = Organizer.prototype;

    p.initialize = function(view) {
        this.view              = view;
        this.depth             = 0;
        this.leafCont          = 0;
        this.horizontalSpacing = 208;
        this.verticalSpacing   = 64;
        this.orderByIndex      = false;
        this.connections       = []; // to redraw connections
        this.blocks            = []; // to reposition blocks
    }

    p.__step = function(block) {
        this.blocks.push(block);

        // leaf
        if (block.outConnections.length == 0) {
            this.leafCont++;

            // leaf nodes have the position accord. to the depth and leaf cont.
            var x = this.depth*this.horizontalSpacing;
            var y = this.leafCont*this.verticalSpacing;
        }

        // internal node
        else {
            // internal nodes have the position acord. to the depth and the
            //    mean position of its children
            var ySum = 0;

            if (this.orderByIndex) {
                var conns = block.outConnections;
            } else {
                // get connections ordered by y position
                var conns = block.getOutConnectionsByOrder();
            }

            for (var i=0; i<conns.length; i++) {
                this.depth++;
                this.connections.push(conns[i]);
                ySum += this.__step(conns[i].outBlock);
                this.depth--;
            }

            var x = this.depth*this.horizontalSpacing;
            var y = ySum/block.outConnections.length;
        }

        block.displayObject.x = x;
        block.displayObject.y = y;

        return y;
    }

    p.organize = function(root, orderByIndex) {
        if (!root) return;

        this.depth        = 0;
        this.leafCont     = 0;
        this.connections  = [];
        this.blocks       = [];
        this.orderByIndex = orderByIndex;

        var offsetX = root.displayObject.x;
        var offsetY = root.displayObject.y;

        var root = root;
        this.__step(root);

        offsetX -= root.displayObject.x;
        offsetY -= root.displayObject.y;

        for (var i=0; i<this.blocks.length; i++) {
            this.blocks[i].displayObject.x += offsetX;
            this.blocks[i].displayObject.y += offsetY;
        }

        for (var i=0; i<this.connections.length; i++) {
            this.connections[i].redraw();
        }
    }

b3view.Organizer = Organizer;
}());
