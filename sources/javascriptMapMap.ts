import { Iterator } from "./iterator";
import { JavascriptMap } from "./javascript";
import { MapBase } from "./mapBase";
import { NotFoundError } from "./notFoundError";

export class JavascriptMapMap<TKey,TValue> extends MapBase<TKey,TValue>
{
    private readonly javascriptMap: JavascriptMap<TKey,TValue>;

    private constructor()
    {
        super();

        this.javascriptMap = new Map();
    }

    public static create<TKey,TValue>(): JavascriptMapMap<TKey,TValue>
    {
        return new JavascriptMapMap<TKey,TValue>();
    }

    public override getCount(): number
    {
        return this.javascriptMap.size;
    }

    public override containsKey(key: TKey): boolean
    {
        return this.javascriptMap.has(key);
    }

    public override get(key: TKey): TValue
    {
        if (!this.containsKey(key))
        {
            throw new NotFoundError(`The key ${JSON.stringify(key)} was not found in the map.`);
        }
        return this.javascriptMap.get(key)!;
    }

    public override set(key: TKey, value: TValue): this
    {
        this.javascriptMap.set(key, value);

        return this;
    }

    public override iterate(): Iterator<[TKey, TValue]>
    {
        return Iterator.create(this.javascriptMap.entries());
    }

    public override iterateKeys(): Iterator<TKey>
    {
        return Iterator.create(this.javascriptMap.keys());
    }

    public override iterateValues(): Iterator<TValue>
    {
        return Iterator.create(this.javascriptMap.values());
    }
    
}