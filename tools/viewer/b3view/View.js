this.b3view = this.b3view || {};

(function() {
    "use strict";

var View = function(canvas) {
    this.initialize(canvas)
}
var p = View.prototype = new createjs.EventDispatcher;

    p.initialize = function(canvas) {
        this.settings = new b3view.SettingsManager();
        this.settings.load(b3view.OPTIONS);
        this.settings.load(b3view.THEME_DEFAULT);
        this.settings.load(b3view.THEME_DARK);
        
        this.ui          = new b3view.UI(this, canvas);
        this.organizer   = new b3view.Organizer(this);
        
        this.blocks      = [];
        this.connections = [];
        this.nodes       = {};
        this.symbols     = {};
        this.shapes      = {};

        // register shape
        this.registerShape('root',      b3view.draw.rootShape);
        this.registerShape('composite', b3view.draw.compositeShape);
        this.registerShape('decorator', b3view.draw.decoratorShape);
        this.registerShape('condition', b3view.draw.conditionShape);
        this.registerShape('action',    b3view.draw.actionShape);

        // register symbol
        this.registerSymbol('Root',         b3view.draw.rootSymbol);
        this.registerSymbol('Sequence',     b3view.draw.sequenceSymbol);
        this.registerSymbol('MemSequence',  b3view.draw.memsequenceSymbol);
        this.registerSymbol('Priority',     b3view.draw.prioritySymbol);
        this.registerSymbol('MemPriority',  b3view.draw.memprioritySymbol);

        this.defaultNodes = [
            b3view.Root,
            b3.Sequence,
            b3.Priority,
            b3.MemSequence,
            b3.MemPriority,
            b3.Repeater,
            b3.RepeatUntilFailure,
            b3.RepeatUntilSuccess,
            b3.MaxTime,
            b3.Inverter,
            b3.Limiter,
            b3.Failer,
            b3.Succeeder,
            b3.Runner,
            b3.Error,
            b3.Wait
        ];
        // register node
        for (var i = 0; i < this.defaultNodes.length; i++) {
            this.registerNode(this.defaultNodes[i]);
        };
        

        this.reset();
        this.center();
        this.update();
    }

    p.center = function() {
        var hw = this.ui.canvas.width/2;
        var hh = this.ui.canvas.height/2;
        this.setcam(hw, hh);
    }

    p.fullscale = function() {
        this.ui.display.scaleMode = creatine.STRETCH;
        this.ui.display.refresh();
        this.center();
    }

    p.registerNode = function(node) {
        // TODO: raise error if node is invalid
        var name = node.prototype.name;
        this.nodes[name] = node;
    }
    p.registerSymbol = function(category, symbol) {
        if (!symbol) 
            symbol = category;

        this.symbols[category] = symbol;
    }
    p.registerShape = function(name, image) {
        this.shapes[name] = image;
    }

    p.getLocalMousePosition = function() {
        return this.ui.camera.globalToLocal(
            this.ui.stage.mouseX,
            this.ui.stage.mouseY
        )
    }
    p.getRoot = function() {
        for (var i=0; i<this.blocks.length; i++) {
            if (this.blocks[i].category == 'root') {
                return this.blocks[i];
            }
        }
    }
    p.getBlockUnder = function(x, y) {
        if (!x || !y) {
            var point = this.getLocalMousePosition();
            x = point.x;
            y = point.y;
        }

        // Get block under the mouse
        for (var i=this.blocks.length-1; i>=0; i--) {
            var block = this.blocks[i];

            // Verify collision
            if (block.hitTest(x, y)) {
                return block;
            }
        }
    };
    p.getBlockById = function(id) {
        for (var i=0; i<this.blocks.length; i++) {
            var block = this.blocks[i];
            if (block.id == id) {
                return block;
            }
        }
    }

    p.applySettings = function() {
        var settings = this.settings;
        this.ui.applySettings(settings);
        for (var i=0; i<this.blocks.length; i++) {
            this.blocks[i].applySettings(settings);
        }
        for (var i=0; i<this.connections.length; i++) {
            this.connections[i].applySettings(settings);
        }
    }
    p.update = function() {
        this.ui.stage.update();
    }
    p.reset = function(all) {
        // REMOVE BLOCKS
        for (var i=0; i<this.blocks.length; i++) {
            var block = this.blocks[i];

            this.ui.layerBlocks.removeChild(block.displayObject);
        }
        this.blocks = [];

        // REMOVE CONNECTIONS
        for (var i=0; i<this.connections.length; i++) {
            var conn = this.connections[i];

            this.ui.layerConnections.removeChild(conn.displayObject);
        }
        this.connections = [];

        this.ui.camera.x = 0;
        this.ui.camera.y = 0;
        this.ui.camera.scaleX = 1;
        this.ui.camera.scaleY = 1;

        if (!all) {
            this.addBlock('Root', 0, 0);
        }
    }
    p.importFromJSON = function(json) {
        this.reset();

        var data = JSON.parse(json);
        var dataRoot = null;

        if (data.custom_nodes) {
            for (var i = 0; i < data.custom_nodes.length; i++) {
                var template = data.custom_nodes[i];
                if (!this.nodes[template.name]) { //If the node does'nt allready exist
                    this.createNodeType(template);
                }   
            };
        }
        

        // Nodes
        for (var id in data.nodes) {
            var spec = data.nodes[id];
            var block = this.addBlock(spec.name, spec.display.x, spec.display.y);
            block.id = spec.id;
            block.title = spec.title;
            block.description = spec.description;
            block.parameters = spec.parameters;
            block.properties = spec.properties;
            block.redraw();

            if (block.id === data.root) {
                dataRoot = block;
            }
        }

        // Connections
        for (var id in data.nodes) {
            var spec = data.nodes[id];
            var inBlock = this.getBlockById(id);

            var children = null;
            if (inBlock.category == 'composite' && spec.children) {
                children = spec.children;
            }
            else if (inBlock.category == 'decorator' && spec.child ||
                     inBlock.category == 'root' && spec.child) {
                children = [spec.child]
            }
            
            if (children) {
                for (var i=0; i<children.length; i++) {
                    var outBlock = this.getBlockById(children[i]);
                    this.addConnection(inBlock, outBlock);
                }
            }
        }

        if (dataRoot) {
            this.addConnection(this.getRoot(), dataRoot);
        }

        this.ui.camera.x      = data.display.camera_x;
        this.ui.camera.y      = data.display.camera_y;
        this.ui.camera.scaleX = data.display.camera_z;
        this.ui.camera.scaleY = data.display.camera_z;
    }
    p.exportToJSON = function() {
        var root = this.getRoot();
        var data = {};

        // Tree data
        data.title       = root.title;
        data.description = root.description;
        data.root        = root.getOutNodeIds()[0] || null;
        data.display     = {
            'camera_x' : this.ui.camera.x,
            'camera_y' : this.ui.camera.y,
            'camera_z' : this.ui.camera.scaleX,
            'x'        : root.displayObject.x,
            'y'        : root.displayObject.y
        }
        data.properties  = root.properties;
        data.nodes       = {};

        data.custom_nodes = [];
        for(var key in this.nodes) {
            var node = this.nodes[key];
            if (this.defaultNodes.indexOf(node) === -1) {
                var item = {
                    "name" : node.prototype.name,
                    "title" : node.prototype.title,
                    "category": node.prototype.category,
                };
                data.custom_nodes.push(item);
            }
            
        }

        // Node Spec
        for (var i=0; i<this.blocks.length; i++) {
            var block = this.blocks[i];

            if (block.category === 'root') continue;

            var spec = {};
            spec.id          = block.id,
            spec.name        = block.name,
            spec.title       = block.title,
            spec.description = block.description;
            spec.display     = {
                'x' : block.displayObject.x,
                'y' : block.displayObject.y
            }
            spec.parameters  = block.parameters;
            spec.properties  = block.properties;

            var children = block.getOutNodeIds();
            if (block.category == 'composite') {
                spec.children = children;
            } else if (block.category == 'decorator' || block.category == 'root') {
                spec.child = children[0] || null;
            }

            data.nodes[block.id] = spec;
        }

        return JSON.stringify(data, null, 4);
    }
    p.importFromTree = function(tree) {
        this.reset();

        // Update tree information on root node
        var root = this.getRoot();
        root.id = tree.id;
        root.title = tree.title;
        root.description = tree.description;
        root.properties = tree.properties;

        // Create nodes
        var stack = [tree.root];
        var blocks = {}



        while (stack.length > 0) {
            var node = stack.pop();

            var block = new b3view.Block(this, node);
            this.blocks.push(block);
            this.ui.layerBlocks.addChild(block.displayObject);
            block.id = node.id;
            blocks[block.id] = block;
            
            if (node.category === b3.COMPOSITE && node.children) {
                for (var i=node.children.length-1; i>=0; i--) {
                    stack.push(node.children[i]);
                }
            } else if (node.category === b3.DECORATOR && node.child) {
                stack.push(node.child);
            }
        }
        // Create connections
        var stack = [tree.root];
        while (stack.length > 0) {
            var node = stack.pop();

            var inBlock = blocks[node.id];
            
            if (node.category === b3.COMPOSITE && node.children) {
                for (var i=0; i<node.children.length; i++) {
                    var c = node.children[i];
                    var outBlock = blocks[c.id];
                    this.addConnection(inBlock, outBlock);
                    stack.push(c);
                }
            } else if (node.category === b3.DECORATOR && node.child) {
                var outBlock = blocks[node.child.id];
                this.addConnection(inBlock, outBlock);
                stack.push(node.child);
            }
        }

        // Set connection to the root
        this.addConnection(root, blocks[tree.root.id]);

        // Organize them all
        this.organize(true);
        // Configura screen
    };

    p.createNodeType = function(template) {
          var classes = {
            'composite' : b3.Composite,
            'decorator' : b3.Decorator,
            'condition' : b3.Condition,
            'action' : b3.Action,
          };
          var category = template.category;
          var cls = classes[category];
          
          var tempClass = b3.Class(cls);
          tempClass.prototype.name = template.name;
          tempClass.prototype.title = template.title;
          
          this.registerNode(tempClass);
    };

    p.addBlock = function(name, x, y) {
        x = x || 0;
        y = y || 0;

        if (typeof name == 'string') {
            var node = this.nodes[name];
        } else {
            var node = name;
        }

        var block = new b3view.Block(this, node);
        block.displayObject.x = x;
        block.displayObject.y = y;

        this.blocks.push(block);
        this.ui.layerBlocks.addChild(block.displayObject);

        return block;
    }

    p.addConnection = function(inBlock, outBlock) {
        var connection = new b3view.Connection(this);

        if (inBlock) {
            connection.addInBlock(inBlock);
            inBlock.addOutConnection(connection);
        }

        if (outBlock) {
            connection.addOutBlock(outBlock);
            outBlock.addInConnection(connection);
        }

        this.connections.push(connection);
        this.ui.layerConnections.addChild(connection.displayObject);

        connection.redraw();

        return connection;
    }
    p.removeBlock = function(block) {
        var index = this.blocks.indexOf(block);
        if (index > -1) this.blocks.splice(index, 1);


        if (block.inConnection) {
            this.removeConnection(block.inConnection);
        }

        if (block.outConnections.length > 0) {
            for (var i=block.outConnections.length-1; i>=0; i--) {
                this.removeConnection(block.outConnections[i]);
            }
        }

        this.ui.layerBlocks.removeChild(block.displayObject);
    }
    p.removeConnection = function(connection) {
        if (connection.inBlock) {
            connection.inBlock.removeOutConnection(connection);
            connection.removeInBlock();
        }

        if (connection.outBlock) {
            connection.outBlock.removeInConnection();
            connection.removeOutBlock();
        }

        var index = this.connections.indexOf(connection);
        if (index > -1) this.connections.splice(index, 1);

        this.ui.layerConnections.removeChild(connection.displayObject);
    }

    p.zoom = function(factor) {
        this.ui.camera.scaleX = factor;
        this.ui.camera.scaleY = factor;
    }
    p.pan = function(x, y) {
        this.ui.camera.x += x;
        this.ui.camera.y += y;
    }
    p.setcam = function(x, y) {
        this.ui.camera.x = x;
        this.ui.camera.y = y;
    }
    p.organize = function(orderByIndex) {
        this.organizer.organize(this.getRoot(), orderByIndex);
    }

b3view.View = View;
}());
