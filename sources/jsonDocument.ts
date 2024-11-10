import { Pre } from "./pre";
import { Result } from "./result";
import { Iterator } from "./iterator";
import { instanceOf, Type } from "./types";
import { JavascriptIterable } from "./javascript";
import { JsonDocumentValue } from "./jsonDocumentValue";
import { Token } from "./token";
import { WrongTypeError } from "./wrongTypeError";
import { JsonDocumentObject } from "./jsonDocumentObject";
import { JsonDocumentArray } from "./jsonDocumentArray";
import { Tokenizer } from "./tokenizer";
import { DocumentIssue } from "./documentIssue";
import { JsonDocumentParser } from "./jsonDocumentParser";

/**
 * An object that represents a JSON document.
 */
export class JsonDocument
{
    private tokensAndValues: JavascriptIterable<Token | JsonDocumentValue>;

    private constructor(tokensAndValues: JavascriptIterable<Token | JsonDocumentValue>)
    {
        Pre.condition.assertNotUndefinedAndNotNull(tokensAndValues, "tokensAndValues");

        this.tokensAndValues = tokensAndValues;
    }

    /**
     * Create a new {@link JsonDocument}.
     */
    public static create(tokensAndValues: JavascriptIterable<Token | JsonDocumentValue>): JsonDocument
    {
        return new JsonDocument(tokensAndValues);
    }

    /**
     * Parse a {@link JsonDocument} from the provided text.
     * @param text The text to parse a {@link JsonDocument} from.
     * @param onIssue The function that will be invoked if any issues are encountered.
     */
    public static parse(text: string | JavascriptIterable<string> | Tokenizer, onIssue?: (issue: DocumentIssue) => void): Result<JsonDocument>
    {
        const parser: JsonDocumentParser = JsonDocumentParser.create();
        return parser.parseDocument(text, onIssue);
    }

    /**
     * Iterate through each of the root {@link JsonDocumentValue}s of this {@link JsonDocument}.
     */
    public iterateRoots(): Iterator<JsonDocumentValue>
    {
        return Iterator.create(this.tokensAndValues)
            .where(tokenOrValue => !(tokenOrValue instanceof Token))
            .map(value => (value as unknown) as JsonDocumentValue);
    }

    /**
     * Get the first root {@link JsonDocumentValue} of this {@link JsonDocument}.
     */
    public getRoot(): Result<JsonDocumentValue>
    {
        return this.iterateRoots().first();
    }

    private getRootAs<T extends JsonDocumentValue>(type: Type<T>): Result<T>
    {
        Pre.condition.assertNotUndefinedAndNotNull(type, "type");

        return Result.create(() =>
        {
            const root: JsonDocumentValue = this.getRoot().await();
            if (!instanceOf(root, type))
            {
                throw new WrongTypeError(`Expected instance of ${type.name}, but found ${root.toString()} instead.`);
            }
            return root as T;
        });
    }

    /**
     * Get the first {@link JsonDocumentValue} of this {@link JsonDocument} as a
     * {@link JsonDocumentObject}. If the first {@link JsonDocumentValue} isn't a
     * {@link JsonDocumentObject}, then a {@link WrongTypeError} will be returned.
     */
    public getRootObject(): Result<JsonDocumentObject>
    {
        return this.getRootAs(JsonDocumentObject);
    }

    /**
     * Get the first {@link JsonDocumentValue} of this {@link JsonDocument} as a
     * {@link JsonDocumentArray}. If the first {@link JsonDocumentValue} isn't a
     * {@link JsonDocumentArray}, then a {@link WrongTypeError} will be returned.
     */
    public getRootArray(): Result<JsonDocumentArray>
    {
        return this.getRootAs(JsonDocumentArray);
    }
}