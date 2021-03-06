export {
    std
}

export type KeyOf<T> = (keyof T)
export type ValueOf<T> = T[KeyOf<T>]
export class Ref<T> {
    constructor(public val: T) {}
}

export function ref<T>(val: T): Ref<T> {
    return new Ref(val);
}

namespace std {
    namespace $$ {
        export type Prop = string | symbol | number;
        export type Accessor = { get: (self: any, prop: Prop) => any };

        export let delegate_cache: Map<Prop, Accessor> = new Map();
    }
    export class Vec<T extends number> {
        p: T[]

        constructor(...items: T[]);
        constructor(len: number);

        constructor(...args: any[]) {
            this.p = new Array<T>(...args);
        }

        get(i: number): T {
            return this.p[i]
        }

        set(i: number, v: T): T {
            let r = this.p[i]
            this.p[i] = v
            return r
        }

        get len(): number {
            return this.p.length
        }
    }

    export function delegate<T extends {}, K extends keyof T>(obj: T, sub: K): T & T[K] {
        let accessor = $$.delegate_cache.get(sub) || {
            get(self: any, prop: $$.Prop) {
                if (prop in self) return self[prop]
                return self[sub][prop]
            }
        };
        $$.delegate_cache.set(sub, accessor);
        return new Proxy(obj, accessor);
    }

    export interface FileReaderEventTarget extends EventTarget {
        result:string
    }
    
    export interface FileReaderEvent extends ProgressEvent {
        target: FileReaderEventTarget;
        getMessage():string;
    }

    export function kvmap<M, R>(
            map: M,
            func: (k: KeyOf<M>, u: ValueOf<M>) => [KeyOf<R>, ValueOf<R>]
        ): R {

        let r: any = {};
        for (let key in map) {
            let [k, v] = func(key, map[key]);
            r[k] = v;
        }
        return r as R;
    }

    export function apply<R>(f: (...a: any) => R, ...a: any): R {
        return f(...a);
    }
}

export namespace ps {
    var reg = $('body');

    export function on(evn: string, f: any) {
        reg.on(evn, f);
    }

    export function trigger(evn: string) {
        reg.trigger(evn);
    }
}