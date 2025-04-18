import { DocumentIssue } from "./documentIssue";
import { Result } from "./result";
import { Token } from "./token";
import { Tokenizer } from "./tokenizer";
import { JsonDocumentParser } from "./jsonDocumentParser";
import { Pre } from "./pre";
import { JavascriptIterable } from "./javascript";
import { JsonDocumentProperty } from "./jsonDocumentProperty";
import { JsonDocumentObject } from "./jsonDocumentObject";
import { JsonDocumentArray } from "./jsonDocumentArray";
import { instanceOfType, isString } from "./types";
import { escapeAndQuote } from "./strings";
import { WrongTypeError } from "./wrongTypeError";

/**
 * An individual value from a {@link JsonDocument} that is composed of one or more {@link Token}s.
 */
export abstract class JsonDocumentValue
{
    protected constructor()
    {
    }

    /**
     * Parse a {@link JsonDocumentValue} from the provided text.
     * @param text The text to parse.
     * @param onIssue The {@link Function} that will be invoked when an issue is encountered.
     */
    public static parse(text: string | JavascriptIterable<string> | Tokenizer, onIssue?: (issue: DocumentIssue) => void): Result<JsonDocumentValue | undefined>
    {
        return JsonDocumentParser.create().parseValue(text, onIssue);
    }

    /**
     * Get the number of characters in this {@link JsonDocumentValue}.
     */
    public abstract getLength(): number;

    /**
     * Get the combined length of the provided {@link Token}s, {@link JsonDocumentValue}s, and
     * {@link JsonDocumentProperty}s.
     * @param tokensValuesAndProperties The {@link Token}s, {@link JsonDocumentValue}s, and
     * {@link JsonDocumentProperty} to get the combined length of.
     */
    public static getLength(tokensValuesAndProperties: JavascriptIterable<Token | JsonDocumentValue | JsonDocumentProperty>): number
    {
        Pre.condition.assertNotEmpty(tokensValuesAndProperties, "tokensValuesAndProperties");

        let length: number = 0;
        for (const tokenValueOrProperty of tokensValuesAndProperties)
        {
            length += tokenValueOrProperty.getLength();
        }
        return length;
    }

    /**
     * Get the text that this {@link JsonDocumentValue} was parsed from.
     */
    public abstract getText(): string;

    /**
     * Get the combined text of the provided {@link Token}s, {@link JsonDocumentValue}s, and
     * {@link JsonDocumentProperty}s.
     * @param tokensValuesAndProperties The {@link Token}s, {@link JsonDocumentValue}s, and
     * {@link JsonDocumentProperty}s to get the combined text of.
     */
    public static getText(tokensValuesAndProperties: JavascriptIterable<Token | JsonDocumentValue | JsonDocumentProperty>): string
    {
        Pre.condition.assertNotEmpty(tokensValuesAndProperties, "tokensValuesAndProperties");

        let text: string = "";
        for (const tokenValueOrProperty of tokensValuesAndProperties)
        {
            text += tokenValueOrProperty.getText();
        }
        return text;
    }

    /**
     * Get the {@link String} representation of this {@link JsonDocumentValue}.
     */
    public toString(): string
    {
        return JsonDocumentValue.toString(this);
    }

    /**
     * Get the {@link String} representation of the provided {@link JsonDocumentValue}.
     * @param value The {@link JsonDocumentValue} to get the {@link String} representation of.
     */
    public static toString(value: JsonDocumentValue): string
    {
        Pre.condition.assertNotUndefinedAndNotNull(value, "value");

        return value.getText();
    }

    /**
     * Get the value at the provided path from the provided container.
     * @param value The value to get a value from.
     * @param path The path to the value.
     */
    public static getValue(value: JsonDocumentValue | undefined, path: (string | number)[]): Result<JsonDocumentValue | undefined>
    {
        Pre.condition.assertNotUndefinedAndNotNull(value, "container");

        return Result.create(() =>
        {
            let currentPath = "";
            for (const pathPart of path)
            {
                currentPath = currentPath === ""
                    ? pathPart.toString()
                    : `${currentPath}.${pathPart}`;

                if (isString(pathPart))
                {
                    if (!instanceOfType(value, JsonDocumentObject))
                    {
                        throw new WrongTypeError(`Expected the value at ${escapeAndQuote(currentPath)} to be an object, but was ${value} instead.`);
                    }
                    value = value.getValue(pathPart).await();
                }
                else
                {
                    if (!instanceOfType(value, JsonDocumentArray))
                    {
                        throw new WrongTypeError(`Expected the value at ${escapeAndQuote(currentPath)} to be an array, but was ${value} instead.`);
                    }
                    value = value.getValue(pathPart).await();
                }
            }
            return value;
        });
    }
}