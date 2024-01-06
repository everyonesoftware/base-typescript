import { Pre } from "./pre";
import { TextToken } from "./textToken";
import { TextTokenType } from "./textTokenType";
import { TextTokenizer } from "./textTokenizer";

/**
 * Get the provided text where all letters have been converted to uppercase.
 * @param text The text to transform.
 */
export function toUppercase(text: string): string
{
    Pre.condition.assertNotUndefinedAndNotNull(text, "text");

    return text.toUpperCase();
}

/**
 * Get the provided text where all letters have been converted to lowercase.
 * @param text The text to transform.
 */
export function toLowercase(text: string): string
{
    Pre.condition.assertNotUndefinedAndNotNull(text, "text");

    return text.toLowerCase();
}

/**
 * Get the provided text where all letters have been converted to camel case. For example,
 * "hello there friend" would be returned as "helloThereFriend".
 * @param text The text to transform.
 */
export function toCamelCase(text: string): string
{
    Pre.condition.assertNotUndefinedAndNotNull(text, "text");

    let result: string = "";

    const tokenizer: TextTokenizer = TextTokenizer.create(text).start();
    let insideWordSequence: boolean = false;
    let whitespaceBuffer: string = "";
    while (tokenizer.hasCurrent())
    {
        const current: TextToken = tokenizer.takeCurrent();
        switch (current.getType())
        {
            case TextTokenType.Word:
                if (!insideWordSequence)
                {
                    result += whitespaceBuffer;

                    result += toLowercase(current.getText());
                    insideWordSequence = true;
                }
                else
                {
                    result += toUppercase(current.getText()[0]);
                    if (current.getText().length >= 2)
                    {
                        result += current.getText().substring(1);
                    }
                }
                whitespaceBuffer = "";
                break;
            
            case TextTokenType.Digits:
                result += current.getText();
                break;

            case TextTokenType.Other:
                result += whitespaceBuffer;
                whitespaceBuffer = "";

                result += current.getText();
                insideWordSequence = false;
                break;

            case TextTokenType.Dash:
            case TextTokenType.Underscore:
            case TextTokenType.Whitespace:
                if (insideWordSequence)
                {
                    whitespaceBuffer += current.getText();
                }
                else
                {
                    result += current.getText();
                }
                break;
        }
    }

    result += whitespaceBuffer;

    return result;
}

export function toPascalCase(text: string): string
{
    Pre.condition.assertNotUndefinedAndNotNull(text, "text");

    let result: string = "";

    const tokenizer: TextTokenizer = TextTokenizer.create(text).start();
    let insideWordSequence: boolean = false;
    let whitespaceBuffer: string = "";
    while (tokenizer.hasCurrent())
    {
        const current: TextToken = tokenizer.takeCurrent();
        switch (current.getType())
        {
            case TextTokenType.Word:
                if (!insideWordSequence)
                {
                    result += whitespaceBuffer;
                    insideWordSequence = true;
                }

                result += toUppercase(current.getText()[0]);
                if (current.getText().length >= 2)
                {
                    result += current.getText().substring(1);
                }
                
                whitespaceBuffer = "";
                break;
            
            case TextTokenType.Digits:
                result += current.getText();
                break;

            case TextTokenType.Other:
                result += whitespaceBuffer;
                whitespaceBuffer = "";

                result += current.getText();
                insideWordSequence = false;
                break;

            case TextTokenType.Dash:
            case TextTokenType.Underscore:
            case TextTokenType.Whitespace:
                if (insideWordSequence)
                {
                    whitespaceBuffer += current.getText();
                }
                else
                {
                    result += current.getText();
                }
                break;
        }
    }

    result += whitespaceBuffer;

    return result;
}

export function toSnakeCase(text: string): string
{
    Pre.condition.assertNotUndefinedAndNotNull(text, "text");

    let result: string = "";

    const tokenizer: TextTokenizer = TextTokenizer.create(text).start();

    let insideWordSequence: boolean = false;
    let whitespaceBuffer: string = "";
    while (tokenizer.hasCurrent())
    {
        const current: TextToken = tokenizer.takeCurrent();
        switch (current.getType())
        {
            case TextTokenType.Word:
                if (!insideWordSequence)
                {
                    result += whitespaceBuffer;
                    insideWordSequence = true;
                }
                else
                {
                    result += "_";
                }

                result += toLowercase(current.getText());

                insideWordSequence = true;
                whitespaceBuffer = "";
                break;

            case TextTokenType.Digits:
                result += current.getText();
                break;

            case TextTokenType.Other:
                result += whitespaceBuffer;
                whitespaceBuffer = "";

                result += current.getText();
                insideWordSequence = false;
                break;

            case TextTokenType.Dash:
            case TextTokenType.Underscore:
            case TextTokenType.Whitespace:
                if (insideWordSequence)
                {
                    whitespaceBuffer += current.getText();
                }
                else
                {
                    result += current.getText();
                }
                break;
        }
    }

    if (whitespaceBuffer !== "")
    {
        result += whitespaceBuffer;
        whitespaceBuffer = "";
    }

    return result;
}

