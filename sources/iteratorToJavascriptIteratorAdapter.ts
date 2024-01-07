import { Iterator } from "./iterator";
import { JavascriptIterator, JavascriptIteratorResult } from "./javascript";
import { Pre } from "./pre";

/**
 * A JavaScript/TypeScript object that is used to iterate over a collection of values.
 */
export class IteratorToJavascriptIteratorAdapter<T> implements JavascriptIterator<T>
{
    private readonly iterator: Iterator<T>;

    private constructor(iterator: Iterator<T>)
    {
        Pre.condition.assertNotUndefinedAndNotNull(iterator, "iterator");

        this.iterator = iterator;
    }

    public static create<T>(iterator: Iterator<T>): IteratorToJavascriptIteratorAdapter<T>
    {
        return new IteratorToJavascriptIteratorAdapter<T>(iterator);
    }
    
    public next(): JavascriptIteratorResult<T>
    {
        const result: JavascriptIteratorResult<T> = {
            done: !this.iterator.next(),
            value: undefined!,
        };
        if (!result.done)
        {
            result.value = this.iterator.getCurrent();
        }
        return result;
    }
}