this.app = this.app || {};
this.app.helpers = this.app.helpers || {};

(function() {
"use strict";

/* PANELS ================================================================== */
app.helpers.updateNodes = function() {
    var list = app.editor.ui.createList();
    app.dom.nodesPanel.html(list);
    app.dom.nodesComp = $('#node-list');

    app.helpers._updateCollapsable();
    app.helpers._updateDraggable();
    app.helpers._updateDroppable();

    $('li.item a', app.dom.nodesComp).each(function() {
      var link = $(this);

      var name = link.attr('data-name');
      if (b3[name]) return; // if node in b3, do not edit

      var edit = $('<a href="#" class="edit right">Edit</a>');

      edit.hide();
      edit.click(function(e) {
        app.events.onOpenEditNodeModal(e);
      });
      edit.attr('data-reveal-id', 'modalEditNode');
      link.addClass('node');
      link.append(edit);

      link.hover(function() {
        edit.toggle();
      });
    })
}
app.helpers.updateProperties = function(block) {
    if (app.block) {
        app.helpers.updateBlock();
    }

    app.block = block;

    if (!block) {
      app.dom.propertiesPanel.hide();
      app.dom.propertiesAlternatePanel.show();
    } else {
      app.dom.propertiesPanel.show();
      app.dom.propertiesAlternatePanel.hide();

      $('#title', app.dom.propertiesPanel).val(block.title);
      $('#description', app.dom.propertiesPanel).val(block.description);

      var params = $('#parameters-table', app.dom.propertiesPanel);
      app.helpers.remAllEditableRows(params);
      for (var k in block.parameters) {
        app.helpers.addEditableRow(params, k, block.parameters[k]);
      }

      var propers = $('#properties-table', app.dom.propertiesPanel);
      app.helpers.remAllEditableRows(propers);
      for (var k in block.properties) {
        app.helpers.addEditableRow(propers, k, block.properties[k]);
      }
    }
}
app.helpers.updateHelp = function() {

}
/* ========================================================================= */

/* ========================================================================= */
app.helpers.updateBlock = function() {
    if (!app.block) return;

    var title = $('#title', app.dom.propertiesPanel).val();
    var description = $('#description', app.dom.propertiesPanel).val();

    var params = {}
    $('#parameters-table > .editable-row', app.dom.propertiesPanel).each(function() {
        var row = $(this);
        var key = $('.key > input', row).val();
        var value = $('.value > input', row).val();

        if ($.isNumeric(value)) {
          value = parseFloat(value);
        }

        if (key) {
          params[key] = value;
        }
    });

    var props = {}
    $('#properties-table > .editable-row', app.dom.propertiesPanel).each(function() {
        var row = $(this);
        var key = $('.key > input', row).val();
        var value = $('.value > input', row).val();

        if ($.isNumeric(value)) {
          value = parseFloat(value);
        }

        if (key) {
          props[key] = value;
        }
    });

    app.block.title = title;
    app.block.description = description;
    app.block.parameters = params;
    app.block.properties = props;
    app.block.redraw();
}
/* ========================================================================= */

/* EDITABLE TABLES ========================================================= */
app.helpers.addEditableRow = function(table, key, value) {
    key = key || '';
    value = value || '';

    var row = $('<div class="editable-row"></div>');
    var colKey = $('<div class="editable-col key"><input type="text" placeholder="Key" value="'+key+'"></div>');
    var colVal = $('<div class="editable-col value"><input type="text" placeholder="Value" value="'+value+'"></div>');
    var colOp = $('<div class="editable-col operator"><input type="button" class="operator" value="-"></div>');

    colOp.click(app.events.onRemEditableRow);

    row.append(colKey);
    row.append(colVal);
    row.append(colOp);
    row.hide();
    row.fadeIn(100);

    // $('input', row).change(app.events.onPropertyChange);

    table.append(row);
}
app.helpers.remEditableRow = function(row) {
  row.remove();
  app.helpers.updateBlock();
}
app.helpers.remAllEditableRows = function(table) {
  table.html('');
}

app.helpers.addDynamicRow = function(table) {
    var row = $('<tr></tr>');
    var colKey = $('<td><input id="name" type="text" placeholder="Node name" value=""></td>');
    var colVal = $('<td><input id="title" type="text" placeholder="Node title" value=""></td>');
    var colCat = $('<td><select id="category"><option value="composite">Composite</option><option value="decorator">Decorator</option><option value="condition">Condition</option><option value="action" selected>Action</option></select></td>');
    var colOp = $('<td class="operator"><input type="button" class="operator" value="-"></td>');

    colOp.click(app.events.onRemDynamicRow);

    row.append(colKey);
    row.append(colVal);
    row.append(colCat);
    row.append(colOp);
    row.hide();
    row.fadeIn(100);

    table.append(row);
}
app.helpers.remDynamicRow = function(row) {
  row.remove();
}
app.helpers.resetDynamicTable = function(table) {
  table.html('');
  app.helpers.addDynamicRow(table);
  app.helpers.addDynamicRow(table);
  app.helpers.addDynamicRow(table);
}
app.helpers.addCustomNodes = function(table) {
  var classes = {
    'composite' : b3.Composite,
    'decorator' : b3.Decorator,
    'condition' : b3.Condition,
    'action' : b3.Action,
  }

  $('tr', table).each(function() {
    var name = $('#name', this).val();
    var title = $('#title', this).val();
    var category = $('#category', this).val();
    var cls = classes[category];

    if (!name) return;

    if (app.view.nodes[name]) {
        app.helpers.alert('error', 'Node name "'+name+'" already registered.');
        return;
    }
    var tempClass = b3.Class(cls);
    tempClass.prototype.name = name;
    tempClass.prototype.title = title;
    
    app.view.registerNode(tempClass);
  });

  app.helpers.updateNodes();
}

app.helpers.addCustomNode = function(option) {
  var classes = {
    'composite' : b3.Composite,
    'decorator' : b3.Decorator,
    'condition' : b3.Condition,
    'action' : b3.Action,
  };
  var category = option.category;
  var cls = classes[category];
  
  var tempClass = b3.Class(cls);
  tempClass.prototype.name = option.name;
  tempClass.prototype.title = option.title;
  app.view.registerNode(tempClass);

  app.helpers.updateNodes();
};
/* ========================================================================= */

/* ========================================================================= */
app.helpers.alert = function(type, message) {
  $.notify(message, type);
}
/* ========================================================================= */

/* MENU ==================================================================== */
app.helpers.updateShortcuts = function() {
  for (var k in app.view.settings._dict) {
    if (k.indexOf('key_') == 0) {
      var value = app.view.settings.get(k);
      $('#'+k).html(value);

      var callback = app.KEY_MAP[k];
      if (callback) {
          key(value, callback);
      }
    }
  }
}
/* ========================================================================= */

/* JS PLUGINS ============================================================== */
app.helpers._updateCollapsable = function() {
    app.dom.nodesComp.collapsable();
}

app.helpers._updateDraggable = function() {
    $('li.item > a', app.dom.nodesComp).draggable({
      cursorAt : {top: 100, left: 200},
      appendTo : "body",
      helper   : app.events.onNodeDrag
    });
}
app.helpers._updateDroppable = function() {
    app.dom.gameCanvas.droppable({
      greedy : true,
      drop   : app.events.onNodeDrop
    });

}
/* ========================================================================= */

})();