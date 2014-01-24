﻿define(["jquery", "app", "underscore", "async"], function($, app, _, async) {
    return (function () {
        
        function Manager() {
        }

        Manager.prototype = {
            get registredExtensions() {
                return this._registredExtensions;
            },
            set registredExtensions(val) {
                this._registredExtensions = val;
            },
            
            get extensions() {
                return this._extensions;
            },
            set extensions(val) {
                this._extensions = val;
            }
        };

        Manager.prototype.init = function (done) {
            var self = this;
            
            this.getExtensions(function (res) {
                self.extensions = res;
                self.registredExtensions = _.filter(self.extensions, function (ext) {
                    return ext.isRegistered;
                });
                
                done();
            });
        };
        
        Manager.prototype.getExtensions = function (resultCallback) {
            $.getJSON(app.serverUrl + "extensions", resultCallback);
        };

        Manager.prototype.loadExtensions = function (cb) {
            async.eachSeries(this.registredExtensions, function (extension, innercb) {
                    require.config({
                        packages: [
                            {
                                name: extension.name,
                                location: '../extension/' + extension.name + '/public/js',
                                main: "main"
                            }
                        ]
                    });
                    require([extension.name], function () {
                        innercb();
                    }, function () { innercb(); });
            }, cb);
        };
        
        Manager.prototype.registerExtensions = function (extension, done) {
            $.post(app.serverUrl + "extensions", extension, done);
        };
        
        return Manager;
    })();
});