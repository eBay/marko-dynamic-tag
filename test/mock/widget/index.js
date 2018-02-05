'use strict';

var template = require('./template.marko');

module.exports = require('marko-widgets').defineComponent({
    template: template,
    getTemplateData: function(state, input) {
        return input;
    }
});
