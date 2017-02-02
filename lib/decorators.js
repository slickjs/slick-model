"use strict";
const model_1 = require("./model");
const equal_1 = require("./equal");
function setter(target, prop) {
    if (!(target instanceof model_1.Model)) {
        throw new TypeError("Target must be a EventEmitter");
    }
    return function $observableSetter(value) {
        if (value === undefined) {
            //delete this[Attributes][prop];
            this.delete(prop);
            return;
        }
        if (this instanceof model_1.Model) {
            return this.set(prop, value);
        }
        /*let old = this.get(prop)
        if (equal(old, value)) {
            return;
        }
        this[Attributes][prop] = value;
        this.trigger(`change:${prop}`, old, value)
        this.trigger('change', { [prop]: value })*/
    };
}
function getter(_, prop) {
    return function () {
        return this.get(prop);
    };
}
function observable(target, prop, descriptor) {
    descriptor = descriptor || Object.getOwnPropertyDescriptor(target, prop);
    if (!descriptor) {
        descriptor = {
            get: getter(target, prop),
            set: setter(target, prop),
            enumerable: false,
            configurable: false
        };
        Object.defineProperty(target, prop, descriptor);
    }
    else if (descriptor.set) {
        let oSet = descriptor.set;
        descriptor.set = function $observableSet(value) {
            let old = this[prop];
            if (equal_1.equal(old, value)) {
                return;
            }
            oSet(value);
            this.trigger(`change:${prop}`, old, value);
            this.trigger('change', { [prop]: value });
        };
    }
}
exports.observable = observable;
function validator(type, value) {
    switch (type) {
        case Number: return typeof value === 'number';
        case String: return typeof value === 'string';
        case Boolean: return typeof value === 'boolean';
        case Date: return typeof value === 'date';
    }
    return value instanceof value;
}
function validate(target, propertyKey, descriptor) {
    //let set = descriptor.set;
    descriptor = descriptor || Object.getOwnPropertyDescriptor(target, propertyKey);
    if (!descriptor) {
        descriptor = {
            set: function $validateSet(value) {
                let type = Reflect.getMetadata("design:type", target, propertyKey);
                if (!validator(type, value)) {
                    throw new TypeError("Invalid type.");
                }
                this.set(propertyKey, value);
            },
            get: function $validateGet() {
                return this.get(propertyKey);
            }
        };
        Object.defineProperty(target, propertyKey, descriptor);
    }
    else if (descriptor.set) {
        let set = descriptor.set;
        descriptor.set = function $validateSet(value) {
            let type = Reflect.getMetadata("design:type", target, propertyKey);
            if (!validator(type, value)) {
                throw new TypeError("Invalid type.");
            }
            set(value);
        };
    }
}
exports.validate = validate;
