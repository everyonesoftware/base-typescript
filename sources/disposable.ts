import { BasicDisposable } from "./basicDisposable";
import { Result } from "./result";

/**
 * An object that can be disposed.
 */
export abstract class Disposable
{
    /**
     * Create a new {@link Disposable} that will invoke the provided {@link Function} when it is
     * disposed.
     * @param disposedFunction The function to invoke when the returned {@link Disposable} is
     * disposed.
     */
    public static create(disposedFunction: () => void): Disposable
    {
        return BasicDisposable.create(disposedFunction);
    }

    /**
     * Clean up any resources that this object is using. This function will return true if this
     * invocation disposed of the object. Subsequent calls to dispose() will return false.
     */
    public abstract dispose(): Result<boolean>;

    /**
     * Get whether this {@link Disposable} has been disposed yet.
     */
    public abstract isDisposed(): boolean;
}