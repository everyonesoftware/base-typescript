import * as assert from "assert";

import { CharacterWriteStream, PreConditionError, escapeAndQuote } from "../sources";

export function characterWriteStreamTests(creator: () => CharacterWriteStream): void
{
    suite("CharacterWriteStream", () =>
    {
        suite("writeCharacter(string)", () =>
        {
            function writeCharacterErrorTest(value: string, expected: Error): void
            {
                test(`with ${escapeAndQuote(value)}`, () =>
                {
                    const writeStream: CharacterWriteStream = creator();
                    assert.throws(() => writeStream.writeCharacter(value).await(), expected);
                });
            }

            writeCharacterErrorTest(
                undefined!,
                new PreConditionError(
                    "Expression: character",
                    "Expected: not undefined and not null",
                    "Actual: undefined"));
            writeCharacterErrorTest(
                null!,
                new PreConditionError(
                    "Expression: character",
                    "Expected: not undefined and not null",
                    "Actual: null"));
            writeCharacterErrorTest(
                "",
                new PreConditionError(
                    "Expression: character.length",
                    "Expected: 1",
                    "Actual: 0"));
            writeCharacterErrorTest(
                "ab",
                new PreConditionError(
                    "Expression: character.length",
                    "Expected: 1",
                    "Actual: 2"));
            writeCharacterErrorTest(
                "abc",
                new PreConditionError(
                    "Expression: character.length",
                    "Expected: 1",
                    "Actual: 3"));
        });
        
        suite("writeString(string,number?,number?)", () =>
        {
            function writeStringErrorTest(value: string, expected: Error): void
            {
                test(`with ${escapeAndQuote(value)}`, () =>
                {
                    const writeStream: CharacterWriteStream = creator();
                    assert.throws(() => writeStream.writeString(value).await(), expected);
                });
            }

            writeStringErrorTest(
                undefined!,
                new PreConditionError(
                    "Expression: text",
                    "Expected: not undefined and not null",
                    "Actual: undefined"));
            writeStringErrorTest(
                null!,
                new PreConditionError(
                    "Expression: text",
                    "Expected: not undefined and not null",
                    "Actual: null"));
        });
        
        suite("writeLine(string,number?,number?)", () =>
        {
            function writeLineErrorTest(value: string, expected: Error): void
            {
                test(`with ${escapeAndQuote(value)}`, () =>
                {
                    const writeStream: CharacterWriteStream = creator();
                    assert.throws(() => writeStream.writeLine(value).await(), expected);
                });
            }

            writeLineErrorTest(
                undefined!,
                new PreConditionError(
                    "Expression: text",
                    "Expected: not undefined and not null",
                    "Actual: undefined"));
            writeLineErrorTest(
                null!,
                new PreConditionError(
                    "Expression: text",
                    "Expected: not undefined and not null",
                    "Actual: null"));
        });
    });
}