import { Iterator } from "./iterator";
import { JsonDocument } from "./jsonDocument";
import { JsonObject } from "./jsonObject";
import { JsonSegment } from "./jsonSegment";
import { JsonString } from "./jsonString";
import { PackageJsonDependency } from "./packageJsonDependency";
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

    public getVersion(): Result<string>
    {
        return Result.create(() =>
        {
            const root: JsonObject = this.jsonDocument.getRootObject().await();
            return root.getStringValue("version").await();
        });
    }

    private innerIteratorDependencies(propertyName: string): Result<Iterator<PackageJsonDependency>>
    {
        return Result.create(() =>
        {
            const root: JsonObject = this.jsonDocument.getRootObject().await();
            const devDependencies: JsonObject = root.getObject(propertyName).await();
            return devDependencies.iterate()
                .where((entry: [string, JsonSegment]) => entry[1] instanceof JsonString)
                .map((entry: [string, JsonSegment]) =>
                {
                    const dependencyName: string = entry[0];
                    const dependencyVersionJson: JsonString = entry[1].as(JsonString).await();
                    const dependencyVersion: string = dependencyVersionJson.getValue();
                    return PackageJsonDependency.create(dependencyName, dependencyVersion);
                });
        });
    }

    public iterateDependencies(): Result<Iterator<PackageJsonDependency>>
    {
        return this.innerIteratorDependencies("dependencies");
    }

    public iterateDevDependencies(): Result<Iterator<PackageJsonDependency>>
    {
        return this.innerIteratorDependencies("devDependencies");
    }
}