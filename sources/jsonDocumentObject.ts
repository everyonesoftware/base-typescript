import { DocumentIssue } from "./documentIssue";
import { Iterable } from "./iterable";
import { Iterator } from "./iterator";
import { JavascriptIterable } from "./javascript";
import { JsonDocumentParser } from "./jsonDocumentParser";
import { JsonDocumentProperty } from "./jsonDocumentProperty";
import { JsonDocumentValue } from "./jsonDocumentValue";
import { NotFoundError } from "./notFoundError";
import { Pre } from "./pre";
import { Result } from "./result";
import { escapeAndQuote } from "./strings";
import { Token } from "./token";
import { Tokenizer } from "./tokenizer";

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

    /**
     * Iterate through each of the {@link JsonDocumentProperty}s that exist on this
     * {@link JsonDocumentObject}.
     */
    public iterateProperties(): Iterator<JsonDocumentProperty>
    {
        return Iterator.create(this.tokensValuesAndProperties)
            .whereInstanceOf(JsonDocumentProperty);
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

    // public get(propertyName)

    // private getAs<T extends JsonDocumentValue>(propertyName: string, type: Type<T>): Result<T>
    // {
    //     return Result.create(() =>
    //     {

    //         const root: JsonDocumentObject = this.getRootObject().await();
    //         return root.getAs(propertyName, type).await();
    //     });
    // }

    // public getString(propertyName: string): Result<JsonDocumentString>
    // {
    //     return this.getAs(propertyName, JsonDocumentString);
    // }

    // public getStringValue(propertyName: string): Result<string>
    // {
    //     return this.getString(propertyName)
    //         .then((json: JsonDocumentString) => json.getValue());
    // }

    // public getBoolean(propertyName: string): Result<JsonDocumentBoolean>
    // {
    //     return this.getAs(propertyName, JsonDocumentBoolean);
    // }

    // public getBooleanValue(propertyName: string): Result<boolean>
    // {
    //     return this.getBoolean(propertyName)
    //         .then((propertyValue: JsonDocumentBoolean) => propertyValue.getValue());
    // }

    // public getNumber(propertyName: string): Result<JsonDocumentNumber>
    // {
    //     return this.getAs(propertyName, JsonDocumentNumber);
    // }

    // public getNumberValue(propertyName: string): Result<number>
    // {
    //     return this.getNumber(propertyName)
    //         .then((propertyValue: JsonDocumentNumber) => propertyValue.getValue());
    // }

    // public getObject(propertyName: string): Result<JsonDocumentObject>
    // {
    //     return this.getAs(propertyName, JsonDocumentObject);
    // }

    // public getArray(propertyName: string): Result<JsonDocumentArray>
    // {
    //     return this.getAs(propertyName, JsonDocumentArray);
    // }
}