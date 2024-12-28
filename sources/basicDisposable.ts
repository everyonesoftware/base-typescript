import { Disposable } from "./disposable";
import { Pre } from "./pre";
import { Result } from "./result";

/**
 * A {@link Disposable} type that can be configured with a function that will be invoked when the
 * object is disposed.
 */
export class BasicDisposable extends Disposable
{
    private readonly disposedFunction: () => void;
    private disposed: boolean;

    protected constructor(disposedFunction: () => void)
    {
        super();

        Pre.condition.assertNotUndefinedAndNotNull(disposedFunction, "disposedFunction");

        this.disposedFunction = disposedFunction;
        this.disposed = false;
    }

    /**
     * Create a new {@link Disposable} that will invoke the provided {@link Function} when it is
     * disposed.
     * @param disposedFunction The function to invoke when the returned {@link Disposable} is
     * disposed.
     */
    public static override create(disposedFunction: () => void): Disposable
    {
        return new BasicDisposable(disposedFunction);
    }

    public override dispose(): Result<boolean>
    {
        return Result.create(() =>
        {
            const result: boolean = !this.disposed;
            if (result)
            {
                try
                {
                    this.disposedFunction();
                }
                finally
                {
                    this.disposed = true;
                }
            }
            return result;
        });
    }

    public override isDisposed(): boolean
    {
        return this.disposed;
    }
}