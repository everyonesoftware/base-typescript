import { Test, TestRunner } from "@everyonesoftware/test-typescript";
import { createTestRunner } from "./tests";
import { DocumentIterator, DocumentPosition, Iterator, PreConditionError, StringIterator } from "../sources";

export function test(runner: TestRunner): void
{
    runner.testFile("documentIterator.ts", () =>
    {
        runner.testType(DocumentIterator.name, () =>
        {
            runner.testFunction("create(Iterator<string>,DocumentPosition?)", () =>
            {
                function createErrorTest(iterator: Iterator<string>, position: DocumentPosition | undefined, expected: Error): void
                {
                    runner.test(`with ${runner.andList([iterator, position])}`, (test: Test) =>
                    {
                        test.assertThrows(() => DocumentIterator.create(iterator, position), expected);
                    });
                }

                createErrorTest(undefined!, undefined, new PreConditionError(
                    "Expression: innerIterator",
                    "Expected: not undefined and not null",
                    "Actual: undefined",
                ));
                createErrorTest(null!, undefined, new PreConditionError(
                    "Expression: innerIterator",
                    "Expected: not undefined and not null",
                    "Actual: null",
                ));

                function createTest(text: string): void
                {
                    runner.test(`with ${runner.toString(text)}`, (test: Test) =>
                    {
                        const iterator: DocumentIterator = DocumentIterator.create(StringIterator.create(text));
                        test.assertNotUndefinedAndNotNull(iterator);

                        let expectedCharacterIndex: number = 0;
                        let expectedLineIndex: number = 0;
                        let expectedColumnIndex: number = 0;
                        for (const character of text)
                        {
                            if (iterator.hasCurrent())
                            {
                                if (iterator.getCurrent() === "\n")
                                {
                                    expectedLineIndex++;
                                    expectedColumnIndex = 0;
                                }
                                else
                                {
                                    expectedColumnIndex++;
                                }
                                expectedCharacterIndex++;
                            }

                            test.assertTrue(iterator.next());
                            test.assertEqual(character, iterator.getCurrent());
                            test.assertEqual(expectedCharacterIndex, iterator.getCharacterIndex());
                            test.assertEqual(expectedLineIndex, iterator.getLineIndex());
                            test.assertEqual(expectedColumnIndex, iterator.getColumnIndex());
                        }

                        for (let i = 0; i < 3; i++)
                        {
                            test.assertFalse(iterator.next());
                            test.assertFalse(iterator.hasCurrent());
                        }
                    });
                }

                createTest("");
                createTest("a");
                createTest("abc");
                createTest("a\nb\rc\nd\n");
            });

            runner.testFunction("getPosition()", (test: Test) =>
            {
                const iterator: DocumentIterator = DocumentIterator.create(StringIterator.create("hello")).start();
                const position1: DocumentPosition = iterator.getPosition();
                test.assertNotUndefinedAndNotNull(position1);
                test.assertEqual(0, position1.getCharacterIndex());
                test.assertEqual(0, position1.getLineIndex());
                test.assertEqual(0, position1.getColumnIndex());
                test.assertNotSame(position1, iterator.getPosition());

                test.assertTrue(iterator.next());

                const position2: DocumentPosition = iterator.getPosition();
                test.assertNotUndefinedAndNotNull(position2);
                test.assertEqual(1, position2.getCharacterIndex());
                test.assertEqual(0, position2.getLineIndex());
                test.assertEqual(1, position2.getColumnIndex());
                test.assertNotSame(position2, iterator.getPosition());
                test.assertNotSame(position1, position2);
                test.assertEqual(0, position1.getCharacterIndex());
                test.assertEqual(0, position1.getLineIndex());
                test.assertEqual(0, position1.getColumnIndex());
            });
        });
    });
}
test(createTestRunner());