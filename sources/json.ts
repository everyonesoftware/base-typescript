import { Pre } from "./condition";
import { join } from "./strings";

export enum JsonSegmentType
{
    Array,
    Boolean,
    Number,
    Null,
    Object,
    String,
    Unknown,
}

export interface JsonSegment
{
    getType(): JsonSegmentType;
    toString(): string;
}

export class JsonBoolean implements JsonSegment
{
    private readonly value: boolean;

    private constructor(value: boolean)
    {
        Pre.condition.assertNotUndefinedAndNotNull(value, "value");

        this.value = value;
    }

    public static create(value: boolean): JsonBoolean
    {
        return new JsonBoolean(value);
    }

    public getValue(): boolean
    {
        return this.value;
    }

    public getType(): JsonSegmentType.Boolean
    {
        return JsonSegmentType.Boolean;
    }

    public toString(): string
    {
        return JSON.stringify(this.value);
    }
}

export class JsonNumber implements JsonSegment
{
    private readonly value: number;

    private constructor(value: number)
    {
        Pre.condition.assertNotUndefinedAndNotNull(value, "value");

        this.value = value;
    }

    public static create(value: number): JsonNumber
    {
        return new JsonNumber(value);
    }

    public getValue(): number
    {
        return this.value;
    }

    public getType(): JsonSegmentType.Number
    {
        return JsonSegmentType.Number;
    }

    public toString(): string
    {
        return JSON.stringify(this.value);
    }
}

export class JsonString implements JsonSegment
{
    private readonly quote: string;
    private readonly value: string;
    private readonly endQuote: boolean;

    private constructor(value: string, quote: string, endQuote: boolean)
    {
        Pre.condition.assertNotUndefinedAndNotNull(value, "value");
        Pre.condition.assertNotUndefinedAndNotNull(quote, "quote");
        Pre.condition.assertSame(1, quote.length, "quote.length");
        Pre.condition.assertNotUndefinedAndNotNull(endQuote, "endQuote");

        this.quote = quote;
        this.value = value;
        this.endQuote = endQuote;
    }

    public static create(value: string, quote: string = `"`, endQuote: boolean = true): JsonString
    {
        return new JsonString(value, quote, endQuote);
    }

    public getType(): JsonSegmentType.String
    {
        return JsonSegmentType.String;
    }

    public getQuote(): string
    {
        return this.quote;
    }

    public hasEndQuote(): boolean
    {
        return this.endQuote;
    }

    public getValue(): string
    {
        return this.value;
    }

    public toString(): string
    {
        return `${this.quote}${this.value}${this.endQuote ? this.quote : ""}`;
    }
}

export class JsonNull implements JsonSegment
{
    private constructor()
    {
    }

    public static create(): JsonNull
    {
        return new JsonNull();
    }

    public getType(): JsonSegmentType.Null
    {
        return JsonSegmentType.Null;
    }

    public toString(): string
    {
        return "null";
    }
}

export class JsonProperty
{
    private readonly name: string;
    private readonly value: JsonSegment;

    private constructor(name: string, value: JsonSegment)
    {
        Pre.condition.assertNotEmpty(name, "name");
        Pre.condition.assertNotUndefinedAndNotNull(value, "value");

        this.name = name;
        this.value = value;
    }

    public static create(name: string, value: JsonSegment): JsonProperty
    {
        return new JsonProperty(name, value);
    }

    public getName(): string
    {
        return this.name;
    }

    public getValue(): JsonSegment
    {
        return this.value;
    }
}

export class JsonObject implements JsonSegment
{
    private readonly properties: JsonProperty[];
    private readonly closed: boolean;

    private constructor(closed: boolean = true)
    {
        Pre.condition.assertNotUndefinedAndNotNull(closed, "closed");

        this.properties = [];
        this.closed = closed;
    }

    public static create(): JsonObject
    {
        return new JsonObject();
    }

    public getType(): JsonSegmentType
    {
        return JsonSegmentType.Object;
    }

    public toString(): string
    {
        return `{${join(",", this.properties.map(p => p.toString()))}${this.closed ? "}" : ""}`;
    }

    public add(property: JsonProperty): this
    {
        Pre.condition.assertNotUndefinedAndNotNull(property, "property");

        this.properties.push(property);

        return this;
    }
}

export class JsonArray implements JsonSegment
{
    private readonly elements: JsonSegment[];
    private readonly closed: boolean;

    private constructor(closed: boolean = true)
    {
        Pre.condition.assertNotUndefinedAndNotNull(closed, "closed");

        this.elements = [];
        this.closed = closed;
    }

    public static create(): JsonArray
    {
        return new JsonArray();
    }

    public getType(): JsonSegmentType
    {
        return JsonSegmentType.Array;
    }

    public toString(): string
    {
        return `[${join(",", this.elements.map(p => p.toString()))}${this.closed ? "]" : ""}`;
    }

    public add(element: JsonSegment): this
    {
        Pre.condition.assertNotUndefinedAndNotNull(element, "element");

        this.elements.push(element);

        return this;
    }
}

export class JsonUnknown implements JsonSegment
{
    private readonly text: string;

    private constructor(text: string)
    {
        Pre.condition.assertNotEmpty(text, "text");

        this.text = text;
    }

    public static create(text: string)
    {
        return new JsonUnknown(text);
    }
    
    public getType(): JsonSegmentType.Unknown
    {
        return JsonSegmentType.Unknown;
    }
    
    public toString(): string
    {
        return this.text;
    }
}