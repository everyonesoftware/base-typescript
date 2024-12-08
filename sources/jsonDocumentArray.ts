import { DocumentIssue } from "./documentIssue";
import { Iterable } from "./iterable";
import { JavascriptIterable } from "./javascript";
import { JsonDocumentParser } from "./jsonDocumentParser";
import { JsonDocumentValue } from "./jsonDocumentValue";
import { Pre } from "./pre";
import { Result } from "./result";
import { Token } from "./token";
import { Tokenizer } from "./tokenizer";

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
}