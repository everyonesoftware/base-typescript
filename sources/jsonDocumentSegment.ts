// import { DocumentPosition } from "./documentPosition";
// import { DocumentRange } from "./documentRange";
// import { JsonDocumentBoolean } from "./jsonDocumentBoolean";
// import { JsonNull } from "./jsonNull";
// import { JsonNumber } from "./jsonNumber";
// import { JsonObject } from "./jsonObject";
// import { JsonSegment } from "./jsonSegment";
// import { JsonSegmentType } from "./jsonSegmentType";
// import { JsonString } from "./jsonString";
// import { Pre } from "./pre";
// import { Result } from "./result";
// import { Type } from "./types";

// export abstract class JsonDocumentSegment implements JsonSegment
// {
//     protected constructor()
//     {
//     }

//     public static boolean(text: string, start: DocumentPosition): JsonDocumentBoolean
//     {
//         return JsonDocumentBoolean.create(text, start);
//     }

//     public static number(value: number): JsonNumber
//     {
//         return JsonNumber.create(value);
//     }

//     public static string(value: string, quote: string = `"`): JsonString
//     {
//         return JsonString.create(value, quote);
//     }

//     public static null(): JsonNull
//     {
//         return JsonNull.create();
//     }

//     public static object(): JsonObject
//     {
//         return JsonObject.create();
//     }

//     public abstract getSegmentType(): JsonSegmentType;

//     public abstract toString(): string;

//     public as<T extends JsonSegment>(type: Type<T>): Result<T>
//     {
//         return JsonSegment.as(this, type);
//     }

//     /**
//      * Get the {@link DocumentRange} that contains this {@link JsonDocumentSegment}.
//      */
//     public abstract getRange(): DocumentRange;

//     public getStart(): DocumentPosition
//     {
//         return JsonDocumentSegment.getStart(this);
//     }

//     public static getStart(segment: JsonDocumentSegment): DocumentPosition
//     {
//         Pre.condition.assertNotUndefinedAndNotNull(segment, "segment");

//         return segment.getRange().getStart();
//     }

//     public getEnd(): DocumentPosition
//     {
//         return JsonDocumentSegment.getEnd(this);
//     }

//     public static getEnd(segment: JsonDocumentSegment): DocumentPosition
//     {
//         Pre.condition.assertNotUndefinedAndNotNull(segment, "segment");

//         return segment.getRange().getEnd();
//     }
// }