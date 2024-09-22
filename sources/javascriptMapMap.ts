import { Iterator } from "./iterator";
import { JavascriptMap } from "./javascript";
import { MapEntry } from "./map";
import { MapBase } from "./mapBase";
import { NotFoundError } from "./notFoundError";
import { Result } from "./result";

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

    public override any(): boolean
    {
        return this.getCount() > 0;
    }

    public override getCount(): number
    {
        return this.javascriptMap.size;
    }

    public override containsKey(key: TKey): boolean
    {
        return this.javascriptMap.has(key);
    }

    public override get(key: TKey): Result<TValue>
    {
        return this.containsKey(key)
            ? Result.value(this.javascriptMap.get(key)!)
            : Result.error(new NotFoundError(`The key ${JSON.stringify(key)} was not found in the map.`));
    }

    public override set(key: TKey, value: TValue): this
    {
        this.javascriptMap.set(key, value);

        return this;
    }

    public override remove(key: TKey): Result<TValue>
    {
        const value: TValue | undefined = this.javascriptMap.get(key);
        return this.javascriptMap.delete(key)
            ? Result.value(value!)
            : Result.error(new NotFoundError(`The key ${JSON.stringify(key)} was not found in the map.`));
    }

    public override iterate(): Iterator<MapEntry<TKey,TValue>>
    {
        return Iterator.create(this.javascriptMap.entries())
            .map((entry: [TKey,TValue]) => { return {key: entry[0], value: entry[1]}; });
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