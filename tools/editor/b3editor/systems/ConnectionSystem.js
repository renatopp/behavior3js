this.b3editor = this.b3editor || {};

(function() {
    "use strict";

var ConnectionSystem = function(view, editor) {
    this.initialize(view, editor);
}
var p = ConnectionSystem.prototype;

    p.initialize = function(view, editor) {
        this.view = view;
        this.editor = editor;

        this.entity = null;
        this.view.ui.stage.on('stagemousedown', this.onMouseDown, this);
        this.view.ui.stage.on('stagemousemove', this.onMouseMove, this);
        this.view.ui.stage.on('stagemouseup', this.onMouseUp, this);
    };

    p.onMouseDown = function(event) {
        if (event.nativeEvent.which !== 1) return;

        // if clicked on block
        var point = this.view.getLocalMousePosition();
        var x = point.x
        var y = point.y
        var block = this.view.getBlockUnder(x, y);

        if (this.entity || !block) return;

        if (block.mouseInRightAnchor(x, y)) {
            // if user clicked at the outAnchor
            this.entity = this.view.addConnection(block);

        } else if (block.mouseInLeftAnchor(x, y)) {
            // if user clicked at the inAnchor
            var connection = block.inConnection;
            if (!connection)
                return;

            block.removeInConnection();
            connection.removeOutBlock();

            this.entity = connection;
        }
    };

    p.onMouseMove = function(event) {
        // if no entity, return
        if (!this.entity) return;

        var point = this.view.getLocalMousePosition();
        var x = point.x
        var y = point.y

        // redraw
        this.entity.redraw(null, null, x, y);
    };

    p.onMouseUp = function(event) {
        if (event.nativeEvent.which !== 1) return;

        // if no entity, return
        if (!this.entity) return;

        var point = this.view.getLocalMousePosition();
        var x = point.x
        var y = point.y
        var block = this.view.getBlockUnder(x, y);

        // if not entity or entity but no block
        if (!block || block === this.entity.inBlock || block.category === 'root') {
            this.view.removeConnection(this.entity);
        } else {
            // if double parent on node
            if (block.inConnection) {
                this.view.removeConnection(block.inConnection);
            }

            // if double children on root
            if ((this.entity.inBlock.category === 'root' || this.entity.inBlock.category === 'decorator') &&
                    this.entity.inBlock.outConnections.length > 1) {
                this.view.removeConnection(this.entity.inBlock.outConnections[0]);
            }

            this.entity.addOutBlock(block);
            block.addInConnection(this.entity);

            this.entity.redraw();
        }

        this.entity = null;
    };

b3editor.ConnectionSystem = ConnectionSystem;
}());
