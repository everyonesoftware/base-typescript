import { Pre } from "./pre";

export class HttpMethod
{
    private readonly value: string;

    private constructor(value: string)
    {
        Pre.condition.assertNotEmpty(value, "value");

        this.value = value.toUpperCase();
    }

    public static create(value: string): HttpMethod
    {
        return new HttpMethod(value);
    }

    public static readonly GET = HttpMethod.create("GET");
    public static readonly POST = HttpMethod.create("POST");
    public static readonly PUT = HttpMethod.create("PUT");
    public static readonly PATCH = HttpMethod.create("PATCH");
    public static readonly DELETE = HttpMethod.create("DELETE");
    public static readonly HEAD = HttpMethod.create("HEAD");

    public equals(rhs: HttpMethod): boolean
    {
        return rhs !== undefined && rhs !== null &&
            this.value === rhs.value;
    }

    public toString(): string
    {
        return this.value;
    }
}