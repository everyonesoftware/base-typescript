import { Test, TestRunner } from "@everyonesoftware/test-typescript";
import { createTestRunner } from "./tests";
import { DocumentPosition, MutableDocumentPosition, PreConditionError } from "../sources";

export function test(runner: TestRunner): void
{
    runner.testFile("mutableDocumentPosition.ts", () =>
    {
        runner.testType(MutableDocumentPosition.name, () =>
        {
            runner.testFunction("create(number?,number?,number?)", () =>
            {
                function createErrorTest(characterIndex: number | undefined, lineIndex: number | undefined, columnIndex: number | undefined, expected: Error): void
                {
                    runner.test(`with ${runner.andList([characterIndex, lineIndex, columnIndex])}`, (test: Test) =>
                    {
                        test.assertThrows(() => MutableDocumentPosition.create(characterIndex, lineIndex, columnIndex), expected);
                    });
                }

                createErrorTest(-1, undefined, undefined, new PreConditionError(
                    "Expression: characterIndex",
                    "Expected: greater than or equal to 0",
                    "Actual: -1",
                ));
                createErrorTest(undefined, -1, undefined, new PreConditionError(
                    "Expression: lineIndex",
                    "Expected: greater than or equal to 0",
                    "Actual: -1",
                ));
                createErrorTest(undefined, undefined, -1, new PreConditionError(
                    "Expression: columnIndex",
                    "Expected: greater than or equal to 0",
                    "Actual: -1",
                ));

                function createTest(characterIndex: number | undefined, lineIndex: number | undefined, columnIndex: number | undefined, expectedCharacterIndex?: number, expectedLineIndex?: number, expectedColumnIndex?: number): void
                {
                    runner.test(`with ${runner.andList([characterIndex, lineIndex, columnIndex])}`, (test: Test) =>
                    {
                        if (!expectedCharacterIndex)
                        {
                            expectedCharacterIndex = characterIndex || 0;
                        }
                        if (!expectedLineIndex)
                        {
                            expectedLineIndex = lineIndex || 0;
                        }
                        if (!expectedColumnIndex)
                        {
                            expectedColumnIndex = columnIndex || 0;
                        }

                        const documentPosition: MutableDocumentPosition = MutableDocumentPosition.create(characterIndex, lineIndex, columnIndex);
                        test.assertNotUndefinedAndNotNull(documentPosition);
                        test.assertEqual(documentPosition.getCharacterIndex(), expectedCharacterIndex);
                        test.assertEqual(documentPosition.getCharacterNumber(), expectedCharacterIndex + 1);
                        test.assertEqual(documentPosition.getLineIndex(), expectedLineIndex);
                        test.assertEqual(documentPosition.getLineNumber(), expectedLineIndex + 1);
                        test.assertEqual(documentPosition.getColumnIndex(), expectedColumnIndex);
                        test.assertEqual(documentPosition.getColumnNumber(), expectedColumnIndex + 1);
                    });
                }

                createTest(undefined, undefined, undefined, 0, 0, 0);
                createTest(undefined, undefined, undefined);
                createTest(10, undefined, undefined, 10);
                createTest(undefined, 11, undefined, 0, 11, 0);
                createTest(undefined, undefined, 12, 0, 0, 12);
                createTest(1, 2, 3);
            });

            runner.testFunction("advanceCharacter(string)", () =>
            {
                function advanceCharacterErrorTest(position: MutableDocumentPosition, previousCharacter: string, expected: Error): void
                {
                    runner.test(`with ${runner.andList([position, previousCharacter])}`, (test: Test) =>
                    {
                        test.assertThrows(() => position.advanceCharacter(previousCharacter), expected);
                    });
                }

                advanceCharacterErrorTest(DocumentPosition.create(), undefined!, new PreConditionError(
                    "Expression: character",
                    "Expected: not undefined and not null",
                    "Actual: undefined",
                ));
                advanceCharacterErrorTest(DocumentPosition.create(), null!, new PreConditionError(
                    "Expression: character",
                    "Expected: not undefined and not null",
                    "Actual: null",
                ));
                advanceCharacterErrorTest(DocumentPosition.create(), "", new PreConditionError(
                    "Expression: character",
                    "Expected: not empty",
                    "Actual: \"\"",
                ));
                advanceCharacterErrorTest(DocumentPosition.create(), "ab", new PreConditionError(
                    "Expression: character.length",
                    "Expected: 1",
                    "Actual: 2",
                ));

                function advanceCharacterTest(position: MutableDocumentPosition, character: string, expected: DocumentPosition): void
                {
                    runner.test(`with ${runner.andList([position, character])}`, (test: Test) =>
                    {
                        position.advanceCharacter(character);
                        test.assertEqual(position, expected);
                    });
                }

                advanceCharacterTest(
                    DocumentPosition.create(),
                    "a",
                    DocumentPosition.create(1, 0, 1),
                );
                advanceCharacterTest(
                    DocumentPosition.create(),
                    "b",
                    DocumentPosition.create(1, 0, 1),
                );
                advanceCharacterTest(
                    DocumentPosition.create(30, 27, 18),
                    "c",
                    DocumentPosition.create(31, 27, 19),
                );
                advanceCharacterTest(
                    DocumentPosition.create(),
                    "\t",
                    DocumentPosition.create(1, 0, 1),
                );
                advanceCharacterTest(
                    DocumentPosition.create(),
                    "\r",
                    DocumentPosition.create(1, 0, 1),
                );
                advanceCharacterTest(
                    DocumentPosition.create(),
                    "\n",
                    DocumentPosition.create(1, 1, 0),
                );
            });
        });
    });
}
test(createTestRunner());