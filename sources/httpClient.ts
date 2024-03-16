import { FetchHttpClient } from "./fetchHttpClient";
import { HttpMethod } from "./httpMethod";
import { HttpRequest } from "./httpRequest";
import { HttpResponse } from "./httpResponse";
import { Pre } from "./pre";

/**
 * A type that can make HTTP requests.
 */
export abstract class HttpClient
{
    protected constructor()
    {
    }

    /**
     * Create a new {@link HttpClient}.
     */
    public static create(): HttpClient
    {
        return FetchHttpClient.create();
    }

    /**
     * Send the provided {@link HttpRequest} and return the received
     * {@link HttpResponse}.
     * @param request The {@link HttpRequest} to send.
     */
    public abstract sendRequest(request: HttpRequest): Promise<HttpResponse>;

    /**
     * Send a GET request to the provided URI.
     * @param requestUri The URI to send the GET request to.
     */
    public get(requestUri: string): Promise<HttpResponse>
    {
        return HttpClient.get(this, requestUri);
    }

    /**
     * Send a GET request to the provided URI using the provided {@link HttpClient}.
     * @param httpClient The {@link HttpClient} to use to send the request.
     * @param requestUri The URI to send the request to.
     */
    public static get(httpClient: HttpClient, requestUri: string): Promise<HttpResponse>
    {
        Pre.condition.assertNotUndefinedAndNotNull(httpClient, "httpClient");
        Pre.condition.assertNotEmpty(requestUri, "requestUri");

        return httpClient.sendRequest(HttpRequest.create()
            .setMethod(HttpMethod.GET)
            .setUri(requestUri));
    }
}