export function toUpperSnakeCase(text: string): string
{
    Pre.condition.assertNotUndefinedAndNotNull(text, "text");

    let result: string = "";

    const tokenizer: TextTokenizer = TextTokenizer.create(text).start();

    let insideWordSequence: boolean = false;
    let whitespaceBuffer: string = "";
    while (tokenizer.hasCurrent())
    {
        const current: TextToken = tokenizer.takeCurrent();
        switch (current.getType())
        {
            case TextTokenType.Word:
                if (!insideWordSequence)
                {
                    result += whitespaceBuffer;
                    insideWordSequence = true;
                }
                else
                {
                    result += "_";
                }

                result += toUppercase(current.getText());

                insideWordSequence = true;
                whitespaceBuffer = "";
                break;

            case TextTokenType.Digits:
                result += current.getText();
                break;

            case TextTokenType.Other:
                result += whitespaceBuffer;
                whitespaceBuffer = "";

                result += current.getText();
                insideWordSequence = false;
                break;

            case TextTokenType.Dash:
            case TextTokenType.Underscore:
            case TextTokenType.Whitespace:
                if (insideWordSequence)
                {
                    whitespaceBuffer += current.getText();
                }
                else
                {
                    result += current.getText();
                }
                break;
        }
    }

    if (whitespaceBuffer !== "")
    {
        result += whitespaceBuffer;
        whitespaceBuffer = "";
    }

    return result;
}

export function toKebabCase(text: string): string
{
    Pre.condition.assertNotUndefinedAndNotNull(text, "text");

    let result: string = "";

    const tokenizer: TextTokenizer = TextTokenizer.create(text).start();

    let insideWordSequence: boolean = false;
    let whitespaceBuffer: string = "";
    while (tokenizer.hasCurrent())
    {
        const current: TextToken = tokenizer.takeCurrent();
        switch (current.getType())
        {
            case TextTokenType.Word:
                if (!insideWordSequence)
                {
                    result += whitespaceBuffer;
                    insideWordSequence = true;
                }
                else
                {
                    result += "-";
                }

                result += toLowercase(current.getText());

                insideWordSequence = true;
                whitespaceBuffer = "";
                break;

            case TextTokenType.Digits:
                result += current.getText();
                break;

            case TextTokenType.Other:
                result += whitespaceBuffer;
                whitespaceBuffer = "";

                result += current.getText();
                insideWordSequence = false;
                break;

            case TextTokenType.Dash:
            case TextTokenType.Underscore:
            case TextTokenType.Whitespace:
                if (insideWordSequence)
                {
                    whitespaceBuffer += current.getText();
                }
                else
                {
                    result += current.getText();
                }
                break;
        }
    }

    if (whitespaceBuffer !== "")
    {
        result += whitespaceBuffer;
        whitespaceBuffer = "";
    }

    return result;
}

export function toUpperKebabCase(text: string): string
{
    Pre.condition.assertNotUndefinedAndNotNull(text, "text");

    let result: string = "";

    const tokenizer: TextTokenizer = TextTokenizer.create(text).start();

    let insideWordSequence: boolean = false;
    let whitespaceBuffer: string = "";
    while (tokenizer.hasCurrent())
    {
        const current: TextToken = tokenizer.takeCurrent();
        switch (current.getType())
        {
            case TextTokenType.Word:
                if (!insideWordSequence)
                {
                    result += whitespaceBuffer;
                    insideWordSequence = true;
                }
                else
                {
                    result += "-";
                }

                result += toUppercase(current.getText());

                insideWordSequence = true;
                whitespaceBuffer = "";
                break;

            case TextTokenType.Digits:
                result += current.getText();
                break;

            case TextTokenType.Other:
                result += whitespaceBuffer;
                whitespaceBuffer = "";

                result += current.getText();
                insideWordSequence = false;
                break;

            case TextTokenType.Dash:
            case TextTokenType.Underscore:
            case TextTokenType.Whitespace:
                if (insideWordSequence)
                {
                    whitespaceBuffer += current.getText();
                }
                else
                {
                    result += current.getText();
                }
                break;
        }
    }

    if (whitespaceBuffer !== "")
    {
        result += whitespaceBuffer;
        whitespaceBuffer = "";
    }

    return result;
}