this.b3editor = this.b3editor || {};

(function() {
    "use strict";

var DragSystem = function(view, editor) {
    this.initialize(view, editor);
}

var p = DragSystem.prototype;

    p.initialize = function(view, editor) {
        this.view = view;
        this.editor = editor;

        this.isDragging = false;

        this.view.ui.stage.on('stagemousedown', this.onMouseDown, this);
        this.view.ui.stage.on('stagemousemove', this.onMouseMove, this);
        this.view.ui.stage.on('stagemouseup', this.onMouseUp, this);
    };

    p.onMouseDown = function(event) {
        if (event.nativeEvent.which !== 1) return;

        // ctrl is for selection
        if (key.ctrl) return;

        // if is already dragging 
        if (this.isDragging) return;
        
        var point = this.view.getLocalMousePosition();
        var x = point.x
        var y = point.y
        var block = this.view.getBlockUnder(x, y);

        // if mouse not on block
        if (!block) return;

        // if no block selected
        if (!block.isSelected) return;

        // if mouse in anchor
        if (!block.mouseInBlock(x, y)) return;

        // start dragging
        this.isDragging = true;

        for (var i=0; i<this.editor.selectedBlocks.length; i++) {
            var block = this.editor.selectedBlocks[i];
            block.isDragging = true;
            block.dragOffsetX = x - block.displayObject.x;
            block.dragOffsetY = y - block.displayObject.y;
        }
    };

    p.onMouseMove = function(event) {
        if (!this.isDragging) return;

        var point = this.view.getLocalMousePosition();
        var x = point.x
        var y = point.y

        // // move entity
        for (var i=0; i<this.editor.selectedBlocks.length; i++) {
            var block = this.editor.selectedBlocks[i];

            var dx = x - block.dragOffsetX;
            var dy = y - block.dragOffsetY;

            block.displayObject.x = dx - dx%this.view.settings.get('snap_x');
            block.displayObject.y = dy - dy%this.view.settings.get('snap_y');

            // redraw connections linked to the entity
            if (block.inConnection) {
                block.inConnection.redraw();
            }
            for (var j=0; j<block.outConnections.length; j++) {
                block.outConnections[j].redraw();
            }
        }
    };

    p.onMouseUp = function(event) {
        if (event.nativeEvent.which !== 1) return;
        if (!this.isDragging) return;

        this.isDragging = false;
        for (var i=0; i<this.editor.selectedBlocks.length; i++) {
            var block = this.editor.selectedBlocks[i];
            block.isDragging = false;
        }
    };
    
b3editor.DragSystem = DragSystem;
}());
