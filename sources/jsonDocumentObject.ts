import { DocumentIssue } from "./documentIssue";
import { Iterable } from "./iterable";
import { Iterator } from "./iterator";
import { JavascriptIterable } from "./javascript";
import { JsonDocumentArray } from "./jsonDocumentArray";
import { JsonDocumentBoolean } from "./jsonDocumentBoolean";
import { JsonDocumentNumber } from "./jsonDocumentNumber";
import { JsonDocumentParser } from "./jsonDocumentParser";
import { JsonDocumentProperty } from "./jsonDocumentProperty";
import { JsonDocumentString } from "./jsonDocumentString";
import { JsonDocumentValue } from "./jsonDocumentValue";
import { NotFoundError } from "./notFoundError";
import { Pre } from "./pre";
import { Result } from "./result";
import { escapeAndQuote } from "./strings";
import { Token } from "./token";
import { Tokenizer } from "./tokenizer";
import { instanceOfType, Type } from "./types";
import { WrongTypeError } from "./wrongTypeError";

export class JsonDocumentObject implements JsonDocumentValue
{
    private readonly tokensValuesAndProperties: JavascriptIterable<Token | JsonDocumentValue | JsonDocumentProperty>;
    
    private constructor(tokensValuesAndProperties: JavascriptIterable<Token | JsonDocumentValue | JsonDocumentProperty>)
    {
        Pre.condition.assertNotEmpty(tokensValuesAndProperties, "tokensValuesAndProperties");
        Pre.condition.assertEqual(Token.leftCurlyBracket(), Iterable.first(tokensValuesAndProperties).await(), "Iterable.first(tokensValuesAndProperties).await()");

        this.tokensValuesAndProperties = tokensValuesAndProperties;
    }

    public static create(tokensValuesAndProperties: JavascriptIterable<Token | JsonDocumentValue | JsonDocumentProperty>): JsonDocumentObject
    {
        return new JsonDocumentObject(tokensValuesAndProperties);
    }

    /**
     * Parse a {@link JsonDocumentObject} from the provided text. If an object can't be parsed, then
     * undefined will be returned.
     * @param text The text to parse.
     * @param onIssue The function that will be invoked if any issues are encountered.
     */
    public static parse(text: string | JavascriptIterable<string> | Tokenizer, onIssue?: (issue: DocumentIssue) => void): Result<JsonDocumentObject | undefined>
    {
        return JsonDocumentParser.create().parseObject(text, onIssue);
    }

    public getLength(): number
    {
        return JsonDocumentValue.getLength(this.tokensValuesAndProperties);
    }

    public getText(): string
    {
        return JsonDocumentValue.getText(this.tokensValuesAndProperties);
    }

    public toString(): string
    {
        return JsonDocumentValue.toString(this);
    }

    /**
     * Iterate through each of the {@link JsonDocumentProperty}s that exist on this
     * {@link JsonDocumentObject}.
     */
    public iterateProperties(): Iterator<JsonDocumentProperty>
    {
        return Iterator.create(this.tokensValuesAndProperties)
            .whereInstanceOfType(JsonDocumentProperty);
    }

    /**
     * Get the first {@link JsonDocumentProperty} in this {@link JsonDocumentObject} that has the
     * provided property name.
     * @param propertyName The name of the {@link JsonDocumentProperty} to return.
     */
    public getProperty(propertyName: string): Result<JsonDocumentProperty>
    {
        Pre.condition.assertNotUndefinedAndNotNull(propertyName, "propertyName");

        return Result.create(() =>
        {
            return this.iterateProperties()
                .first((property: JsonDocumentProperty) => property.getName() === propertyName)
                .convertError(NotFoundError, () =>
                {
                    return new NotFoundError(`No property with the name ${escapeAndQuote(propertyName)} found.`);
                })
                .await();
        });
    }

