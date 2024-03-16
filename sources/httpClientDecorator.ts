import { HttpClient } from "./httpClient";
import { HttpRequest } from "./httpRequest";
import { HttpResponse } from "./httpResponse";
import { Pre } from "./pre";

/**
 * A {@link HttpClient} that wraps around another {@link HttpClient}.
 */
export abstract class HttpClientDecorator implements HttpClient
{
    private readonly innerClient: HttpClient;

    protected constructor(innerClient: HttpClient)
    {
        Pre.condition.assertNotUndefinedAndNotNull(innerClient, "innerClient");

        this.innerClient = innerClient;
    }

    public sendRequest(request: HttpRequest): Promise<HttpResponse>
    {
        return this.innerClient.sendRequest(request);
    }

    public get(requestUri: string): Promise<HttpResponse>
    {
        return HttpClient.get(this, requestUri);
    }
}