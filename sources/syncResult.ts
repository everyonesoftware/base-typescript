import { Post } from "./post";
import { Pre } from "./pre";
import { Result } from "./result";
import { Type, isFunction } from "./types";

/**
 * A {@link Result} type that contains values or errors that have already occurred.
 */
export class SyncResult<T> implements Result<T>
{
    private readonly value: T | undefined;
    private readonly error: unknown | undefined;

    private constructor(value: T | undefined, error: unknown | undefined)
    {
        this.value = value;
        this.error = error;
    }

    /**
     * Create a new {@link SyncResult} that contains the provided value.
     * @param value The value to wrap in a {@link SyncResult}.
     */
    public static create<T>(value: T | (() => T)): SyncResult<T>
    {
        let result: SyncResult<T>;
        if (isFunction(value))
        {
            try
            {
                result = new SyncResult<T>(value(), undefined);
            }
            catch (error)
            {
                result = new SyncResult<T>(undefined, error);
            }
        }
        else
        {
            result = new SyncResult<T>(value, undefined);
        }

        Post.condition.assertNotUndefinedAndNotNull(result, "result");

        return result;
    }

    /**
     * Create a new {@link SyncResult} that contains the provided error.
     * @param error The error to wrap in a {@link SyncResult}.
     */
    public static error<T>(error: unknown): SyncResult<T>
    {
        Pre.condition.assertNotUndefinedAndNotNull(error, "error");

        return new SyncResult<T>(undefined, error);
    }

    public await(): T
    {
        if (this.error !== undefined)
        {
            throw this.error;
        }
        return this.value!;
    }

    public then<U>(thenFunction: (() => U) | ((argument: T) => U)): Result<U>
    {
        return Result.then(this, thenFunction);
    }

    public onValue(onValueFunction: (() => void) | ((argument: T) => void)): Result<T>
    {
        return Result.onValue(this, onValueFunction);
    }

    public catch<TError>(errorType: Type<TError>, catchFunction: (() => T) | ((error: TError) => T)): Result<T>
    {
        return Result.catch(this, errorType, catchFunction);
    }
}
