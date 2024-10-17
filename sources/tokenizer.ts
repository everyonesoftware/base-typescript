import { Token } from "./token";
import { TokenCreator } from "./tokenCreator";
import { Iterator } from "./iterator";
import { BasicTokenizer } from "./basicTokenizer";
import { IteratorToJavascriptIteratorAdapter } from "./iteratorToJavascriptIteratorAdapter";
import { MapIterator } from "./mapIterator";
import { Result } from "./result";
import { Type } from "./types";

export abstract class Tokenizer implements Iterator<Token>
{
    public static create(characters: string | Iterator<string>, tokenCreator?: TokenCreator): BasicTokenizer
    {
        return BasicTokenizer.create(characters, tokenCreator);
    }

    public abstract next(): boolean;

    public abstract hasStarted(): boolean;

    public abstract hasCurrent(): boolean;

    public abstract getCurrent(): Token;

    public start(): this
    {
        return Iterator.start<Token,this>(this);
    }

    public takeCurrent(): Token
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

    public toArray(): Token[]
    {
        return Iterator.toArray(this);
    }

    public where(condition: (value: Token) => boolean): Iterator<Token>
    {
        return Iterator.where(this, condition);
    }

    public map<TOutput>(mapping: (value: Token) => TOutput): MapIterator<Token, TOutput>
    {
        return Iterator.map(this, mapping);
    }

    public instanceOf<U extends Token>(type: Type<U>): Iterator<U>
    {
        return Iterator.instanceOf(this, type);
    }

    public first(): Result<Token>
    {
        return Iterator.first(this);
    }

    public take(maximumToTake: number): Iterator<Token>
    {
        return Iterator.take(this, maximumToTake);
    }

    public [Symbol.iterator](): IteratorToJavascriptIteratorAdapter<Token>
    {
        return Iterator[Symbol.iterator](this);
    }
}