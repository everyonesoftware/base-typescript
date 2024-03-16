/**
 * The abstract base type of responses from a {@link HttpClient} request.
 */
export abstract class HttpResponse
{
    protected HttpResponse()
    {
    }

    /**
     * Get the status code of this {@link HttpResponse}.
     */
    public abstract getStatusCode(): number;

    /**
     * Get the body of this {@link HttpResponse}.
     */
    public abstract getBody(): ReadableStream<Uint8Array> | null;

    /**
     * Get the body of this {@link HttpResponse} as a string.
     */
    public abstract getBodyAsString(): Promise<string>;

    /**
     * Get the body of this {@link HttpResponse} as a parsed Json value.
     */
    public abstract getBodyAsJson(): Promise<any>;
}