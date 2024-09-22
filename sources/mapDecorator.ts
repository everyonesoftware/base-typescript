import { Iterator } from "./iterator";
import { Map, MapEntry } from "./map";
import { MapBase } from "./mapBase";
import { Pre } from "./pre";
import { Result } from "./result";

/**
 * A {@link Map} decorator type that wraps around another {@link Map}.
 */
export abstract class MapDecorator<TKey,TValue> extends MapBase<TKey,TValue>
{
    private readonly innerMap: Map<TKey,TValue>;

    protected constructor(innerMap: Map<TKey,TValue>)
    {
        Pre.condition.assertNotUndefinedAndNotNull(innerMap, "innerMap");

        super();

        this.innerMap = innerMap;
    }

    public override any(): boolean
    {
        return this.innerMap.any();
    }

    public override getCount(): number
    {
        return this.innerMap.getCount();
    }

    public override containsKey(key: TKey): boolean
    {
        return this.innerMap.containsKey(key);
    }

    public override get(key: TKey): Result<TValue>
    {
        return this.innerMap.get(key);
    }

    public override set(key: TKey, value: TValue): this
    {
        this.innerMap.set(key, value);
        return this;
    }

    public override getOrSet(key: TKey, valueCreator: () => TValue): Result<TValue>
    {
        return this.innerMap.getOrSet(key, valueCreator);
    }

    public override remove(key: TKey): Result<TValue>
    {
        return this.innerMap.remove(key);
    }

    public override iterate(): Iterator<MapEntry<TKey,TValue>>
    {
        return this.innerMap.iterate();
    }

    public override iterateKeys(): Iterator<TKey>
    {
        return this.innerMap.iterateKeys();
    }

    public override iterateValues(): Iterator<TValue>
    {
        return this.innerMap.iterateValues();
    }
}