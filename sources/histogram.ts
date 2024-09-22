import { Map } from "./map";
import { MapDecorator } from "./mapDecorator";
import { NotFoundError } from "./notFoundError";
import { Pre } from "./pre";
import { Result } from "./result";
import { isUndefinedOrNull } from "./types";

export class Histogram<T> extends MapDecorator<T,number>
{
    protected constructor()
    {
        super(Map.create());
    }

    public static create<T>(): Histogram<T>
    {
        return new Histogram<T>();
    }

    public add(value: T, countToAdd?: number): this
    {
        Pre.condition.assertTrue(isUndefinedOrNull(countToAdd) || 1 <= countToAdd, "isUndefinedOrNull(countToAdd) || 1 <= countToAdd");

        if (isUndefinedOrNull(countToAdd))
        {
            countToAdd = 1;
        }
        const currentCount: number = this.get(value)
            .catch(NotFoundError, () => 0)
            .await();
        return this.set(value, currentCount + countToAdd);
    }

    public override remove(value: T, countToRemove?: number): Result<number>
    {
        Pre.condition.assertTrue(isUndefinedOrNull(countToRemove) || 1 <= countToRemove, "isUndefinedOrNull(countToRemove) || 1 <= countToRemove");

        return Result.create(() =>
        {
            let result: number;
            if (isUndefinedOrNull(countToRemove))
            {
                result = super.remove(value).await();
            }
            else
            {
                result = this.get(value).await();
                if (result <= countToRemove)
                {
                    super.remove(value).await();
                }
                else
                {
                    this.set(value, result - countToRemove);
                }
            }
            return result;
        });
    }
}