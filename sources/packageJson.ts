// import { Iterator } from "./iterator";
// import { JsonArray } from "./jsonArray";
// import { JsonBoolean } from "./jsonBoolean";
// import { JsonDocument } from "./jsonDocument";
// import { JsonNumber } from "./jsonNumber";
// import { JsonObject } from "./jsonObject";
// import { JsonSegment } from "./jsonSegment";
// import { JsonString } from "./jsonString";
// import { Pre } from "./pre";
// import { Result } from "./result";
// import { Type } from "./types";

// /**
//  * An object that provides methods for interacting with a parsed package.json document.
//  */
// export class PackageJson
// {
//     private readonly jsonDocument: JsonDocument;

//     private constructor(jsonDocument: JsonDocument)
//     {
//         Pre.condition.assertNotUndefinedAndNotNull(jsonDocument, "jsonDocument");

//         this.jsonDocument = jsonDocument;
//     }

//     public static create(jsonDocument?: JsonDocument): PackageJson
//     {
//         if (jsonDocument === undefined)
//         {
//             jsonDocument = JsonDocument.create();
//         }
//         return new PackageJson(jsonDocument);
//     }

//     /**
//      * Parse a {@link PackageJson} object from the provided text.
//      * @param text The text to parse.
//      */
//     public static parse(text: string): Result<PackageJson>
//     {
//         Pre.condition.assertNotUndefinedAndNotNull(text, "text");

//         return JsonDocument.parse(text)
//             .then((jsonDocument: JsonDocument) => PackageJson.create(jsonDocument));
//     }

//     public getDocument(): JsonDocument
//     {
//         return this.jsonDocument;
//     }

//     public getRootObject(): Result<JsonObject>
//     {
//         return this.getDocument().getRootObject();
//     }

//     public getAs<T extends JsonSegment>(propertyName: string, type: Type<T>): Result<T>
//     {
//         return Result.create(() =>
//         {
//             const root: JsonObject = this.getRootObject().await();
//             return root.getAs(propertyName, type).await();
//         });
//     }

//     public getString(propertyName: string): Result<JsonString>
//     {
//         return this.getAs(propertyName, JsonString);
//     }

//     public getStringValue(propertyName: string): Result<string>
//     {
//         return this.getString(propertyName)
//             .then((json: JsonString) => json.getValue());
//     }

//     public getBoolean(propertyName: string): Result<JsonBoolean>
//     {
//         return this.getAs(propertyName, JsonBoolean);
//     }

//     public getBooleanValue(propertyName: string): Result<boolean>
//     {
//         return this.getBoolean(propertyName)
//             .then((propertyValue: JsonBoolean) => propertyValue.getValue());
//     }

//     public getNumber(propertyName: string): Result<JsonNumber>
//     {
//         return this.getAs(propertyName, JsonNumber);
//     }

//     public getNumberValue(propertyName: string): Result<number>
//     {
//         return this.getNumber(propertyName)
//             .then((propertyValue: JsonNumber) => propertyValue.getValue());
//     }

//     public getObject(propertyName: string): Result<JsonObject>
//     {
//         return this.getAs(propertyName, JsonObject);
//     }

//     public getArray(propertyName: string): Result<JsonArray>
//     {
//         return this.getAs(propertyName, JsonArray);
//     }

//     /**
//      * Get the name of the package.
//      */
//     public getName(): Result<string>
//     {
//         return this.getStringValue("name");
//     }

//     public getDisplayName(): Result<string>
//     {
//         return this.getStringValue("displayName");
//     }

//     public getVersion(): Result<string>
//     {
//         return this.getStringValue("version");
//     }

//     public iterateFiles(): Result<Iterator<string>>
//     {
//         return Result.create(() =>
//         {
//             const json: JsonArray = this.getArray("files").await();
//             return json.iterate()
//                 .instanceOf(JsonString)
//                 .map((element: JsonString) => element.getValue());
//         });
//     }

//     private innerIterateStringMap(propertyName: string): Result<Iterator<[string, string]>>
//     {
//         return Result.create(() =>
//         {
//             const json: JsonObject = this.getObject(propertyName).await();
//             return json.iterate()
//                 .where((entry: [string, JsonSegment]) => entry[1] instanceof JsonString)
//                 .map((entry: [string, JsonSegment]) => [entry[0], (entry[1] as JsonString).getValue()]);
//         });
//     }

//     public iterateScripts(): Result<Iterator<[string, string]>>
//     {
//         return this.innerIterateStringMap("scripts");
//     }

//     public iterateDependencies(): Result<Iterator<[string, string]>>
//     {
//         return this.innerIterateStringMap("dependencies");
//     }

//     public iterateDevDependencies(): Result<Iterator<[string, string]>>
//     {
//         return this.innerIterateStringMap("devDependencies");
//     }
// }