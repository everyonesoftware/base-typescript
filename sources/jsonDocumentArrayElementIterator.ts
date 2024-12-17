import { Iterator } from "./iterator";
import { IteratorToJavascriptIteratorAdapter } from "./iteratorToJavascriptIteratorAdapter";
import { JsonDocumentValue } from "./jsonDocumentValue";
import { MapIterator } from "./mapIterator";
import { Pre } from "./pre";
import { Result } from "./result";
import { Token } from "./token";
import { TokenType } from "./tokenType";
import { instanceOfType, Type } from "./types";

enum JsonDocumentArrayElementIteratorState
{
    Start,
    ExpectingComma,
    ExpectingValue,
    End,
}

export class JsonDocumentArrayElementIterator implements Iterator<JsonDocumentValue | undefined>
{
    private readonly tokensAndValues: Iterator<Token | JsonDocumentValue>;
    private started: boolean;
    private current: JsonDocumentValue | undefined;
    private state: JsonDocumentArrayElementIteratorState;
    
    private constructor(tokensAndValues: Iterator<Token | JsonDocumentValue>)
    {
        Pre.condition.assertNotUndefinedAndNotNull(tokensAndValues, "tokensAndValues");

        this.tokensAndValues = tokensAndValues;
        this.started = false;
        this.state = JsonDocumentArrayElementIteratorState.Start;
    }

    public static create(tokensAndValues: Iterator<Token | JsonDocumentValue>): JsonDocumentArrayElementIterator
    {
        return new JsonDocumentArrayElementIterator(tokensAndValues);
    }

    public next(): boolean
    {
        this.started = true;

        while (true)
        {
            if (!this.tokensAndValues.next())
            {
                this.current = undefined;
                this.state = (this.state === JsonDocumentArrayElementIteratorState.ExpectingValue
                    ? JsonDocumentArrayElementIteratorState.ExpectingComma
                    : JsonDocumentArrayElementIteratorState.End);
                break;
            }
            else
            {
                const currentTokenOrValue: Token | JsonDocumentValue = this.tokensAndValues.getCurrent();
                if (!instanceOfType(currentTokenOrValue, Token))
                {
                    this.current = currentTokenOrValue;
                    this.state = JsonDocumentArrayElementIteratorState.ExpectingComma;
                    break;
                }
                else if (currentTokenOrValue.getType() === TokenType.Comma)
                {
                    if (this.state === JsonDocumentArrayElementIteratorState.ExpectingComma)
                    {
                        this.state = JsonDocumentArrayElementIteratorState.ExpectingValue;
                    }
                    else
                    {
                        this.current = undefined;
                        this.state = JsonDocumentArrayElementIteratorState.ExpectingValue;
                        break;
                    }
                }
            }
        }

        return this.hasCurrent();
    }
    
    public hasStarted(): boolean
    {
        return this.started;
    }
    
    public hasCurrent(): boolean
    {
        let result: boolean;
        switch (this.state)
        {
            case JsonDocumentArrayElementIteratorState.ExpectingComma:
            case JsonDocumentArrayElementIteratorState.ExpectingValue:
                result = true;
                break;

            default:
                result = false;
                break;
        }
        return result;
    }
    
    public getCurrent(): JsonDocumentValue | undefined
    {
        Pre.condition.assertTrue(this.hasCurrent(), "this.hasCurrent()");

        return this.current;
    }
    
    public start(): this
    {
        return Iterator.start<JsonDocumentValue | undefined, this>(this);
    }
    
    public takeCurrent(): JsonDocumentValue | undefined
    {
        return Iterator.takeCurrent(this);
    }
    
    public any(): boolean
    {
        return Iterator.any(this);
    }
    
    public getCount(): number
    {
        return Iterator.getCount(this);
    }
    
    public toArray(): (JsonDocumentValue | undefined)[]
    {
        return Iterator.toArray(this);
    }
    
    public where(condition: (value: JsonDocumentValue | undefined) => boolean): Iterator<JsonDocumentValue | undefined>
    {
        return Iterator.where(this, condition);
    }
    
    public map<TOutput>(mapping: (value: JsonDocumentValue | undefined) => TOutput): MapIterator<JsonDocumentValue | undefined, TOutput>
    {
        return Iterator.map(this, mapping);
    }
    
    public whereInstanceOf<U extends JsonDocumentValue | undefined>(typeCheck: (value: JsonDocumentValue | undefined) => value is U): Iterator<U>
    {
        return Iterator.whereInstanceOf(this, typeCheck);
    }
    
    public whereInstanceOfType<U extends JsonDocumentValue | undefined>(type: Type<U>): Iterator<U>
    {
        return Iterator.whereInstanceOfType(this, type);
    }

    public first(condition?: ((value: JsonDocumentValue | undefined) => boolean) | undefined): Result<JsonDocumentValue | undefined>
    {
        return Iterator.first(this, condition);
    }

    public last(): Result<JsonDocumentValue | undefined>
    {
        return Iterator.last(this);
    }

    public take(maximumToTake: number): Iterator<JsonDocumentValue | undefined>
    {
        return Iterator.take(this, maximumToTake);
    }

    public skip(maximumToSkip: number): Iterator<JsonDocumentValue | undefined>
    {
        return Iterator.skip(this, maximumToSkip);
    }

    public [Symbol.iterator](): IteratorToJavascriptIteratorAdapter<JsonDocumentValue | undefined>
    {
        return Iterator[Symbol.iterator](this);
    }
}