    /**
     * Get the value of the first {@link JsonDocumentProperty} with the provided name. If no
     * {@link JsonDocumentProperty} is found with the provided name, then return a
     * {@link NotFoundError}. If the {@link JsonDocumentProperty} is found but it doesn't have a
     * value, then undefined will be returned.
     * @param propertyName The name of the {@link JsonDocumentProperty} to get the value of.
     * @param additionalPathParts The additional path parts to traverse.
     */
    public getValue(propertyName: string, ...additionalPathParts: (string | number)[]): Result<JsonDocumentValue | undefined>
    {
        return Result.create(() =>
        {
            let result: JsonDocumentValue | undefined;
            if (additionalPathParts.length === 0)
            {
                const property: JsonDocumentProperty = this.getProperty(propertyName).await();
                result = property.getValue();
            }
            else
            {
                result = JsonDocumentValue.getValue(this, [propertyName, ...additionalPathParts]).await();
            }
            return result;
        });
    }

    /**
     * Get the value of the first {@link JsonDocumentProperty} with the provided name. If the
     * property doesn't have a value, then a {@link WrongTypeError} will be returned. If the
     * property has a value but it isn't the expected {@link Type}, then a {@link WrongTypeError}
     * will be returned.
     * @param propertyName The name of the {@link JsonDocumentProperty} to get the value of.
     * @param type The {@link Type} that the value is expected to be.
     */
    private getAs<T extends JsonDocumentValue>(propertyName: string, additionalPathParts: (string | number)[], type: Type<T>, expectedTypeName: string): Result<T>
    {
        Pre.condition.assertNotUndefinedAndNotNull(propertyName, "propertyName");
        Pre.condition.assertNotUndefinedAndNotNull(additionalPathParts, "additionalPathParts");
        Pre.condition.assertNotUndefinedAndNotNull(type, "type");
        Pre.condition.assertNotEmpty(expectedTypeName, "expectedTypeName");

        return Result.create(() =>
        {
            const value: JsonDocumentValue | undefined = this.getValue(propertyName).await();
            if (!instanceOfType(value, type))
            {
                throw new WrongTypeError(`Expected property value to be ${expectedTypeName}, but was ${value} instead.`);
            }
            return value;
        });
    }

    /**
     * Get the value of the property with the provided name as a {@link JsonDocumentString}.
     * @param propertyName The name of the property to get the value of as a
     * {@link JsonDocumentString}.
     */
    public getStringValue(propertyName: string, ...additionalPathParts: (string | number)[]): Result<JsonDocumentString>
    {
        return this.getAs(propertyName, additionalPathParts, JsonDocumentString, "a string");
    }

    /**
     * Get the value of the property with the provided name as a {@link string}.
     * @param propertyName The name of the property to get the value of as a {@link string}.
     */
    public getString(propertyName: string, ...additionalPathParts: (string | number)[]): Result<string>
    {
        return this.getStringValue(propertyName, ...additionalPathParts)
            .then((json: JsonDocumentString) => json.getValue());
    }

    /**
     * Get the value of the property with the provided name as a {@link JsonDocumentBoolean}.
     * @param propertyName The name of the property to get the value of as a
     * {@link JsonDocumentBoolean}.
     */
    public getBooleanValue(propertyName: string, ...additionalPathParts: (string | number)[]): Result<JsonDocumentBoolean>
    {
        return this.getAs(propertyName, additionalPathParts, JsonDocumentBoolean, "a boolean");
    }

    public getBoolean(propertyName: string, ...additionalPathParts: (string | number)[]): Result<boolean>
    {
        return this.getBooleanValue(propertyName, ...additionalPathParts)
            .then((propertyValue: JsonDocumentBoolean) => propertyValue.getValue());
    }

    public getNumberValue(propertyName: string, ...additionalPathParts: (string | number)[]): Result<JsonDocumentNumber>
    {
        return this.getAs(propertyName, additionalPathParts, JsonDocumentNumber, "a number");
    }

    public getNumber(propertyName: string, ...additionalPathParts: (string | number)[]): Result<number>
    {
        return this.getNumberValue(propertyName, ...additionalPathParts)
            .then((propertyValue: JsonDocumentNumber) => propertyValue.getValue());
    }

    public getObject(propertyName: string, ...additionalPathParts: (string | number)[]): Result<JsonDocumentObject>
    {
        return this.getAs(propertyName, additionalPathParts, JsonDocumentObject, "an object");
    }

    public getArray(propertyName: string, ...additionalPathParts: (string | number)[]): Result<JsonDocumentArray>
    {
        return this.getAs(propertyName, additionalPathParts, JsonDocumentArray, "an array");
    }
}