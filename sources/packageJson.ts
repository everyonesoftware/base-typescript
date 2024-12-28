import { DocumentIssue } from "./documentIssue";
import { JavascriptIterable } from "./javascript";
import { JsonDocument } from "./jsonDocument";
import { JsonDocumentObject } from "./jsonDocumentObject";
import { Pre } from "./pre";
import { Result } from "./result";
import { Tokenizer } from "./tokenizer";

/**
 * An object that provides methods for interacting with a parsed package.json document.
 */
export class PackageJson
{
    private readonly jsonDocument: JsonDocument;

    private constructor(jsonDocument: JsonDocument)
    {
        Pre.condition.assertNotUndefinedAndNotNull(jsonDocument, "jsonDocument");

        this.jsonDocument = jsonDocument;
    }

    public static create(jsonDocument: JsonDocument): PackageJson
    {
        return new PackageJson(jsonDocument);
    }

    /**
     * Parse a {@link PackageJson} object from the provided text.
     * @param text The text to parse.
     */
    public static parse(text: string | JavascriptIterable<string> | Tokenizer, onIssue?: (issue: DocumentIssue) => void): Result<PackageJson>
    {
        Pre.condition.assertNotUndefinedAndNotNull(text, "text");

        return JsonDocument.parse(text, onIssue)
            .then((jsonDocument: JsonDocument) => PackageJson.create(jsonDocument));
    }

    public getDocument(): JsonDocument
    {
        return this.jsonDocument;
    }

    public getRootObject(): Result<JsonDocumentObject>
    {
        return this.getDocument().getRootObject();
    }

    // public getString(propertyName: string): Result<string>
    // {
    //     return this.getAs(propertyName, JsonDocumentString);
    // }

    // public getStringValue(propertyName: string): Result<JsonDocumentString>
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

    // /**
    //  * Get the name of the package.
    //  */
    // public getName(): Result<string>
    // {
    //     return this.getStringValue("name");
    // }

    // public getDisplayName(): Result<string>
    // {
    //     return this.getStringValue("displayName");
    // }

    // public getVersion(): Result<string>
    // {
    //     return this.getStringValue("version");
    // }

    // public iterateFiles(): Result<Iterator<string>>
    // {
    //     return Result.create(() =>
    //     {
    //         const json: JsonDocumentArray = this.getArray("files").await();
    //         return json.iterate()
    //             .instanceOf(JsonDocumentString)
    //             .map((element: JsonDocumentString) => element.getValue());
    //     });
    // }

    // private innerIterateStringMap(propertyName: string): Result<Iterator<[string, string]>>
    // {
    //     return Result.create(() =>
    //     {
    //         const json: JsonDocumentObject = this.getObject(propertyName).await();
    //         return json.iterate()
    //             .where((entry: [string, JsonDocumentValue]) => entry[1] instanceof JsonDocumentString)
    //             .map((entry: [string, JsonDocumentValue]) => [entry[0], (entry[1] as JsonDocumentString).getValue()]);
    //     });
    // }

    // public iterateScripts(): Result<Iterator<[string, string]>>
    // {
    //     return this.innerIterateStringMap("scripts");
    // }

    // public iterateDependencies(): Result<Iterator<[string, string]>>
    // {
    //     return this.innerIterateStringMap("dependencies");
    // }

    // public iterateDevDependencies(): Result<Iterator<[string, string]>>
    // {
    //     return this.innerIterateStringMap("devDependencies");
    // }
}