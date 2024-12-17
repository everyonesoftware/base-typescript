import { Token } from "./token";
import { TokenCreator } from "./tokenCreator";
import { Iterator } from "./iterator";
import { BasicTokenizer } from "./basicTokenizer";
import { IteratorToJavascriptIteratorAdapter } from "./iteratorToJavascriptIteratorAdapter";
import { MapIterator } from "./mapIterator";
import { Result } from "./result";
import { Type } from "./types";
import { JavascriptIterable } from "./javascript";

export abstract class Tokenizer implements Iterator<Token>
{
    public static create(characters: string | JavascriptIterable<string>, tokenCreator?: TokenCreator): BasicTokenizer
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

    public whereInstanceOf<U extends Token>(typeCheck: (value: Token) => value is U): Iterator<U>
    {
        return Iterator.whereInstanceOf(this, typeCheck);
    }

    public whereInstanceOfType<U extends Token>(type: Type<U>): Iterator<U>
    {
        return Iterator.whereInstanceOfType(this, type);
    }

    public first(condition?: (value: Token) => boolean): Result<Token>
    {
        return Iterator.first(this, condition);
    }

    public last(): Result<Token>
    {
        return Iterator.last(this);
    }

    public take(maximumToTake: number): Iterator<Token>
    {
        return Iterator.take(this, maximumToTake);
    }

    public skip(maximumToSkip: number): Iterator<Token>
    {
        return Iterator.skip(this, maximumToSkip);
    }

    public [Symbol.iterator](): IteratorToJavascriptIteratorAdapter<Token>
    {
        return Iterator[Symbol.iterator](this);
    }
}