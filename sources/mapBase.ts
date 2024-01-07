import { IterableBase } from "./iterableBase";
import { Iterator } from "./iterator";
import { Map } from "./map";

/**
 * An abstract base class for the {@link Map} type.
 */
export abstract class MapBase<TKey,TValue> extends IterableBase<[TKey,TValue]> implements Map<TKey,TValue>
{
    protected constructor()
    {
        super();
    }

    public override toString(): string
    {
        return Map.toString(this);
    }

    public abstract getCount(): number;

    public abstract containsKey(key: TKey): boolean;

    public abstract get(key: TKey): TValue;

    public abstract set(key: TKey, value: TValue): this;
    
    public abstract iterateKeys(): Iterator<TKey>;

    public abstract iterateValues(): Iterator<TValue>;
}