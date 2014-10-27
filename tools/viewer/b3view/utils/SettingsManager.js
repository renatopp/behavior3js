this.b3view = this.b3view || {};

(function() {
    "use strict";

/**
 *  SettingsManager
**/
var SettingsManager = function() {
    this.initialize();
}

var p = SettingsManager.prototype;

    p.initialize = function() {
        this._dict = {};
    }

    p.clear = function() {
        this._dict = {};
    };
    p.set = function(key, value) {
        this._dict[key] = value;
    };
    p.get = function(key) {
        return this._dict[key]
    };
    p.load = function(data) {
        for (var key in data) {
            this.set(key, data[key]);
        }
    };    

b3view.SettingsManager = SettingsManager;
}());
