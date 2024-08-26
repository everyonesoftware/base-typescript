// import { DocumentIterator } from "./documentIterator";
// import { DocumentPosition } from "./documentPosition";
// import { DocumentRange } from "./documentRange";
// import { IteratorBase } from "./iteratorBase";
// import { JsonIssue } from "./jsonIssue";
// import { JsonNumber } from "./jsonNumber";
// import { JsonString } from "./jsonString";
// import { JsonToken } from "./jsonToken";
// import { Post } from "./post";
// import { Pre } from "./pre";
// import { StringIterator } from "./stringIterator";
// import { escapeAndQuote, isDigit, isLetter, isWhitespace } from "./strings";
// import { isString, isUndefinedOrNull } from "./types";

// export class JsonTokenizer extends IteratorBase<JsonToken>
// {
//     private readonly characterIterator: DocumentIterator;
//     private currentToken: JsonToken | undefined;
//     private started: boolean;
//     private readonly issueReporter: (issue: JsonIssue) => void;

//     private constructor(characterIterator: DocumentIterator, issueReporter?: (issue: JsonIssue) => void)
//     {
//         Pre.condition.assertNotUndefinedAndNotNull(characterIterator, "characterIterator");

//         super();

//         this.characterIterator = characterIterator;
//         this.started = false;
//         if (isUndefinedOrNull(issueReporter))
//         {
//             issueReporter = () => {};
//         }
//         this.issueReporter = issueReporter;
//     }

//     /**
//      * Create a new {@link JsonTokenizer} that tokenizes the provided characters.
//      * @param characters The characters to tokenize.
//      * @param issueReporter The function that will be used to report {@link JsonIssue}s.
//      */
//     public static create(characters: string, issueReporter?: (issue: JsonIssue) => void): JsonTokenizer
//     {
//         Pre.condition.assertNotUndefinedAndNotNull(characters, "characters");

//         return new JsonTokenizer(DocumentIterator.create(StringIterator.create(characters)), issueReporter);
//     }

//     public override next(): boolean
//     {
//         this.characterIterator.start();
//         this.started = true;

//         if (!this.hasCurrentCharacter())
//         {
//             this.currentToken = undefined;
//         }
//         else
//         {
//             switch (this.characterIterator.getCurrent())
//             {
//                 case "{":
//                     this.currentToken = JsonToken.leftCurlyBrace();
//                     this.nextCharacter();
//                     break;

//                 case "}":
//                     this.currentToken = JsonToken.rightCurlyBrace();
//                     this.nextCharacter();
//                     break;

//                 case "[":
//                     this.currentToken = JsonToken.leftSquareBracket();
//                     this.nextCharacter();
//                     break;

//                 case "]":
//                     this.currentToken = JsonToken.rightSquareBracket();
//                     this.nextCharacter();
//                     break;

//                 case `"`:
//                 case `'`:
//                     this.currentToken = this.readString();
//                     break;

//                 case `,`:
//                     this.currentToken = JsonToken.comma();
//                     this.nextCharacter();
//                     break;

//                 case `:`:
//                     this.currentToken = JsonToken.colon();
//                     this.nextCharacter();
//                     break;

//                 case `-`:
//                     this.currentToken = this.readNumber();
//                     break;

//                 default:
//                     if (isWhitespace(this.getCurrentCharacter()))
//                     {
//                         this.currentToken = this.readWhitespace();
//                     }
//                     else if (isLetter(this.getCurrentCharacter()))
//                     {
//                         this.currentToken = this.readLetters();
//                     }
//                     else if (isDigit(this.getCurrentCharacter()))
//                     {
//                         this.currentToken = this.readNumber();
//                     }
//                     else
//                     {
//                         this.reportError(`Unknown JSON character: ${escapeAndQuote(this.getCurrentCharacter())}`);
//                         this.currentToken = JsonToken.unknown(this.takeCurrentCharacter());
//                     }
//             }
//         }
//         return this.hasCurrent();
//     }

//     private reportError(message: string, range?: DocumentRange): void;
//     private reportError(parameters: { message: string, range?: DocumentRange }): void;
//     private reportError(messageOrParameters: string | { message: string, range?: DocumentRange }, range?: DocumentRange): void
//     {
//         let message: string;
//         if (isString(messageOrParameters))
//         {
//             message = messageOrParameters;
//         }
//         else
//         {
//             message = messageOrParameters.message;
//             range = messageOrParameters.range;
//         }
//         Pre.condition.assertNotEmpty(message, "message");

//         if (range === undefined)
//         {
//             const start: DocumentPosition = this.getCurrentPosition();
//             const character: string = this.getCurrentCharacter();
//             const end: DocumentPosition = start.plusColumns(character.length - 1);
//             range = DocumentRange.create(start, end);
//         }
//         this.issueReporter(JsonIssue.error(message, range));
//     }

