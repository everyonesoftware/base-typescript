import { Pre } from "./condition";

export function andList(values: string[]): string
{
    Pre.condition.assertNotUndefinedAndNotNull(values, "values");

    let result: string;
    if (values.length === 0)
    {
        result = "";
    }
    else if (values.length === 1)
    {
        result = values[0];
    }
    else if (values.length === 2)
    {
        result = `${values[0]} and ${values[1]}`;
    }
    else
    {
        result = "";
        for (let i: number = 0; i < values.length - 1; i++)
        {
            result += `${values[i]}, `;
        }
        result += `and ${values[values.length - 1]}`;
    }
    return result;
}