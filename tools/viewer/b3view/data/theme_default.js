this.b3view = this.b3view || {};

(function() {
    "use strict";

var THEME_DEFAULT = {
    symbol_template         : 'libs/symbols/{category}.svg',
    
    // CANVAS
    background_color        : '#171717',
    
    // SELECTION
    selection_color         : '#4bb2fd',
    
    // BLOCK
    block_background_color  : '#EFEFEF',
    block_border_color      : '#6d6d6d',
    block_symbol_color      : '#333',
    
    // ANCHOR
    anchor_background_color : '#EFEFEF',
    anchor_border_color     : '#6d6d6d',
    
    // CONNECTION
    connection_color        : '#6d6d6d',
}

b3view.THEME_DEFAULT = THEME_DEFAULT;
}());