//     private reportMissingValueError(missingValue: string, range: DocumentRange): void;
//     private reportMissingValueError(parameters: { missingValue: string, range: DocumentRange }): void;
//     private reportMissingValueError(missingValueOrParameters: string | { missingValue: string, range: DocumentRange }, range?: DocumentRange): void
//     {
//         let missingValue: string;
//         if (isString(missingValueOrParameters))
//         {
//             missingValue = missingValueOrParameters;
//         }
//         else
//         {
//             missingValue = missingValueOrParameters.missingValue;
//             range = missingValueOrParameters.range;
//         }
//         Pre.condition.assertNotEmpty(missingValue, "missingValue");
//         Pre.condition.assertNotUndefinedAndNotNull(range, "range");

//         this.reportError(`Missing ${missingValue}.`, range);
//     }

//     private reportWrongValueError(expected: string, actual: string, range: DocumentRange): void;
//     private reportWrongValueError(parameters: { expected: string, actual: string, range: DocumentRange }): void;
//     private reportWrongValueError(expectedOrParameters: string | { expected: string, actual: string, range: DocumentRange }, actual?: string, range?: DocumentRange): void
//     {
//         let expected: string;
//         if (isString(expectedOrParameters))
//         {
//             expected = expectedOrParameters;
//         }
//         else
//         {
//             expected = expectedOrParameters.expected;
//             actual = expectedOrParameters.actual;
//             range = expectedOrParameters.range;
//         }
//         Pre.condition.assertNotEmpty(expected, "expected");
//         Pre.condition.assertNotEmpty(actual, "actual");
//         Pre.condition.assertNotUndefinedAndNotNull(range, "range");

//         this.reportError(`Expected ${expected}, but found ${actual} instead.`, range);
//     } 

//     private hasCurrentCharacter(): boolean
//     {
//         return this.characterIterator.hasCurrent();
//     }

//     private getCurrentCharacter(): string
//     {
//         Pre.condition.assertTrue(this.hasCurrentCharacter(), "this.hasCurrentCharacter()");

//         return this.characterIterator.getCurrent();
//     }

//     private nextCharacter(): boolean
//     {
//         return this.characterIterator.next();
//     }

//     private takeCurrentCharacter(): string
//     {
//         Pre.condition.assertTrue(this.hasCurrentCharacter(), "this.hasCurrentCharacter()");

//         return this.characterIterator.takeCurrent();
//     }

//     private getCurrentPosition(): DocumentPosition
//     {
//         return this.characterIterator.getPosition();
//     }

//     private getPreviousPosition(): DocumentPosition
//     {
//         const currentPosition: DocumentPosition = this.getCurrentPosition();
//         return currentPosition.plusColumns(-1);
//     }

//     private readWhitespace(): JsonToken
//     {
//         Pre.condition.assertTrue(this.hasCurrentCharacter(), "this.hasCurrentCharacter()");
//         Pre.condition.assertTrue(isWhitespace(this.getCurrentCharacter()), "isWhitespace(this.getCurrentCharacter())");

//         let text: string = this.takeCurrentCharacter();
//         while (this.hasCurrentCharacter() && isWhitespace(this.getCurrentCharacter()))
//         {
//             text += this.takeCurrentCharacter();
//         }
//         return JsonToken.whitespace(text);
//     }

//     private readLetters(): JsonToken
//     {
//         Pre.condition.assertTrue(this.hasCurrentCharacter(), "this.hasCurrentCharacter()");
//         Pre.condition.assertTrue(isLetter(this.getCurrentCharacter()), "isLetter(this.getCurrentCharacter())");

//         let text: string = this.takeCurrentCharacter();
//         while (this.hasCurrentCharacter() && isLetter(this.getCurrentCharacter()))
//         {
//             text += this.takeCurrentCharacter();
//         }

//         let result: JsonToken;
//         switch (text)
//         {
//             case "null":
//                 result = JsonToken.null();
//                 break;

//             case "true":
//                 result = JsonToken.true();
//                 break;

//             case "false":
//                 result = JsonToken.false();
//                 break;

//             default:
//                 result = JsonToken.unknown(text);
//                 break;
//         }

//         return result;
//     }

//     private readString(): JsonString
//     {
//         Pre.condition.assertTrue(this.hasCurrentCharacter(), "this.hasCurrentCharacter()");
//         Pre.condition.assertOneOf([`"`, `'`], this.getCurrentCharacter(), "this.getCurrentCharacter()");

//         const start: DocumentPosition = this.getCurrentPosition();
//         let end: DocumentPosition | undefined = undefined;
//         const startQuote: string = this.takeCurrentCharacter();
//         let endQuote: string | undefined = undefined;
//         let escaped: boolean = false;
//         let value: string = "";
//         while (this.hasCurrentCharacter() && endQuote === undefined)
//         {
//             switch (this.getCurrentCharacter())
//             {
//                 case `"`:
//                     if (escaped)
//                     {
//                         escaped = false;
//                         value += this.takeCurrentCharacter();
//                     }
//                     else
//                     {
//                         end = this.getCurrentPosition();
//                         endQuote = this.takeCurrentCharacter();
//                     }
//                     break;

//                 case `\\`:
//                     value += this.takeCurrentCharacter();
//                     escaped = !escaped;
//                     break;

