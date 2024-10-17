import { Comparer } from "./comparer";
import { Iterable } from "./iterable";
import { isMap, Map } from "./map";
import { getPropertyNames, hasProperty, isArray, isFunctionWithParameterCount, isIterable, isObject } from "./types";

/**
 * A collection of {@link Function}s that can be used to determine if two values are equal.
 */
export class EqualFunctions
{
    private readonly functions: {matchFunction: (left: unknown, right: unknown) => boolean, equalFunction: (left: unknown, right: unknown) => boolean}[];
    
    private constructor()
    {
        this.functions = [];
    }

    public static create(): EqualFunctions
    {
        return new EqualFunctions();
    }

    private defaultEqual(left: unknown, right: unknown): boolean
    {
        let result: boolean | undefined = Comparer.equalSameUndefinedNull(left, right);
        if (result === undefined)
        {
            result = false;

            if (isMap(left))
            {
                if (isMap(right))
                {
                    result = Map.equals(left, right, this);
                }
            }
            else if (isIterable(left))
            {
                if (isIterable(right))
                {
                    result = Iterable.equals(left, right, this);
                }
            }
            else if (isArray(left))
            {
                if (isArray(right))
                {
                    result = (left.length === right.length);
                    if (result)
                    {
                        for (let i = 0; i < left.length; i++)
                        {
                            result = this.areEqual(left[i], right[i]);
                            if (!result)
                            {
                                break;
                            }
                        }
                    }
                }
            }
            else if (isObject(left))
            {
                if (isObject(right))
                {
                    result = true;
                    
                    for (const leftPropertyName of getPropertyNames(left))
                    {
                        if (!hasProperty(left, leftPropertyName) || !hasProperty(right, leftPropertyName))
                        {
                            result = false;
                            break;
                        }
                        else
                        {
                            result = this.areEqual(left[leftPropertyName], right[leftPropertyName]);
                        }
                    }

                    if (result)
                    {
                        for (const rightPropertyName of getPropertyNames(right))
                        {
                            if (!hasProperty(left, rightPropertyName) || !hasProperty(right, rightPropertyName))
                            {
                                result = false;
                                break;
                            }
                            else
                            {
                                result = this.areEqual(left[rightPropertyName], right[rightPropertyName]);
                            }
                        }
                    }
                }
            }
        }
        return result;
    }

    /**
     * Get whether the provided values are equal based on the registered equal {@link Function}s.
     * @param left The left value in the comparison.
     * @param right The right value in the comparison.
     */
    public areEqual(left: unknown, right: unknown): boolean
    {
        let matchingEqualFunction = (left: unknown, right: unknown) => this.defaultEqual(left, right);
        for (const {matchFunction, equalFunction} of this.functions)
        {
            if (matchFunction(left, right))
            {
                matchingEqualFunction = equalFunction;
                break;
            }
        }
        return matchingEqualFunction(left, right);
    }

    public add<T>(matchFunction: ((value: T) => boolean) | ((left: T, right: T) => boolean), equalFunction: (left: T, right: T) => boolean): this
    {
        if (isFunctionWithParameterCount(matchFunction, 1))
        {
            const oneArgMatchFunction: (value: unknown) => boolean = matchFunction as (value: unknown) => boolean;
            matchFunction = (left: unknown, right: unknown) => oneArgMatchFunction(left) && oneArgMatchFunction(right);
        }
        this.functions.unshift({
            matchFunction: matchFunction as (left: unknown, right: unknown) => boolean,
            equalFunction: equalFunction as (left: unknown, right: unknown) => boolean,
        });
        return this;
    }
}