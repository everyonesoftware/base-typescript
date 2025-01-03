import { SyncResult } from "./syncResult";
import { Type } from "./types";

/**
 * A type that encapsulates the result of an operation.
 */
export abstract class Result<T>
{
    /**
     * Create a new {@link Result} that contains the result of the provided function.
     * @param createFunction The function to run.
     */
    public static create<T>(createFunction: (() => T)): Result<T>
    {
        return SyncResult.create<T>(createFunction);
    }

    /**
     * Create a new {@link Result} that contains the provided value.
     * @param value The value to wrap in a {@link Result}.
     */
    public static value<T>(value: T): Result<T>
    {
        return SyncResult.value(value);
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
     * Run the provided onValueFunction if this {@link Result} is successful. The value or error
     * contained by this {@link Result} will be contained by the returned {@link Result}.
     * @param onValueFunction The function to run if this {@link Result} is successful.
     */
    public abstract onValue(onValueFunction: (() => void) | ((argument: T) => void)): Result<T>;

    /**
     * Run the provided catchFunction if this {@link Result} contains an error.
     * @param catchFunction The function to run if an error is caught.
     */
    public abstract catch(catchFunction: (() => T) | ((error: unknown) => T)): Result<T>;
    /**
     * Run the provided catchFunction if this {@link Result} contains an error of the provided type.
     * @param errorType The type of error to catch.
     * @param catchFunction The function to run if the error is caught.
     */
    public abstract catch<TError>(errorType: Type<TError>, catchFunction: (() => T) | ((error: TError) => T)): Result<T>;

    /**
     * Run the provided onErrorFunction if this {@link Result} contains an error.
     * @param onErrorFunction The function to run if an error is found.
     */
    public abstract onError(onErrorFunction: (() => void) | ((error: unknown) => void)): Result<T>;
    /**
     * Run the provided onErrorFunction if this {@link Result} contains an error of the provided
     * type.
     * @param errorType The type of error to respond to.
     * @param onErrorFunction The function to run if the error is found.
     */
    public abstract onError<TError>(errorType: Type<TError>, onErrorFunction: (() => void) | ((error: TError) => void)): Result<T>;

    /**
     * Run the provided convertErrorFunction if this {@link Result} contains an error. The value
     * returned from the convertErrorFunction will be the error for the returned {@link Result}.
     * @param convertErrorFunction The function that will return the new error. 
     */
    public abstract convertError(convertErrorFunction: (() => unknown) | ((error: unknown) => unknown)): Result<T>;
    /**
     * Run the provided convertErrorFunction if this {@link Result} contains an error of the
     * provided type. The value returned from the convertErrorFunction will be the error for the
     * returned {@link Result}.
     * @param errorType The type of error to respond to.
     * @param convertErrorFunction The function that will return the new error. 
     */
    public abstract convertError<TError>(errorType: Type<TError>, convertErrorFunction: (() => unknown) | ((error: TError) => unknown)): Result<T>;

    /**
     * Convert this {@link Result} to a {@link PromiseLike} object.
     */
    public abstract toPromise(): PromiseLike<T>;

    /**
     * Convert the provided {@link Result} to a {@link PromiseLike}.
     * @param result The {@link Result} to convert to a {@link PromiseLike}.
     */
    public static toPromise<T>(result: Result<T>): PromiseLike<T>
    {
        return new Promise((resolve: (value: T | PromiseLike<T>) => void, reject: (reason?: any) => void) =>
        {
            try
            {
                resolve(result.await());
            }
            catch (error)
            {
                reject(error);
            }
        });
    }
}