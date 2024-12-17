import { DocumentIssue } from "./documentIssue";
import { Iterable } from "./iterable";
import { Iterator } from "./iterator";
import { JavascriptIterable } from "./javascript";
import { JsonDocumentArrayElementIterator } from "./jsonDocumentArrayElementIterator";
import { JsonDocumentBoolean } from "./jsonDocumentBoolean";
import { JsonDocumentNumber } from "./jsonDocumentNumber";
import { JsonDocumentObject } from "./jsonDocumentObject";
import { JsonDocumentParser } from "./jsonDocumentParser";
import { JsonDocumentString } from "./jsonDocumentString";
import { JsonDocumentValue } from "./jsonDocumentValue";
import { Pre } from "./pre";
import { Result } from "./result";
import { Token } from "./token";
import { Tokenizer } from "./tokenizer";
import { instanceOfType, Type } from "./types";
import { WrongTypeError } from "./wrongTypeError";

export class JsonDocumentArray implements JsonDocumentValue
{
    private readonly tokensAndValues: JavascriptIterable<Token | JsonDocumentValue>;
    
    private constructor(tokensAndValues: JavascriptIterable<Token | JsonDocumentValue>)
    {
        Pre.condition.assertNotEmpty(tokensAndValues, "tokensAndValues");
        Pre.condition.assertEqual(Token.leftSquareBrace(), Iterable.first(tokensAndValues).await(), "Iterable.first(tokensAndValues).await()");

        this.tokensAndValues = tokensAndValues;
    }

    public static create(tokensAndValues: JavascriptIterable<Token | JsonDocumentValue>): JsonDocumentArray
    {
        return new JsonDocumentArray(tokensAndValues);
    }

    /**
     * Parse a {@link JsonDocumentArray} from the provided text. If an array can't be parsed, then
     * undefined will be returned.
     * @param text The text to parse.
     * @param onIssue The function that will be invoked if any issues are encountered.
     */
    public static parse(text: string | JavascriptIterable<string> | Tokenizer, onIssue?: (issue: DocumentIssue) => void): Result<JsonDocumentArray | undefined>
    {
        return JsonDocumentParser.create().parseArray(text, onIssue);
    }

    public getLength(): number
    {
        return JsonDocumentValue.getLength(this.tokensAndValues);
    }

    public getText(): string
    {
        return JsonDocumentValue.getText(this.tokensAndValues);
    }

    /**
     * Get the number of elements in this {@link JsonDocumentArray}.
     */
    public getElementCount(): number
    {
        return this.iterateElements().getCount();
    }

    /**
     * Iterate through each of the {@link JsonDocumentProperty}s that exist on this
     * {@link JsonDocumentObject}.
     */
    public iterateElements(): Iterator<JsonDocumentValue | undefined>
    {
        return JsonDocumentArrayElementIterator.create(Iterator.create(this.tokensAndValues));
    }

    /**
     * Get the {@link JsonDocumentValue} at the provided index of this {@link JsonDocumentArray}.
     * @param index The index of the {@link JsonDocumentValue} to return.
     */
    public getValue(index: number): Result<JsonDocumentValue | undefined>
    {
        Pre.condition.assertNotUndefinedAndNotNull(index, "index");
        Pre.condition.assertInteger(index, "index");
        Pre.condition.assertAccessIndex(index, this.getElementCount(), "index");

        return this.iterateElements().skip(index).first();
    }

    /**
     * Get the value at the provided index. If the value is not of the provided {@link Type}, then a
     * {@link WrongTypeError} will be returned.
     * @param index The index of the element to return.
     * @param type The {@link Type} that the element is expected to be.
     */
    private getAs<T extends JsonDocumentValue>(index: number, type: Type<T>, expectedTypeName: string): Result<T>
    {
        Pre.condition.assertAccessIndex(index, this.getElementCount(), "index");
        Pre.condition.assertNotUndefinedAndNotNull(type, "type");
        Pre.condition.assertNotEmpty(expectedTypeName, "expectedTypeName");

        return Result.create(() =>
        {
            const value: JsonDocumentValue | undefined = this.getValue(index).await();
            if (!instanceOfType(value, type))
            {
                throw new WrongTypeError(`Expected value at index ${index} to be ${expectedTypeName}, but was ${value} instead.`);
            }
            return value;
        });
    }

    /**
     * Get the value at the provided index as a {@link JsonDocumentString}.
     * @param index The index of the value to return as a {@link JsonDocumentString}.
     */
    public getStringValue(index: number): Result<JsonDocumentString>
    {
        return this.getAs(index, JsonDocumentString, "a string");
    }

    /**
     * Get the value at the provided index as a {@link string}.
     * @param index The index of the value to return as a {@link string}.
     */
    public getString(index: number): Result<string>
    {
        return this.getStringValue(index)
            .then((json: JsonDocumentString) => json.getValue());
    }

    /**
     * Get the value at the provided index as a {@link JsonDocumentBoolean}.
     * @param index The index of the value to return as a {@link JsonDocumentBoolean}.
     */
    public getBooleanValue(index: number): Result<JsonDocumentBoolean>
    {
        return this.getAs(index, JsonDocumentBoolean, "a boolean");
    }

    /**
     * Get the value at the provided index as a {@link boolean}.
     * @param index The index of the value to return as a {@link boolean}.
     */
    public getBoolean(index: number): Result<boolean>
    {
        return this.getBooleanValue(index)
            .then((propertyValue: JsonDocumentBoolean) => propertyValue.getValue());
    }

    /**
     * Get the value at the provided index as a {@link JsonDocumentNumber}.
     * @param index The index of the value to return as a {@link JsonDocumentNumber}.
     */
    public getNumberValue(index: number): Result<JsonDocumentNumber>
    {
        return this.getAs(index, JsonDocumentNumber, "a number");
    }

    /**
     * Get the value at the provided index as a {@link number}.
     * @param index The index of the value to return as a {@link number}.
     */
    public getNumber(index: number): Result<number>
    {
        return this.getNumberValue(index)
            .then((propertyValue: JsonDocumentNumber) => propertyValue.getValue());
    }

    /**
     * Get the value at the provided index as a {@link JsonDocumentObject}.
     * @param index The index of the value to return as a {@link JsonDocumentObject}.
     */
    public getObject(index: number): Result<JsonDocumentObject>
    {
        return this.getAs(index, JsonDocumentObject, "an object");
    }

    /**
     * Get the value at the provided index as a {@link JsonDocumentArray}.
     * @param index The index of the value to return as a {@link JsonDocumentArray}.
     */
    public getArray(index: number): Result<JsonDocumentArray>
    {
        return this.getAs(index, JsonDocumentArray, "an array");
    }
}