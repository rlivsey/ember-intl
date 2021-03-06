/**
 * Copyright 2015, Yahoo! Inc.
 * Copyrights licensed under the New BSD License. See the accompanying LICENSE file for terms.
 */

var Blueprint   = require('ember-cli/lib/models/blueprint');
var SilentError = require('ember-cli/lib/errors/silent');
var Promise     = require('ember-cli/lib/ext/promise');
var path        = require('path');
var fs          = require('fs');

var extract     = require('../../lib/extract');

module.exports = {
    description: 'Extract a CLDR data into an ES6 module for a given locale code',

    anonymousOptions: ['fields'],

    normalizeEntityName: function (localeName) {
        entityName = Blueprint.prototype.normalizeEntityName.apply(this, arguments);

        if (!extract.isValidLocale(localeName)) {
            throw new SilentError('Aborting. `' + localeName + '` is not a know locale code');
        }

        return localeName;
    },

    afterInstall: function (options) {
        var file = path.join(this.project.root, 'app', 'locales', options.entity.name + '.js');

        return new Promise(function (resolve, reject) {
            fs.readFile(file, 'utf8', function (err, data) {
                if (err) { return reject(err); }

                fs.writeFile(file, data, function (_err) {
                    if (_err) { return reject(_err); }
                    resolve();
                });
            });
        });
    },

    locals: function (options) {
        var localeName = options.args[1];
        var fields     = options.args.slice(3);

        if (!fields.length)  {
            fields = ['year', 'month', 'day', 'hour', 'minute', 'second'];
        }

        return {
            locale: '\''+ localeName + '\'',
            fields: fields
        }
    }
};
