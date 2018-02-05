'use strict';

require('marko/node-require').install();
var cheerio = require('cheerio');
var expect = require('chai').expect;
var renderer = require('../src');

var buildModel = renderer.privates.buildModel;
var mockText = 'text'; // used in all mock components

function createInput(type, name, isWidget, widgetId) {
    return {
        options: {
            path: __dirname + '/mock/' + name,
            isWidget: isWidget,
            widgetId: widgetId
        },
        model: {
            type: type,
            text: mockText
        }
    };
}

var components = {
    template: createInput('template', 'template'),
    rendererWithIndex: createInput('renderer', 'index'),
    rendererWithRenderer: createInput('renderer', 'renderer'),
    rendererFromSplit: createInput('renderer', 'split'),
    widgetWithoutId: createInput('widgetWithoutId', 'widget', true),
    widgetWithoutIdFromSplit: createInput('widgetWithoutId', 'split', true),
    widgetWithId: createInput('widgetWithId', 'widget', true, 'widgetId'),
    widgetWithIdFromSplit: createInput('widgetWithId', 'split', true, 'widgetId')
};

describe('buildModel()', function() {
    Object.keys(components).forEach(function(key) {
        it('parses data for ' + key, function() {
            var data = buildModel(components[key]);
            expect(data).to.be.an('object');
            expect(data.type).to.equal(data.model.type);
            if (key === 'template') {
                expect(data.template).to.be.an('object');
            } else {
                expect(data.renderer).to.be.a('function');
            }
        });
    });
});

describe('renderer', function() {
    Object.keys(components).forEach(function(key) {
        it('renders ' + key, function(done) {
            renderer(components[key], function(err, html) {
                var $ = cheerio.load(html);
                var $div = $('div');
                expect($div.length).to.equal(1);
                expect($div.html()).to.equal(mockText);
                done();
            });
        });
    });
});
