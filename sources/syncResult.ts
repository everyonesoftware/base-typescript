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
     * Create a new {@link SyncResult} that contains the result of the provided function.
     * @param createFunction The function to run.
     */
    public static create<T>(createFunction: (() => T)): SyncResult<T>
    {
        Pre.condition.assertNotUndefinedAndNotNull(createFunction, "createFunction");

        let resultValue: T | undefined = undefined;
        let resultError: unknown | undefined = undefined;
        try
        {
            resultValue = createFunction();
        }
        catch (error)
        {
            resultError = error;
        }
        return new SyncResult<T>(resultValue, resultError);
    }

    /**
     * Create a new {@link SyncResult} that contains the provided value.
     * @param value The value to wrap in a {@link SyncResult}.
     */
    public static value<T>(value: T): SyncResult<T>
    {
        return new SyncResult<T>(value, undefined);
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

    public then<U>(thenFunction: (() => U) | ((argument: T) => U)): SyncResult<U>
    {
        Pre.condition.assertNotUndefinedAndNotNull(thenFunction, "thenFunction");

        let resultValue: U | undefined = undefined;
        let resultError: unknown | undefined = this.error;
        if (this.error === undefined)
        {
            try
            {
                resultValue = thenFunction(this.value!);
            }
            catch (error)
            {
                resultError = error;
            }
        }
        return new SyncResult<U>(resultValue, resultError);
    }

    public onValue(onValueFunction: (() => void) | ((argument: T) => void)): SyncResult<T>
    {
        Pre.condition.assertNotUndefinedAndNotNull(onValueFunction, "onValueFunction");

        let result: SyncResult<T> = this;
        if (this.error === undefined)
        {
            try
            {
                onValueFunction(this.value!);
            }
            catch (error)
            {
                result = SyncResult.error(error);
            }
        }
        return result;
    }

    public catch(catchFunction: (() => T) | ((error: unknown) => T)): SyncResult<T>;
    public catch<TError>(errorType: Type<TError>, catchFunction: (() => T) | ((error: TError) => T)): SyncResult<T>;
    catch<TError>(errorTypeOrCatchFunction: Type<TError> | (() => T) | ((error: unknown) => T), catchFunction?: (() => T) | ((error: TError) => T)): SyncResult<T>
    {
        let errorType: Type<TError> | undefined;
        if (catchFunction === undefined || catchFunction === null)
        {
            errorType = undefined;
            catchFunction = errorTypeOrCatchFunction as (() => T) | ((error: unknown) => T);

            Pre.condition.assertNotUndefinedAndNotNull(catchFunction, "catchFunction");
            Pre.condition.assertTrue(isFunction(catchFunction), "isFunction(catchFunction)");
        }
        else
        {
            errorType = errorTypeOrCatchFunction as Type<TError>;

            Pre.condition.assertNotUndefinedAndNotNull(errorType, "errorType");
            Pre.condition.assertNotUndefinedAndNotNull(catchFunction, "catchFunction");
            Pre.condition.assertTrue(isFunction(catchFunction), "isFunction(catchFunction)");
        }

        let result: SyncResult<T> = this;
        if (this.error !== undefined &&
            (errorType === undefined || errorType === null || this.error instanceof errorType))
        {
            try
            {
                result = SyncResult.value(catchFunction(this.error as TError));
            }
            catch (error)
            {
                result = SyncResult.error(error);
            }
        }
        return result;
    }

    public onError(onErrorFunction: (() => void) | ((error: unknown) => void)): SyncResult<T>;
    public onError<TError>(errorType: Type<TError>, onErrorFunction: (() => void) | ((error: TError) => void)): SyncResult<T>;
    onError<TError>(errorTypeOrOnErrorFunction: Type<TError> | (() => void) | ((error: unknown) => void), onErrorFunction?: (() => void) | ((error: TError) => void)): SyncResult<T>
    {
        if (onErrorFunction === undefined || onErrorFunction === null)
        {
            Pre.condition.assertNotUndefinedAndNotNull(errorTypeOrOnErrorFunction, "onErrorFunction");
            Pre.condition.assertTrue(isFunction(errorTypeOrOnErrorFunction), "isFunction(onErrorFunction)");

            onErrorFunction = errorTypeOrOnErrorFunction as (() => void) | ((error: unknown) => void);
            errorTypeOrOnErrorFunction = undefined!;
        }
        else
        {
            Pre.condition.assertNotUndefinedAndNotNull(errorTypeOrOnErrorFunction, "errorType");
            Pre.condition.assertNotUndefinedAndNotNull(onErrorFunction, "catchFunction");
            Pre.condition.assertTrue(isFunction(onErrorFunction), "isFunction(catchFunction)");
        }

        let result: SyncResult<T> = this;
        if (this.error !== undefined &&
            (errorTypeOrOnErrorFunction === undefined || errorTypeOrOnErrorFunction === null || this.error instanceof errorTypeOrOnErrorFunction))
        {
            try
            {
                onErrorFunction(this.error as TError);
            }
            catch (error)
            {
                result = SyncResult.error(error);
            }
        }
        return result;
    }

    public convertError(convertErrorFunction: (() => unknown) | ((error: unknown) => unknown)): SyncResult<T>;
    public convertError<TError>(errorType: Type<TError>, convertErrorFunction: (() => unknown) | ((error: TError) => unknown)): SyncResult<T>;
    convertError<TError>(errorTypeOrConvertErrorFunction: Type<TError> | (() => unknown) | ((error: unknown) => unknown), convertErrorFunction?: (() => unknown) | ((error: TError) => unknown)): SyncResult<T>
    {
        if (convertErrorFunction === undefined || convertErrorFunction === null)
        {
            Pre.condition.assertNotUndefinedAndNotNull(errorTypeOrConvertErrorFunction, "convertErrorFunction");
            Pre.condition.assertTrue(isFunction(errorTypeOrConvertErrorFunction), "isFunction(convertErrorFunction)");

            convertErrorFunction = errorTypeOrConvertErrorFunction as (() => unknown) | ((error: unknown) => unknown);
            errorTypeOrConvertErrorFunction = undefined!;
        }
        else
        {
            Pre.condition.assertNotUndefinedAndNotNull(errorTypeOrConvertErrorFunction, "errorType");
            Pre.condition.assertNotUndefinedAndNotNull(convertErrorFunction, "convertErrorFunction");
            Pre.condition.assertTrue(isFunction(convertErrorFunction), "isFunction(convertErrorFunction)");
        }

        let result: SyncResult<T> = this;
        if (this.error !== undefined &&
            (errorTypeOrConvertErrorFunction === undefined || errorTypeOrConvertErrorFunction === null || this.error instanceof errorTypeOrConvertErrorFunction))
        {
            let newError: unknown;
            try
            {
                newError = convertErrorFunction(this.error as TError);
            }
            catch (error)
            {
                newError = error;
            }
            result = SyncResult.error(newError);
        }
        return result;
    }

    public toPromise(): PromiseLike<T>
    {
        return Result.toPromise(this);
    }
}
