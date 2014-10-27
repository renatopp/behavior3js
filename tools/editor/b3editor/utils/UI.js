this.b3editor = this.b3editor || {};

(function() {
    "use strict";

var UI = function(view, editor) {
    this.initialize(view, editor);
}
var p = UI.prototype;

    p.initialize = function(view, editor) {
        this.editor = editor;
        this.view = view;

        this.nodeList = $('#node-list');
    };

    // NODE LIST ==============================================================
    p._createHeader = function(category) {
        var header = $('<li class="header"><a href="#">'+category+'</a></li>');
        return header;
    }
    p._createItem = function(title, name) {
        var item = $('<li class="item"></li>');
        var link = $('<a href="#">'+title+'</a>');
        link.attr('data-name', name);
        link.attr('id', 'node-'+name);
        // link.attr('draggable', true);
        // link.on('dragstart', onNodeListDragStart);

        item.append(link);
        return item;
    }
    p._createCategory = function(category) {
        // this.addHeaderToList(category);
        var header = this._createHeader(category);
        var items = $('<ul></ul>');

        for (var id in this.view.nodes) {
            var node = this.view.nodes[id];

            if (node.prototype.category == category) {
                var item = this._createItem(
                    node.prototype.title || node.prototype.name,
                    node.prototype.name
                );
                items.append(item);
            }
        }
        header.append(items);
        return header;
    }

    p.createList = function() {
        var list = $('<ul id="node-list"><ul>')
        list.append(this._createCategory('composite'));
        list.append(this._createCategory('decorator'));
        list.append(this._createCategory('condition'));
        list.append(this._createCategory('action'));

        return list;
    }
    // ========================================================================

b3editor.UI = UI;
}());
