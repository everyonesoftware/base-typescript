// import { DocumentRange } from "./documentRange";
// import { JsonIssueType } from "./jsonIssueType"
// import { Pre } from "./pre";

// /**
//  * An issue that can be reported while tokenizing or parsing a JSON document.
//  */
// export class JsonIssue
// {
//     private readonly type: JsonIssueType;
//     private readonly message: string;
//     private readonly range: DocumentRange;

//     protected constructor(type: JsonIssueType, message: string, range: DocumentRange)
//     {
//         Pre.condition.assertNotUndefinedAndNotNull(type, "type");
//         Pre.condition.assertNotEmpty(message, "message");
//         Pre.condition.assertNotUndefinedAndNotNull(range, "range");

//         this.type = type;
//         this.message = message;
//         this.range = range;
//     }

//     public static create(type: JsonIssueType, message: string, range: DocumentRange): JsonIssue
//     {
//         return new JsonIssue(type, message, range);
//     }

//     public static error(message: string, range: DocumentRange): JsonIssue
//     {
//         return JsonIssue.create(JsonIssueType.Error, message, range);
//     }

//     public getType(): JsonIssueType
//     {
//         return this.type;
//     }

//     public getMessage(): string
//     {
//         return this.message;
//     }

//     public getRange(): DocumentRange
//     {
//         return this.range;
//     }
// }