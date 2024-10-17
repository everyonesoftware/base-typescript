import { EqualFunctions } from "./equalFunctions";
import { Iterable } from "./iterable";
import { IterableBase } from "./iterableBase";
import { Iterator } from "./iterator";
import { Map, MapEntry } from "./map";
import { Result } from "./result";

/**
 * An abstract base class for the {@link Map} type.
 */
export abstract class MapBase<TKey,TValue> extends IterableBase<MapEntry<TKey,TValue>> implements Map<TKey,TValue>
{
    protected constructor()
    {
        super();
    }

    public override equals(right: Iterable<MapEntry<TKey,TValue>>, equalFunctions?: EqualFunctions): boolean
    {
        return Map.equals(this, right, equalFunctions);
    }

    public override toString(): string
    {
        return Map.toString(this);
    }

    public abstract override any(): boolean;

    public abstract override getCount(): number;

    public abstract containsKey(key: TKey): boolean;

    public abstract get(key: TKey): Result<TValue>;

    public abstract set(key: TKey, value: TValue): this;

    public getOrSet(key: TKey, valueCreator: () => TValue): Result<TValue>
    {
        return Map.getOrSet(this, key, valueCreator);
    }

    public abstract remove(key: TKey): Result<TValue>;
    
    public abstract iterateKeys(): Iterator<TKey>;

    public abstract iterateValues(): Iterator<TValue>;
}