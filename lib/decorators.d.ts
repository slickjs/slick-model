import { Model } from './model';
export declare function observable<T extends Model, U>(target: T, prop: any, descriptor?: TypedPropertyDescriptor<U>): void;
export declare function validate<T extends Model, U>(target: T, propertyKey: string, descriptor?: TypedPropertyDescriptor<U>): void;
