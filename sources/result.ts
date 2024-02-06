import { Pre } from "./pre";
import { SyncResult } from "./syncResult";
import { Type, isFunction } from "./types";

/**
 * A type that encapsulates the result of an operation.
 */
export abstract class Result<T>
{
    /**
     * Create a new {@link Result} that contains the provided value.
     * @param value The value to wrap in a {@link Result}.
     */
    public static create<T>(value: T | (() => T)): Result<T>
    {
        return SyncResult.create<T>(value);
    }

    /**
     * Create a new {@link Result} that contains the provided error.
     * @param error The error to wrap in a {@link Result}.
     */
    public static error<T>(error: unknown): Result<T>
    {
        return SyncResult.error<T>(error);
    }

    /**
     * Get the value that this {@link Result} contains. If this {@link Result} contains an error,
     * then the error will be thrown.
     */
    public abstract await(): T;

    /**
     * Get a {@link Result} that runs the provided function if this {@link Result} is successful.
     * @param thenFunction The function to run if this {@link Result} is successful.
     */
    public abstract then<U>(thenFunction: (() => U) | ((argument: T) => U)): Result<U>;

    /**
     * Get a {@link REsult} that runs the provided function if the provided parent {@link Result} is
     * successful.
     * @param result The parent {@link Result}.
     * @param thenFunction The function to run if the parent {@link Result} is successful.
     */
    public static then<T,U>(result: Result<T>, thenFunction: (() => U) | ((argument: T) => U)): Result<U>
    {
        Pre.condition.assertNotUndefinedAndNotNull(result, "result");
        Pre.condition.assertNotUndefinedAndNotNull(thenFunction, "thenFunction");

        return Result.create(() => thenFunction(result.await()));
    }

    /**
     * Run the provided onValueFunction if this {@link Result} is successful. The value or error
     * contained by this {@link Result} will be contained by the returned {@link Result}.
     * @param onValueFunction The function to run if this {@link Result} is successful.
     */
    public abstract onValue(onValueFunction: (() => void) | ((argument: T) => void)): Result<T>;

    /**
     * Run the provided onValueFunction if the provided parent {@link Result} is successful. The
     * value or error contained by the parent {@link Result} will be contained by the returned
     * {@link Result}.
     * @param result The parent {@link Result}.
     * @param onValueFunction The function to run if the provided parent {@link Result} is
     * successful.
     */
    public static onValue<T>(result: Result<T>, onValueFunction: (() => void) | ((argument: T) => void)): Result<T>
    {
        Pre.condition.assertNotUndefinedAndNotNull(result, "result");
        Pre.condition.assertNotUndefinedAndNotNull(onValueFunction, "onValueFunction");

        return Result.create(() =>
        {
            const parentResultValue: T = result.await();
            onValueFunction(parentResultValue);
            return parentResultValue;
        });
    }

    /**
     * Run the provided catchFunction if this {@link Result} contains an error of the provided type.
     * @param errorType The type of error to catch.
     * @param catchFunction The function to run if the error is caught.
     */
    public abstract catch(catchFunction: (() => T) | ((error: unknown) => T)): Result<T>;
    public abstract catch<TError>(errorType: Type<TError>, catchFunction: (() => T) | ((error: TError) => T)): Result<T>;

    /**
     * Run the provided catchFunction if the provided parent {@link Result} contains an error of the
     * provided type.
     * @param result The parent {@link Result}.
     * @param errorType The type of error to catch.
     * @param catchFunction The function to run if the error is caught.
     */
    public static catch<T,TError>(parentResult: Result<T>, errorTypeOrCatchFunction: Type<TError> | (() => T) | ((error: unknown) => T), catchFunction?: (() => T) | ((error: TError) => T)): Result<T>
    {
        Pre.condition.assertNotUndefinedAndNotNull(parentResult, "parentResult");

        if (catchFunction === undefined || catchFunction === null)
        {
            Pre.condition.assertNotUndefinedAndNotNull(errorTypeOrCatchFunction, "catchFunction");
            Pre.condition.assertTrue(isFunction(errorTypeOrCatchFunction), "isFunction(catchFunction)");

            catchFunction = errorTypeOrCatchFunction as (() => T) | ((error: unknown) => T);
            errorTypeOrCatchFunction = undefined!;
        }
        else
        {
            Pre.condition.assertNotUndefinedAndNotNull(errorTypeOrCatchFunction, "errorType");
            Pre.condition.assertNotUndefinedAndNotNull(catchFunction, "catchFunction");
            Pre.condition.assertTrue(isFunction(catchFunction), "isFunction(catchFunction)");
        }

        return Result.create(() =>
        {
            let resultValue: T;
            try
            {
                resultValue = parentResult.await();
            }
            catch (error)
            {
                if (errorTypeOrCatchFunction === undefined || errorTypeOrCatchFunction === null || error instanceof errorTypeOrCatchFunction)
                {
                    resultValue = catchFunction!(error as TError);
                }
                else
                {
                    throw error;
                }
            }
            return resultValue;
        });
    }

    /**
     * Run the provided onErrorFunction if this {@link Result} contains an error of the provided
     * type.
     * @param errorType The type of error to respond to.
     * @param onErrorFunction The function to run if the error is found.
     */
    public abstract onError(onErrorFunction: (() => void) | ((error: unknown) => void)): Result<T>;
    public abstract onError<TError>(errorType: TError, onErrorFunction: (() => void) | ((error: TError) => void)): Result<T>;

   /**
    * Run the provided onErrorFunction if the provided parent {@link Result} contains an error of
    * the provided type.
    * @param result The parent {@link Result}.
    * @param errorType The type of error to respond to.
    * @param onErrorFunction The function to run if the error is found.
    */
    public static onError<T,TError>(parentResult: Result<T>, errorTypeOrOnErrorFunction: Type<TError> | (() => void) | ((error: unknown) => void), onErrorFunction?: (() => void) | ((error: TError) => void)): Result<T>
    {
        Pre.condition.assertNotUndefinedAndNotNull(parentResult, "parentResult");

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

        return Result.create(() =>
        {
            let resultValue: T;
            try
            {
                resultValue = parentResult.await();
            }
            catch (error)
            {
                if (errorTypeOrOnErrorFunction === undefined || errorTypeOrOnErrorFunction === null || error instanceof errorTypeOrOnErrorFunction)
                {
                    onErrorFunction!(error as TError);
                }
                throw error;
            }
            return resultValue;
        });
    }
}