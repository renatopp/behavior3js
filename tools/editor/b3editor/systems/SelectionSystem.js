this.b3editor = this.b3editor || {};

(function() {
    "use strict";

var SelectionSystem = function(view, editor) {
    this.initialize(view, editor);
}

var p = SelectionSystem.prototype;

    p.initialize = function(view, editor) {
        this.view = view;
        this.editor = editor;

        this.isSelecting = false;
        this.ctrl = false;
        this.x1 = 0;
        this.y1 = 0;

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

        if (block) {
            // if block isnt selected, select it
            if (!block.isSelected) {
                if (block.mouseInBlock(x, y)) {
                    if (!key.ctrl) {
                        this.editor.deselectAll();
                    }

                    this.editor.select(block);
                }
            } else if (key.ctrl) {
                this.editor.deselect(block);
            }

        // if clicked on open space
        } else {
            this.isSelecting = true;
            this.x1 = x;
            this.y1 = y;

            if (!key.ctrl) {
                this.editor.deselectAll();
            } else {
                this.ctrl = true;
            }
            // if (key.ctrl) {
            // } else {
            // }
        }
    };

    p.onMouseMove = function(event) {
        if (!this.isSelecting) {
            return;
        }

        var point = this.view.getLocalMousePosition();
        var x = point.x
        var y = point.y

        this.editor.selectionBox.displayObject.visible = true;
        this.editor.selectionBox.redraw(this.x1, this.y1, x, y);
    };

    p.onMouseUp = function(event) {
        if (event.nativeEvent.which !== 1) return;   
        if (!this.isSelecting) return;

        var point = this.view.getLocalMousePosition();
        var x = point.x;
        var y = point.y;

        var x1 = Math.min(this.x1, x);
        var y1 = Math.min(this.y1, y);
        var x2 = Math.max(this.x1, x);
        var y2 = Math.max(this.y1, y);

        for (var i=0; i<this.view.blocks.length; i++) {
            var block = this.view.blocks[i];
            if (block.isContainedIn(x1, y1, x2, y2)) {
                this.editor.invertSelection(block);
            }
        }

        this.editor.selectionBox.displayObject.visible = false;
        this.isSelecting = false;
        this.ctrl = false;
    };

b3editor.SelectionSystem = SelectionSystem;
}());
