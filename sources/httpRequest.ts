import { HttpMethod } from "./httpMethod";
import { Pre } from "./pre";

export class HttpRequest
{
    private method?: HttpMethod;
    private uri?: string;

    private constructor()
    {
    }

    public static create(): HttpRequest
    {
        return new HttpRequest();
    }

    public setMethod(method: HttpMethod): this
    {
        Pre.condition.assertNotUndefinedAndNotNull(method, "method");

        this.method = method;

        return this;
    }

    public getMethod(): HttpMethod | undefined
    {
        return this.method;
    }

    public setUri(uri: string): this
    {
        Pre.condition.assertNotEmpty(uri, "uri");

        this.uri = uri;

        return this;
    }

    public getUri(): string | undefined
    {
        return this.uri;
    }

}