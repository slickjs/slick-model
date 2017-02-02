import { EventEmitter } from 'eventsjs';
export declare class Model extends EventEmitter {
    constructor();
    set<U>(key: PropertyKey, value: U): this;
    get<U>(key: PropertyKey): U;
    has(key: PropertyKey): boolean;
    unset<U>(key: PropertyKey): U;
    toJSON(): any;
}
