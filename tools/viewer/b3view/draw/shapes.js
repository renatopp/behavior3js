this.b3view = this.b3view || {};
this.b3view.draw = this.b3view.draw || {};

(function() {
    "use strict";

var makeAnchor = function(shape, x, y, radius, bg_color, border_width, border_color) {
    shape.graphics.beginFill(bg_color);
    shape.graphics.setStrokeStyle(border_width, 'round');
    shape.graphics.beginStroke(border_color);
    shape.graphics.drawCircle(x, y, radius);
    shape.graphics.endStroke();
    shape.graphics.endFill();
}

var makeRect = function(shape, w, h, radius, bg_color, border_width, border_color) {
    shape.graphics.beginFill(bg_color);
    shape.graphics.setStrokeStyle(border_width, 'round');
    shape.graphics.beginStroke(border_color);
    shape.graphics.drawRoundRect(-w/2, -h/2, w, h, radius);
    shape.graphics.endStroke();
    shape.graphics.endFill();
}

var makeEllipse = function(shape, w, h, bg_color, border_width, border_color) {
    shape.graphics.beginFill(bg_color);
    shape.graphics.setStrokeStyle(border_width, 'round');
    shape.graphics.beginStroke(border_color);
    // shape.graphics.drawRoundRect(-w/2, -h/2, w, h, 75);
    shape.graphics.drawEllipse(-w/2, -h/2, w, h);
    shape.graphics.endStroke();
    shape.graphics.endFill();
}

var makeRhombus = function(shape, w, h, bg_color, border_width, border_color) {
    shape.graphics.beginFill(bg_color);
    shape.graphics.setStrokeStyle(border_width, 'round');
    shape.graphics.beginStroke(border_color);
    shape.graphics.moveTo(0, h/2);
    shape.graphics.lineTo(w/2, 0);
    shape.graphics.lineTo(0, -h/2);
    shape.graphics.lineTo(-w/2, 0);
    shape.graphics.lineTo(0, h/2);
    // shape.graphics.drawRoundRect(-w/2, -h/2, w, h, 75);
    // shape.graphics.drawEllipse(-w/2, -h/2, w, h);
    shape.graphics.endStroke();
    shape.graphics.endFill();
}

b3view.draw.rootShape = function(block, settings) {
    var w = block._width;
    var h = block._height;
    var anchorOffsetX = settings.get('anchor_offset_x');
    var shape = block._shapeObject;

    makeAnchor(shape, w/2+anchorOffsetX, 0, 
        settings.get('anchor_radius'),
        settings.get('anchor_background_color'),
        settings.get('anchor_border_width'),
        settings.get('anchor_border_color')
    );
    makeRect(shape, w, h, 15,
        settings.get('block_background_color'),
        settings.get('block_border_width'),
        settings.get('block_border_color')
    );
}

b3view.draw.compositeShape = function(block, settings) {
    var bounds = block._symbolObject.getBounds();
    var _width = 0;

    if (bounds) { _width = bounds.width+20; }

    var w = Math.max(_width, block._width);
    var h = block._height;
    var anchorOffsetX = settings.get('anchor_offset_x');
    var shape = block._shapeObject;
    block._width = w;
    block._height = h;

    makeAnchor(shape, -w/2-anchorOffsetX, 0, 
        settings.get('anchor_radius'),
        settings.get('anchor_background_color'),
        settings.get('anchor_border_width'),
        settings.get('anchor_border_color')
    )
    makeAnchor(shape, w/2+anchorOffsetX, 0, 
        settings.get('anchor_radius'),
        settings.get('anchor_background_color'),
        settings.get('anchor_border_width'),
        settings.get('anchor_border_color')
    )
    makeRect(shape, w, h, 15,
        settings.get('block_background_color'),
        settings.get('block_border_width'),
        settings.get('block_border_color')
    )
}

b3view.draw.decoratorShape = function(block, settings) {
    var bounds = block._symbolObject.getBounds();

    var w = Math.max(bounds.width+40, block._width);
    var h = Math.max(bounds.height+50, block._height);
    var anchorOffsetX = settings.get('anchor_offset_x');
    var shape = block._shapeObject;
    block._width = w;
    block._height = h;

    makeAnchor(shape, -w/2-anchorOffsetX, 0, 
        settings.get('anchor_radius'),
        settings.get('anchor_background_color'),
        settings.get('anchor_border_width'),
        settings.get('anchor_border_color')
    )
    makeAnchor(shape, w/2+anchorOffsetX, 0, 
        settings.get('anchor_radius'),
        settings.get('anchor_background_color'),
        settings.get('anchor_border_width'),
        settings.get('anchor_border_color')
    )
    makeRhombus(shape, w, h, 15,
        settings.get('block_background_color'),
        settings.get('block_border_width'),
        settings.get('block_border_color')
    )
}

b3view.draw.actionShape = function(block, settings) {

    var bounds = block._symbolObject.getBounds();

    // var w = block._width;
    // var h = block._height;
    var w = Math.max(bounds.width+15, block._width);
    var h = Math.max(bounds.height+15, block._height);
    var anchorOffsetX = settings.get('anchor_offset_x');
    var shape = block._shapeObject;
    block._width = w;
    block._height = h;

    makeAnchor(shape, -w/2-anchorOffsetX, 0, 
        settings.get('anchor_radius'),
        settings.get('anchor_background_color'),
        settings.get('anchor_border_width'),
        settings.get('anchor_border_color')
    )
    makeRect(shape, w, h, 15,
        settings.get('block_background_color'),
        settings.get('block_border_width'),
        settings.get('block_border_color')
    );
}

b3view.draw.conditionShape = function(block, settings) {
    var bounds = block._symbolObject.getBounds();

    var w = Math.max(bounds.width+15, block._width);
    var h = Math.max(bounds.height+15, block._height);
    var anchorOffsetX = settings.get('anchor_offset_x');
    var shape = block._shapeObject;
    block._width = w;
    block._height = h;

    makeAnchor(shape, -w/2-anchorOffsetX, 0, 
        settings.get('anchor_radius'),
        settings.get('anchor_background_color'),
        settings.get('anchor_border_width'),
        settings.get('anchor_border_color')
    )
    makeEllipse(shape, w, h, 
        settings.get('block_background_color'),
        settings.get('block_border_width'),
        settings.get('block_border_color')
    );
}

}());
