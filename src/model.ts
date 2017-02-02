import { EventEmitter } from 'eventsjs'
import { equal } from './equal';
import { Attributes} from './meta';

export class Model extends EventEmitter {
    
    constructor() {
        super();
        this[Attributes] = new Map<PropertyKey,any>();
    }

    set<U>(key: PropertyKey, value: U): this {
        let old = this.get(key)
        if (equal(old, value)) {
            return this;
        }

        this[Attributes].set(key, value);
        this.trigger(`change:${key}`, old, value)
        this.trigger('change', { [key]: value })
        
    }

    get<U>(key: PropertyKey): U {
        return this[Attributes].get(key);
    }

    has(key: PropertyKey): boolean {
        return this[Attributes].has(key);
    }

    unset<U>(key: PropertyKey): U {
        if (this.has(key)) {
            let val = this.get<U>(key);
            this[Attributes].delete(key);
            this.trigger(`remove:${key}`, val);
            this.trigger('remove', key, val);
            return val;

        }
        return null;
    }

    toJSON() {
        if (!this[Attributes]) return {};
        return this[Attributes];
    }
}
