import { JsonDocument } from "./jsonDocument";
import { JsonObject } from "./jsonObject";
import { Pre } from "./pre";
import { Result } from "./result";

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

    public static create(jsonDocument?: JsonDocument): PackageJson
    {
        if (jsonDocument === undefined)
        {
            jsonDocument = JsonDocument.create();
        }
        return new PackageJson(jsonDocument);
    }

    /**
     * Parse a {@link PackageJson} object from the provided text.
     * @param text The text to parse.
     */
    public static parse(text: string): Result<PackageJson>
    {
        Pre.condition.assertNotUndefinedAndNotNull(text, "text");

        return JsonDocument.parse(text)
            .then((jsonDocument: JsonDocument) => PackageJson.create(jsonDocument));
    }

    public getDocument(): JsonDocument
    {
        return this.jsonDocument;
    }

    /**
     * Get the name of the package.
     */
    public getName(): Result<string>
    {
        return Result.create(() =>
        {
            const root: JsonObject = this.jsonDocument.getRootObject().await();
            return root.getStringValue("name").await();
        });
    }
}