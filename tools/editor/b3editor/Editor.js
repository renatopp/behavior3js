this.b3editor = this.b3editor || {};


(function() {
    "use strict";

var Editor = function(view) {
    this.initialize(view)
}
var p = Editor.prototype = new createjs.EventDispatcher;

    p.initialize = function(view) {
        this.view = view;
        this.view.reset();
        this.view.settings.load(b3editor.OPTIONS);
        this.view.settings.load(b3editor.SHOTCUTS);

        this.ui = new b3editor.UI(this.view, this);

        this.selectionBox = new b3editor.SelectionBox(this.view);
        this.view.ui.layerOverlay.addChild(this.selectionBox.displayObject);
        this.view.zoom(this.view.settings.get('zoom_initial')) 

        this.clipboard = [];
        this.selectedBlocks = [];
        this.insertingBlockId = null;

        this.systems = [];
        this.registerSystem(b3editor.CameraSystem);
        this.registerSystem(b3editor.SelectionSystem);
        this.registerSystem(b3editor.DragSystem);
        this.registerSystem(b3editor.ConnectionSystem);
        this.registerSystem(b3editor.FactorySystem);

        var this_ = this;
        createjs.Ticker.addEventListener('tick', function(e) {this_.update(e)});
    };

    p.registerSystem = function(System, priority) {
        var s = new System(this.view, this);
        if (priority)
            this.systems.splice(0, 0, s);
        else
            this.systems.push(s);
    }

    p.update = function(e) {
        e.fdelta = e.delta/1000;

        this.view.update();
    }

    p.snap = function(blocks) {
        if (!blocks) {
            blocks = this.view.blocks;
        }
        else if (!$.isArray(blocks)) {
            blocks = [blocks];
        }

        var snap_x = this.view.settings.get('snap_x');
        var snap_y = this.view.settings.get('snap_y');

        for (var i=0; i<blocks.length; i++) {
            var block = blocks[i];
            block.displayObject.x -= block.displayObject.x%snap_x;
            block.displayObject.y -= block.displayObject.y%snap_y;
        }
    }

    p.select = function(block) {
        if (block.isSelected) return;

        this.dispatchEvent('blockselect', block);

        block.select();
        this.selectedBlocks.push(block)
    }
    p.deselect = function(block) {
        if (!block.isSelected) return;

        this.dispatchEvent('blockdeselect', block);

        block.deselect();
        var index = this.selectedBlocks.indexOf(block);
        if (index > -1) this.selectedBlocks.splice(index, 1);
    }
    p.selectAll = function() {
        for (var i=0; i<this.view.blocks.length; i++) {
            this.select(this.view.blocks[i]);
        }
    }
    p.deselectAll = function() {
        for (var i=0; i<this.selectedBlocks.length; i++) {
            this.dispatchEvent('blockdeselect', this.selectedBlocks[i]);
            this.selectedBlocks[i].deselect();
        }

        this.selectedBlocks = [];
    }
    p.invertSelection = function(block) {
        var blocks = (block)?[block]:this.view.blocks;

        for (var i=0; i<blocks.length; i++) {
            var block = blocks[i];

            if (block.isSelected) {
                this.deselect(block);
            }
            else {
                this.select(block);
            }
        }
    }

    p.copy = function() {
        this.clipboard = [];

        for (var i=0; i<this.selectedBlocks.length; i++) {
            var block = this.selectedBlocks[i];

            if (block.category != 'root') {
                this.clipboard.push(block)
            }
        }
    }
    p.cut = function() {
        this.clipboard = [];

        for (var i=0; i<this.selectedBlocks.length; i++) {
            var block = this.selectedBlocks[i];

            if (block.category != 'root') {
                this.view.removeBlock(block);
                this.clipboard.push(block)
            }
        }
        this.selectedBlocks = [];
    }
    p.paste = function() {
        var newBlocks = [];
        for (var i=0; i<this.clipboard.length; i++) {
            var block = this.clipboard[i];

            // Copy the block
            var newBlock = block.copy();
            newBlock.displayObject.x += 50;
            newBlock.displayObject.y += 50;

            // Add block to container
            this.view.blocks.push(newBlock)
            this.view.ui.layerBlocks.addChild(newBlock.displayObject);
            newBlocks.push(newBlock);
        }

        // Copy connections
        // TODO: cubic complexity here! How to make it better?
        for (var i=0; i<this.clipboard.length; i++) {
            var oldBlock = this.clipboard[i];
            var newBlock = newBlocks[i];

            for (var j=0; j<oldBlock.outConnections.length; j++) {
                for (var k=0; k<this.clipboard.length; k++) {
                    if (oldBlock.outConnections[j].outBlock === this.clipboard[k]) {
                        this.view.addConnection(newBlock, newBlocks[k]);
                        break;
                    }
                }
            }
        }

        // Deselect old blocks and select the new ones
        this.deselectAll();
        for (var i=0; i<newBlocks.length; i++) {
            this.select(newBlocks[i]);
        }

        console.log(newBlocks);
        this.snap(newBlocks);
    }
    p.remove = function() {
        var root = null;
        for (var i=0; i<this.selectedBlocks.length; i++) {
            if (this.selectedBlocks[i].category == 'root') {
                root = this.selectedBlocks[i];
            } else {
                this.view.removeBlock(this.selectedBlocks[i]);
            }
        }

        this.deselectAll();
        if (root) {
            this.select(root);
        }
    }

    p.removeConnections = function() {
        for (var i=0; i<this.selectedBlocks.length; i++) {
            var block = this.selectedBlocks[i];

            if (block.inConnection) {
                this.view.removeConnection(block.inConnection);
            }

            if (block.outConnections.length > 0) {
                for (var j=block.outConnections.length-1; j>=0; j--) {
                    this.view.removeConnection(block.outConnections[j]);
                }
            }
        }
    }
    p.removeInConnections = function() {
        for (var i=0; i<this.selectedBlocks.length; i++) {
            var block = this.selectedBlocks[i];

            if (block.inConnection) {
                this.view.removeConnection(block.inConnection);
            }
        }
    }
    p.removeOutConnections = function() {
        for (var i=0; i<this.selectedBlocks.length; i++) {
            var block = this.selectedBlocks[i];

            if (block.outConnections.length > 0) {
                for (var j=block.outConnections.length-1; j>=0; j--) {
                    this.view.removeConnection(block.outConnections[j]);
                }
            }
        }
    }

    p.zoomIn = function() {
        var min = this.view.settings.get('zoom_min');
        var max = this.view.settings.get('zoom_max');
        var step = this.view.settings.get('zoom_step');
        
        var zoom = this.view.ui.camera.scaleX;
        this.view.zoom(creatine.clip(zoom+step, min, max));
    }
    p.zoomOut = function() {
        var min = this.view.settings.get('zoom_min');
        var max = this.view.settings.get('zoom_max');
        var step = this.view.settings.get('zoom_step');
        
        var zoom = this.view.ui.camera.scaleX;
        this.view.zoom(creatine.clip(zoom-step, min, max));
    }

b3editor.Editor = Editor;
}());
