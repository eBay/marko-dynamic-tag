'use strict';

var template = require('./template.marko');

module.exports = require('marko-widgets').defineRenderer({
    template: template,
    getTemplateData: function(state, input) {
        return input;
    }
});
