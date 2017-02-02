import { Model } from './model';
import { equal } from './equal';

function setter<T extends Model, U>(target: T, prop: PropertyKey) {
    if (!(target instanceof Model)) {
        throw new TypeError("Target must be a EventEmitter")
    }


    return function $observableSetter(value: U) {
        if (value === undefined) {
            //delete this[Attributes][prop];
            this.delete(prop);
            return;
        }
        if (this instanceof Model) {
            return this.set(prop, value)
        }
        
        /*let old = this.get(prop)
        if (equal(old, value)) {
            return;
        }
        this[Attributes][prop] = value;
        this.trigger(`change:${prop}`, old, value)
        this.trigger('change', { [prop]: value })*/
    }
}

function getter<T, U>(_: T, prop: PropertyKey) {
    return function (): U {
        return this.get(prop)
    }
}


export function observable<T extends Model, U>(target: T, prop: any, descriptor?: TypedPropertyDescriptor<U>) {
    descriptor = descriptor || Object.getOwnPropertyDescriptor(target, prop);
    if (!descriptor) {
        
        descriptor = {
            get: getter<T, U>(target, prop),
            set: setter<T, U>(target, prop),
            enumerable: false,
            configurable: false
        }
        Object.defineProperty(target, prop, descriptor);
    } else if (descriptor.set) {
        let oSet = descriptor.set;

        descriptor.set = function $observableSet(value: U) {

            let old = this[prop];
            if (equal(old, value)) {
                return;
            }
            oSet(value);
            this.trigger(`change:${prop}`, old, value)
            this.trigger('change', { [prop]: value })
        }
    }
}

function validator(type: any, value: any) {
    switch (type) {
        case Number: return typeof value === 'number';
        case String: return typeof value === 'string';
        case Boolean: return typeof value === 'boolean';
        case Date: return typeof value === 'date';
    }

    return value instanceof value;
}

export function validate<T extends Model, U>(target: T, propertyKey: string, descriptor?: TypedPropertyDescriptor<U>) {
    //let set = descriptor.set;
    descriptor = descriptor || Object.getOwnPropertyDescriptor(target, propertyKey);

    if (!descriptor) {
        descriptor = {
            set: function $validateSet(value: U) {
                let type = Reflect.getMetadata("design:type", target, propertyKey);
                if (!validator(type, value)) {
                    throw new TypeError("Invalid type.");
                }
                this.set(propertyKey, value)
            },
            get: function $validateGet(): U {
                return this.get(propertyKey);
            }
        }
        Object.defineProperty(target, propertyKey, descriptor);
    } else if (descriptor.set) {
        let set = descriptor.set;
        descriptor.set = function $validateSet(value: U) {
            let type = Reflect.getMetadata("design:type", target, propertyKey);
            if (!validator(type, value)) {
                throw new TypeError("Invalid type.");
            }
            set(value);
        }
    }
}