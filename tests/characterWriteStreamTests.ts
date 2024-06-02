import { TestRunner, Test } from "@everyonesoftware/test-typescript";
import { CharacterWriteStream, PreConditionError } from "../sources";

export function characterWriteStreamTests(runner: TestRunner, creator: () => CharacterWriteStream): void
{
    runner.testType(CharacterWriteStream.name, () =>
    {
        runner.testFunction("writeCharacter(string)", () =>
        {
            function writeCharacterErrorTest(value: string, expected: Error): void
            {
                runner.test(`with ${runner.toString(value)}`, (test: Test) =>
                {
                    const writeStream: CharacterWriteStream = creator();
                    test.assertThrows(() => writeStream.writeCharacter(value).await(), expected);
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
        
        runner.testFunction("writeString(string,number?,number?)", () =>
        {
            function writeStringErrorTest(value: string, expected: Error): void
            {
                runner.test(`with ${runner.toString(value)}`, (test: Test) =>
                {
                    const writeStream: CharacterWriteStream = creator();
                    test.assertThrows(() => writeStream.writeString(value).await(), expected);
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
        
        runner.testFunction("writeLine(string,number?,number?)", () =>
        {
            function writeLineErrorTest(value: string, expected: Error): void
            {
                runner.test(`with ${runner.toString(value)}`, (test: Test) =>
                {
                    const writeStream: CharacterWriteStream = creator();
                    test.assertThrows(() => writeStream.writeLine(value).await(), expected);
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