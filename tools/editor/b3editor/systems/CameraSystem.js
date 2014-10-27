this.b3editor = this.b3editor || {};

(function() {
    "use strict";

var CameraSystem = function(view, editor) {
    this.initialize(view, editor);
}

var p = CameraSystem.prototype;

    p.initialize = function(view, editor) {
        this.view = view;
        this.editor = editor;

        this.isDragging = false;
        this.offsetX = 0;
        this.offsetY = 0;

        var this_ = this;
        this.view.ui.stage.on('stagemousedown', this.onMouseDown, this);
        this.view.ui.stage.on('stagemousemove', this.onMouseMove, this);
        this.view.ui.stage.on('stagemouseup', this.onMouseUp, this);
        this.view.ui.canvas.addEventListener('mousewheel', function(event) {
            this_.onMouseWheel(event)
        });
        this.view.ui.canvas.addEventListener('DOMMouseScroll ', function(event) {
            this_.onMouseWheel(event)
        }, false);
    };

    p.onMouseDown = function(event) {
        var ui = this.view.ui;

        if (event.nativeEvent.which !== 2) return;
        $(ui.canvas).addClass('grabbing');
        

        this.isDragging = true;
        this.offsetX = ui.stage.mouseX - ui.camera.x;
        this.offsetY = ui.stage.mouseY - ui.camera.y;
    };

    p.onMouseMove = function(event) {
        if (!this.isDragging) return;

        var ui = this.view.ui;
        ui.camera.x = ui.stage.mouseX - this.offsetX;
        ui.camera.y = ui.stage.mouseY - this.offsetY;
    };

    p.onMouseUp = function(event) {
        if (event.nativeEvent.which !== 2) return;

        $(this.view.ui.canvas).removeClass('grabbing');

        this.isDragging = false;
        this.offsetX = 0;
        this.offsetY = 0;
    };

    p.onMouseWheel = function(event) {
        var ui = this.view.ui;

        if (event.wheelDeltaY > 0) {
            this.editor.zoomIn();
        } else {
            this.editor.zoomOut();
        }
    }

b3editor.CameraSystem = CameraSystem;
}());
