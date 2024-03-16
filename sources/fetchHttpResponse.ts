import { HttpResponse } from "./httpResponse";
import { Pre } from "./pre";

export class FetchHttpResponse extends HttpResponse
{
    private readonly response: Response;

    private constructor(response: Response)
    {
        Pre.condition.assertNotUndefinedAndNotNull(response, "response");

        super();

        this.response = response;
    }

    public static create(response: Response): FetchHttpResponse
    {
        return new FetchHttpResponse(response);
    }

    public override getStatusCode(): number
    {
        return this.response.status;
    }
    
    public override getBody(): ReadableStream<Uint8Array> | null
    {
        return this.response.body;
    }

    public override getBodyAsString(): Promise<string>
    {
        return this.response.text();
    }

    public override getBodyAsJson(): Promise<any>
    {
        return this.response.json();
    }
}