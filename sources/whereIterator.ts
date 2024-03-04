import { Iterator } from "./iterator";
import { IteratorDecorator } from "./iteratorDecorator";
import { Pre } from "./pre";

/**
 * An {@link Iterator} that only returns values that match a condition.
 */
export class WhereIterator<T> extends IteratorDecorator<T>
{
    private readonly condition: (value: T) => boolean;
    
    private constructor(innerIterator: Iterator<T>, condition: (value: T) => boolean)
    {
        Pre.condition.assertNotUndefinedAndNotNull(innerIterator, "innerIterator");
        Pre.condition.assertNotUndefinedAndNotNull(condition, "condition");

        super(innerIterator);

        this.condition = condition;
    }

    public static create<T>(innerIterator: Iterator<T>, condition: (value: T) => boolean): WhereIterator<T>
    {
        return new WhereIterator(innerIterator, condition);
    }

    public override next(): boolean
    {
        do
        {
            super.next();
        }
        while (super.hasCurrent() && !this.condition(super.getCurrent()));

        return this.hasCurrent();
    }
}