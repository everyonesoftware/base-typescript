import { Iterable } from "./iterable";
import { IterableDecorator } from "./iterableDecorator";
import { Iterator } from "./iterator";
import { Pre } from "./pre";

/**
 * An {@link Iterable} that only returns values that match a condition.
 */
export class WhereIterable<T> extends IterableDecorator<T>
{
    private readonly condition: (value: T) => boolean;
    
    private constructor(innerIterable: Iterable<T>, condition: (value: T) => boolean)
    {
        Pre.condition.assertNotUndefinedAndNotNull(innerIterable, "innerIterable");
        Pre.condition.assertNotUndefinedAndNotNull(condition, "condition");

        super(innerIterable);

        this.condition = condition;
    }

    public static create<T>(innerIterable: Iterable<T>, condition: (value: T) => boolean): WhereIterable<T>
    {
        return new WhereIterable(innerIterable, condition);
    }

    public override iterate(): Iterator<T>
    {
        return super.iterate().where(this.condition);
    }
}