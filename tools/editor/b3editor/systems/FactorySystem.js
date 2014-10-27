this.b3editor = this.b3editor || {};

(function() {
    "use strict";

var FactorySystem = function(view, editor) {
    this.initialize(view, editor);
}
var p = FactorySystem.prototype;

    p.initialize = function(view) {
        this.view = view;

        // this.view.ui.stage.on('stagemouseup', this.onMouseUp, this);
        // $(this.view.ui.canvas).on('mouseout', this.onMouseLeave);
        // $(this.view.ui.canvas).on('dragover', this.onMouseLeave);

    };

    p.onMouseMove = function(x, y) {
        if (!this.editor.insertingBlockId) return;
        this.view.addBlock(this.editor.insertingBlockId, x, y);

        // var node = this.view.nodes[this.view.insertingBlockId];
        // console.log(node)

        // for (var i=0; i<this.view.nodes.length; i++) {
        //     var node = this.view.nodes[i];

        //     if (node.id == this.view.insertingBlockId) {
        //         this.view.addBlock(node, x, y);
        //         break;
        //     }
        // }
        this.editor.insertingBlockId = null;
    };

    p.onMouseLeave = function(event) {
        console.log(event);
    }
    p.onMouseUp = function(event) {
        console.log(event);
    }

b3editor.FactorySystem = FactorySystem;
}());
