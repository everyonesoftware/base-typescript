import { Iterator } from "./iterator";
import { JavascriptIterable } from "./javascript";
import { Pre } from "./pre";

export function andList(values: JavascriptIterable<string>): string
{
    return list("and", values);
}

export function orList(values: JavascriptIterable<string>): string
{
    return list("or", values);
}

function list(conjunction: string, values: JavascriptIterable<string>): string
{
    Pre.condition.assertNotEmpty(conjunction, "conjunction");
    Pre.condition.assertNotUndefinedAndNotNull(values, "values");

    let result: string = "";
    let index = 0;
    const iterator: Iterator<string> = Iterator.create(values).start();
    while (iterator.hasCurrent())
    {
        const currentValue: string = iterator.takeCurrent();
        if (index >= 1)
        {
            if (iterator.hasCurrent())
            {
                result += `, `;
            }
            else
            {
                if (index >= 2)
                {
                    result += `,`;
                }
                result += ` ${conjunction} `;
            }
        }
        result += currentValue;
        index++;
    }
    return result;
}