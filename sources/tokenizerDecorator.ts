import { IteratorBase } from "./iteratorBase";
import { Token } from "./token";
import { Pre } from "./pre";
import { Tokenizer } from "./tokenizer";

export abstract class TokenizerDecorator extends IteratorBase<Token> implements Tokenizer
{
    private readonly innerTokenizer: Tokenizer;

    protected constructor(innerTokenizer: Tokenizer)
    {
        Pre.condition.assertNotUndefinedAndNotNull(innerTokenizer, "innerTokenizer");

        super();

        this.innerTokenizer = innerTokenizer;
    }

    public override next(): boolean
    {
        return this.innerTokenizer.next();
    }

    public override hasStarted(): boolean
    {
        return this.innerTokenizer.hasStarted();
    }

    public override hasCurrent(): boolean
    {
        return this.innerTokenizer.hasCurrent();
    }

    public override getCurrent(): Token
    {
        return this.innerTokenizer.getCurrent();
    }
}