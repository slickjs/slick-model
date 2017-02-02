"use strict";
const eventsjs_1 = require("eventsjs");
const equal_1 = require("./equal");
const meta_1 = require("./meta");
class Model extends eventsjs_1.EventEmitter {
    constructor() {
        super();
        this[meta_1.Attributes] = new Map();
    }
    set(key, value) {
        let old = this.get(key);
        if (equal_1.equal(old, value)) {
            return this;
        }
        this[meta_1.Attributes].set(key, value);
        this.trigger(`change:${key}`, old, value);
        this.trigger('change', { [key]: value });
    }
    get(key) {
        return this[meta_1.Attributes].get(key);
    }
    has(key) {
        return this[meta_1.Attributes].has(key);
    }
    unset(key) {
        if (this.has(key)) {
            let val = this.get(key);
            this[meta_1.Attributes].delete(key);
            this.trigger(`remove:${key}`, val);
            this.trigger('remove', key, val);
            return val;
        }
        return null;
    }
    toJSON() {
        if (!this[meta_1.Attributes])
            return {};
        return this[meta_1.Attributes];
    }
}
exports.Model = Model;
