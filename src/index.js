'use strict';

var path = require('path');
var tryRequire = require('try-require');
var template = require('./template.marko');

var rendererCache = {};

// determine renderer for the custom tag
function buildModel(input) {
    var options = input.options;
    var modulePath = options.path;
    var isWidget = options.isWidget;
    var widgetId = options.widgetId;
    var data = {
        model: input.model || {},
        extra: input.extra || {}
    };

    if (!isWidget && !widgetId) {
        data.type = 'renderer';
        data.renderer = loadRenderer(path.join(modulePath, 'index.js'));

        // support split components with nested render function
        if (data.renderer.render) {
            data.renderer = data.renderer.render;
        }

        if (data.renderer === 'not-found') {
            data.renderer = loadRenderer(path.join(modulePath, 'renderer.js'));
            if (data.renderer === 'not-found') {
                data.template = loadRenderer(path.join(modulePath, 'template.marko'));
                data.type = 'template';
            }
        }
    } else if (isWidget && widgetId) {
        data.renderer = loadRenderer(modulePath);
        data.type = 'widgetWithId';
    } else if (isWidget && !widgetId) {
        data.renderer = loadRenderer(modulePath);
        data.type = 'widgetWithoutId';
    }

    // support nested render function for widgets when renderer is missing
    if (isWidget) {
        if (data.renderer.renderer) {
            data.renderer = data.renderer.renderer; // default
        } else if (data.renderer.render) {
            data.renderer = data.renderer.render; // nested case
        }
    }

    return data;
}

// attempt to load renderer based on determined path
function loadRenderer(rendererPath) {
    var renderer = rendererCache[rendererPath];
    if (!renderer) {
        renderer = rendererCache[rendererPath] = tryRequire(rendererPath) || 'not-found';
    }
    return renderer;
}

module.exports = function(input, out) {
    template.render(buildModel(input), out);
};

module.exports.privates = {
    buildModel: buildModel
};
