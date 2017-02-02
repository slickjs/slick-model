"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
__export(require("./model"));
var decorators_1 = require("./decorators");
exports.observable = decorators_1.observable;
exports.validate = decorators_1.validate;
