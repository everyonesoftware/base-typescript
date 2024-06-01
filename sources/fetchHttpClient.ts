import { HttpClient } from "./httpClient";
import { HttpRequest } from "./httpRequest";
import { HttpResponse } from "./httpResponse";
import { HttpMethod } from "./httpMethod";
import { FetchHttpResponse } from "./fetchHttpResponse";
import { Pre } from "./pre";

/**
 * A {@link HttpClient} implementation that uses fetch() to make HTTP requests.
 */
export class FetchHttpClient implements HttpClient
{
    private constructor()
    {
    }

    public static create(): FetchHttpClient
    {
        return new FetchHttpClient();
    }

    public async sendRequest(request: HttpRequest): Promise<HttpResponse>
    {
        Pre.condition.assertNotUndefinedAndNotNull(request, "request");
        Pre.condition.assertNotUndefinedAndNotNull(request.getMethod(), "request.getMethod()");
        Pre.condition.assertNotUndefinedAndNotNull(request.getUri(), "request.getUri()");
        Pre.condition.assertNotEmpty(request.getUri()!, "request.getUri()");

        const httpMethod: HttpMethod = request.getMethod()!;
        const requestUri: string = request.getUri()!;
        const requestInit: RequestInit = {
            method: httpMethod.toString(),
        };
        const response: Response = await fetch(requestUri, requestInit);
        return FetchHttpResponse.create(response);
    }

    public get(requestUri: string): Promise<HttpResponse>
    {
        return HttpClient.get(this, requestUri);
    }
}