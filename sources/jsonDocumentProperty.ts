import { DocumentIssue } from "./documentIssue";
import { Iterable } from "./iterable";
import { JavascriptIterable } from "./javascript";
import { JsonDocumentParser } from "./jsonDocumentParser";
import { JsonDocumentString } from "./jsonDocumentString";
import { JsonDocumentValue } from "./jsonDocumentValue";
import { Pre } from "./pre";
import { Result } from "./result";
import { Token } from "./token";
import { Tokenizer } from "./tokenizer";
import { TokenType } from "./tokenType";

export class JsonDocumentProperty
{
    private readonly tokensAndValues: JavascriptIterable<Token | JsonDocumentValue>;
    
    private constructor(tokensAndValues: JavascriptIterable<Token | JsonDocumentValue>)
    {
        Pre.condition.assertNotUndefinedAndNotNull(tokensAndValues, "tokensAndValues");
        Pre.condition.assertNotEmpty(tokensAndValues, "tokensAndValues");
        Pre.condition.assertInstanceOf({ value: Iterable.first(tokensAndValues).await(), type: JsonDocumentString, expression: "Iterable.first(tokensAndValues).await()" });

        this.tokensAndValues = tokensAndValues;
    }

    public static create(tokensAndValues: JavascriptIterable<Token | JsonDocumentValue>): JsonDocumentProperty
    {
        return new JsonDocumentProperty(tokensAndValues);
    }

    /**
     * Parse a {@link JsonDocumentProperty} from the provided text. If a property can't be parsed,
     * then undefined will be returned.
     * @param text The text to parse.
     * @param onIssue The function that will be invoked if any issues are encountered.
     */
    public static parse(text: string | JavascriptIterable<string> | Tokenizer, onIssue?: (issue: DocumentIssue) => void): Result<JsonDocumentProperty | undefined>
    {
        return JsonDocumentParser.create().parseProperty(text, onIssue);
    }

    public getLength(): number
    {
        return JsonDocumentValue.getLength(this.tokensAndValues);
    }

    public getText(): string
    {
        return JsonDocumentValue.getText(this.tokensAndValues);
    }

    public toString(): string
    {
        return JsonDocumentValue.toString(this);
    }

    /**
     * Get the name of this {@link JsonDocumentProperty}.
     */
    public getName(): string
    {
        // We can assume that the first value in the tokensAndValues variable is a
        // JsonDocumentString, because we assert that in the constructor.
        const first: JsonDocumentString = Iterable.first(this.tokensAndValues).await() as JsonDocumentString;
        return first.getValue();
    }

    /**
     * Get the {@link JsonDocumentValue} of this {@link JsonDocumentProperty}. If this
     * {@link JsonDocumentProperty} doesn't have a {@link JsonDocumentValue}, then undefined will be
     * returned instead.
     */
    public getValue(): JsonDocumentValue | undefined
    {
        let result: JsonDocumentValue | undefined;

        let foundColon: boolean = false;
        for (const tokenOrValue of this.tokensAndValues)
        {
            if (!foundColon)
            {
                foundColon = tokenOrValue instanceof Token &&
                             tokenOrValue.getType() === TokenType.Colon;
            }
            else if (!(tokenOrValue instanceof Token))
            {
                result = tokenOrValue;
                break;
            }
        }

        return result;
    }
}