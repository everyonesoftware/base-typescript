import { Test, TestRunner } from "@everyonesoftware/test-typescript";
import { DocumentPosition, MutableDocumentPosition, PreConditionError } from "../sources";
import { createTestRunner } from "./tests";

export function test(runner: TestRunner): void
{
    runner.testFile("documentPosition.ts", () =>
    {
        runner.testType(DocumentPosition.name, () =>
        {
            runner.testFunction("create(number?,number?,number?)", () =>
            {
                function createErrorTest(characterIndex: number | undefined, lineIndex: number | undefined, columnIndex: number | undefined, expected: Error): void
                {
                    runner.test(`with ${runner.andList([characterIndex, lineIndex, columnIndex])}`, (test: Test) =>
                    {
                        test.assertThrows(() => DocumentPosition.create(characterIndex, lineIndex, columnIndex), expected);
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

                        const documentPosition: MutableDocumentPosition = DocumentPosition.create(characterIndex, lineIndex, columnIndex);
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

            runner.testFunction("clone()", (test: Test) =>
            {
                const position1: DocumentPosition = DocumentPosition.create(1, 2, 3);
                const position2: MutableDocumentPosition = position1.clone();
                test.assertNotSame(position1, position2);
                test.assertEqual(position1, position2);
            });
        });
    });
}
test(createTestRunner());