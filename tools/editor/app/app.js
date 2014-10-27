this.app = this.app || {};
this.app.dom = this.app.dom || {};

(function() {
"use strict";

app.initialize = function() {
    // create the constants
    app.initializeConstants();
    
    // inserting html documents
    app.initializeHTML();

    // load view and editor
    app.initializeEditor();

    // load javascript plugins
    app.initializePlugins();
}

app.initializeConstants = function() {
    // keys already added to editor constants
    app.KEY_MAP = {
        'key_select_all'       : app.events.onButtonSelectAll,
        'key_deselect_all'     : app.events.onButtonDeselectAll,
        'key_invert_selection' : app.events.onButtonInvertSelection,
        'key_copy'             : app.events.onButtonCopy,
        'key_cut'              : app.events.onButtonCut,
        'key_paste'            : app.events.onButtonPaste,
        'key_remove'           : app.events.onButtonRemove,
        'key_organize'         : app.events.onButtonAutoOrganize,
        'key_zoom_in'          : app.events.onButtonZoomIn,
        'key_zoom_out'         : app.events.onButtonZoomOut,
        'key_new_tree'         : app.events.onButtonNewTree,
        'key_import_tree'      : app.events.onButtonImportTree,
        'key_export_tree'      : app.events.onButtonExportTree,
    }
}

app.initializeHTML = function() {
    var page = $('#page');

    try {
        !!localStorage.getItem;
    } catch (error) {
        window.localStorage = {}
    }

    if (typeof(localStorage['b3editor.firsttime']) === 'undefined') {
        localStorage['b3editor.firsttime'] = 'true';
    }


    // append all views to the page
    for (var key in loader._loadedResults) {
        if (key.indexOf('view') === 0) {
            page.append(loader.getResult(key));
        }
    }

    app.dom.page                     = $('#page');

    // canvas
    app.dom.gameCanvas               = $('#game-canvas');
    
    // panels
    app.dom.nodesPanel               = $('#nodes-panel');
    app.dom.propertiesPanel          = $('#properties-panel');
    app.dom.propertiesAlternatePanel = $('#properties-panel-alternate');
    app.dom.helpPanel                = $('#help-panel');
    
    // dynamic components
    app.dom.nodesComp                = null; // assigned on the updateNodes
    // app.dom.properties      = $('#properties-panel');
    // app.dom.properties_al   = $('#properties-panel-alternate');
    // app.dom.help            = $('#help-panel');

    // static components
    app.dom.exportEntry              = $('#export-entry'); // assigned on the updateNodes
    app.dom.importEntry              = $('#import-entry'); // assigned on the updateNodes
    app.dom.addNodeTable             = $('#addnode-table'); // assigned on the updateNodes
    app.dom.editNodeTable            = $('#editnode-table'); // assigned on the updateNodes
}

app.initializeEditor = function() {
    // Initialize view and editor
    app.view = new b3view.View(app.dom.gameCanvas.get(0));
    app.editor = new b3editor.Editor(app.view);
    app.block = null; // setted on selection
    app.view.fullscale();

    // Link selection callbacks
    app.editor.on('blockselect', app.events.onBlockSelect);
    app.editor.on('blockdeselect', app.events.onBlockDeselect);
    // Populate node list
    app.helpers.updateNodes();
    app.helpers.updateShortcuts();

    if (localStorage['b3editor.firsttime'] === 'true') {
        localStorage['b3editor.firsttime'] = 'false';
        $('#modalFirstTime').foundation('reveal', 'open');
    }
}

app.initializePlugins = function() {
    $('.nano').nanoScroller();
    $(document).foundation();
    // $(document).foundation('joyride', 'start');
    $.notify.defaults({
        // whether to hide the notification on click
        clickToHide: true,
        // whether to auto-hide the notification
        autoHide: true,
        // if autoHide, hide after milliseconds
        autoHideDelay: 5000,
        // show the arrow pointing at the element
        arrowShow: true,
        // arrow size in pixels
        arrowSize: 5,
        // default positions
        elementPosition: 'bottom left',
        globalPosition: 'bottom center',
        // default style
        style: 'bootstrap',
        // default class (string or [string])
        className: 'error',
        // show animation
        showAnimation: 'slideDown',
        // show animation duration
        showDuration: 400,
        // hide animation
        hideAnimation: 'slideUp',
        // hide animation duration
        hideDuration: 200,
        // padding between element and notification
        gap: 2
    })
}

})();