//                 default:
//                     const codePoint: number | undefined = this.getCurrentCharacter().codePointAt(0);
//                     let validCodePoint: boolean = false;
//                     if (codePoint !== undefined && 0x20 <= codePoint)
//                     {
//                         if (codePoint <= 0x21)
//                         {
//                             validCodePoint = true;
//                         }
//                         else if (0x23 <= codePoint)
//                         {
//                             if (codePoint <= 0x5B)
//                             {
//                                 validCodePoint = true;
//                             }
//                             else if (0x5D <= codePoint)
//                             {
//                                 if (codePoint <= 0x10FFFF)
//                                 {
//                                     validCodePoint = true;
//                                 }
//                             }
//                         }
//                     }

//                     if (!validCodePoint)
//                     {
//                         this.reportError(`Invalid string character: ${escapeAndQuote(this.getCurrentCharacter())} (${codePoint})`);
//                     }

//                     escaped = false;
//                     value += this.takeCurrentCharacter();
//                     break;
//             }
//         }

//         const hasEndQuote: boolean = (endQuote !== undefined);
//         if (!hasEndQuote)
//         {
//             end = this.getCurrentPosition();
//             this.reportMissingValueError({
//                 missingValue: `string end quote: ${escapeAndQuote(startQuote)} (${startQuote.codePointAt(0)})`,
//                 range: DocumentRange.create(start, end),
//             });
//         }

//         return JsonString.create(value, startQuote, !hasEndQuote);
//     }

//     private readNumber(): JsonToken
//     {
//         Pre.condition.assertTrue(this.hasCurrentCharacter(), "this.hasCurrentCharacter()");
//         Pre.condition.assertTrue('-' === this.getCurrentCharacter() || isDigit(this.getCurrentCharacter()), "'-' == this.getCurrentCharacter() || isDigit(this.getCurrentCharacter()");

//         let result: JsonToken | undefined = undefined;

//         let start: DocumentPosition = this.getCurrentPosition();

//         let text: string = "";
//         if (this.getCurrentCharacter() === "-")
//         {
//             text += this.takeCurrentCharacter();

//             if (!this.hasCurrentCharacter() || !isDigit(this.getCurrentCharacter()))
//             {
//                 this.reportMissingValueError(`integer portion of number`, DocumentRange.create(start));
//                 result = JsonToken.unknown(text);
//             }
//         }

//         if (result === undefined)
//         {
//             text += this.takeCurrentCharacter();
//             if (!text.endsWith("0"))
//             {
//                 while (this.hasCurrentCharacter() && isDigit(this.getCurrentCharacter()))
//                 {
//                     text += this.takeCurrentCharacter();
//                 }
//             }

//             if (this.hasCurrentCharacter() && this.getCurrentCharacter() === ".")
//             {
//                 text += this.takeCurrentCharacter();

//                 if (!this.hasCurrentCharacter() || !isDigit(this.getCurrentCharacter()))
//                 {
//                     this.reportMissingValueError("fractional portion of number", DocumentRange.create(start, this.getPreviousPosition()));
//                     result = JsonNumber.create()
//                 }

//                 text += this.takeCurrentCharacter();
//                 while (this.hasCurrentCharacter() && isDigit(this.getCurrentCharacter()))
//                 {
//                     text += this.takeCurrentCharacter();
//                 }
//             }

//             if (this.hasCurrentCharacter() && (this.getCurrentCharacter() === "e" || this.getCurrentCharacter() === "E"))
//             {
//                 text += this.takeCurrentCharacter();

//                 if (!this.hasCurrentCharacter())
//                 {
//                     throw new MissingValueParseError("exponent portion of number");
//                 }
//                 else if (this.getCurrentCharacter() === "-" || this.getCurrentCharacter() === "+")
//                 {
//                     text += this.takeCurrentCharacter();
//                 }

//                 if (!this.hasCurrentCharacter())
//                 {
//                     throw new MissingValueParseError("exponent portion of number");
//                 }
//                 else if (!isDigit(this.getCurrentCharacter()))
//                 {
//                     throw new WrongValueParseError({
//                         expected: "exponent portion of number",
//                         actual: escapeAndQuote(this.getCurrentCharacter()),
//                     });
//                 }
//                 else
//                 {
//                     text += this.takeCurrentCharacter();
//                     while (this.hasCurrentCharacter() && isDigit(this.getCurrentCharacter()))
//                     {
//                         text += this.takeCurrentCharacter();
//                     }
//                 }
//             }

//             const value: number = parseFloat(text);
//             result = JsonNumber.create(value);
//         }
        
//         Post.condition.assertNotUndefinedAndNotNull(result, "result");

//         return result;
//     }

//     public override hasStarted(): boolean
//     {
//         return this.started;
//     }

//     public override hasCurrent(): boolean
//     {
//         return this.currentToken !== undefined;
//     }

//     public override getCurrent(): JsonToken
//     {
//         Pre.condition.assertTrue(this.hasCurrent(), "this.hasCurrent()");

//         return this.currentToken!;
//     }
// }