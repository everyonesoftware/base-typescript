import { Test, TestRunner } from "@everyonesoftware/test-typescript";
import { ByteList, Bytes, List, PreConditionError } from "../sources";

export function test(runner: TestRunner): void
{
    runner.testFile("byteList.ts", () =>
    {
        runner.testType(ByteList.name, () =>
        {
            runner.testFunction("create(JavascriptIterable<number> | undefined)", () =>
            {
                runner.test("with undefined", (test: Test) =>
                {
                    const list: ByteList = ByteList.create(undefined);
                    test.assertEqual(list.getCount(), 0);
                });

                runner.test("with null", (test: Test) =>
                {
                    const list: ByteList = ByteList.create(null!);
                    test.assertEqual(list.getCount(), 0);
                });

                runner.test("with empty array", (test: Test) =>
                {
                    const list: ByteList = ByteList.create([]);
                    test.assertEqual(list.getCount(), 0);
                });

                runner.test("with non-empty array", (test: Test) =>
                {
                    const list: ByteList = ByteList.create([1, 2, 3]);
                    test.assertEqual(list.getCount(), 3);
                    test.assertEqual(list.toArray(), [1, 2, 3]);
                });

                runner.test("with empty Iterable<number>", (test: Test) =>
                {
                    const list: ByteList = ByteList.create(List.create());
                    test.assertEqual(list.getCount(), 0);
                });

                runner.test("with non-empty Iterable<number>", (test: Test) =>
                {
                    const list: ByteList = ByteList.create(List.create([1, 2, 3]));
                    test.assertEqual(list.getCount(), 3);
                    test.assertEqual(list.toArray(), [1, 2, 3]);
                });
            });

            runner.testFunction("set(number, number)", () =>
            {
                function setErrorTest(list: ByteList, index: number, value: number, expected: Error): void
                {
                    runner.test(`with ${runner.andList([list, index, value])}`, (test: Test) =>
                    {
                        test.assertThrows(() => list.set(index, value), expected);
                    });
                }

                setErrorTest(ByteList.create(), -1, 1, new PreConditionError(
                    "Expression: count",
                    "Expected: greater than or equal to 1",
                    "Actual: 0"));
                setErrorTest(ByteList.create(), 0, 1, new PreConditionError(
                    "Expression: count",
                    "Expected: greater than or equal to 1",
                    "Actual: 0"));
                setErrorTest(ByteList.create(), 1, 1, new PreConditionError(
                    "Expression: count",
                    "Expected: greater than or equal to 1",
                    "Actual: 0"));
                setErrorTest(ByteList.create([0]), -1, 1, new PreConditionError(
                    "Expression: index",
                    "Expected: 0",
                    "Actual: -1"));
                setErrorTest(ByteList.create([0]), 1, 1, new PreConditionError(
                    "Expression: index",
                    "Expected: 0",
                    "Actual: 1"));
                setErrorTest(ByteList.create([0, 1]), -1, 1, new PreConditionError(
                    "Expression: index",
                    "Expected: between 0 and 1",
                    "Actual: -1"));
                setErrorTest(ByteList.create([0, 1]), 2, 1, new PreConditionError(
                    "Expression: index",
                    "Expected: between 0 and 1",
                    "Actual: 2"));
                setErrorTest(ByteList.create([0]), 0, -1, new PreConditionError(
                    "Expression: value",
                    "Expected: between 0 and 255",
                    "Actual: -1"));
                setErrorTest(ByteList.create([0]), 0, 256, new PreConditionError(
                    "Expression: value",
                    "Expected: between 0 and 255",
                    "Actual: 256"));

                function setTest(list: ByteList, index: number, value: number): void
                {
                    runner.test(`with ${runner.andList([list, index, value])}`, (test: Test) =>
                    {
                        const setResult: ByteList = list.set(index, value);
                        test.assertSame(setResult, list);
                        test.assertEqual(list.get(index), value);
                    });
                }

                setTest(ByteList.create([0]), 0, 1);
                setTest(ByteList.create([0]), 0, 2);
                setTest(ByteList.create([0]), 0, 128);
                setTest(ByteList.create([0]), 0, 254);
                setTest(ByteList.create([0]), 0, 255);
                setTest(ByteList.create([0, 1]), 0, 3);
                setTest(ByteList.create([0, 1]), 1, 10);
            });

            runner.testFunction("get(number)", () =>
            {
                function getErrorTest(list: ByteList, index: number, expected: Error): void
                {
                    runner.test(`with ${runner.andList([list, index])}`, (test: Test) =>
                    {
                        test.assertThrows(() => list.get(index), expected);
                    });
                }

                getErrorTest(ByteList.create(), -1, new PreConditionError(
                    "Expression: count",
                    "Expected: greater than or equal to 1",
                    "Actual: 0"));
                getErrorTest(ByteList.create(), 0, new PreConditionError(
                    "Expression: count",
                    "Expected: greater than or equal to 1",
                    "Actual: 0"));
                getErrorTest(ByteList.create(), 1, new PreConditionError(
                    "Expression: count",
                    "Expected: greater than or equal to 1",
                    "Actual: 0"));

                getErrorTest(ByteList.create([10]), -1, new PreConditionError(
                    "Expression: index",
                    "Expected: 0",
                    "Actual: -1"));
                getErrorTest(ByteList.create([10]), 1, new PreConditionError(
                    "Expression: index",
                    "Expected: 0",
                    "Actual: 1"));

                getErrorTest(ByteList.create([10, 20]), -1, new PreConditionError(
                    "Expression: index",
                    "Expected: between 0 and 1",
                    "Actual: -1"));
                getErrorTest(ByteList.create([10, 20]), 2, new PreConditionError(
                    "Expression: index",
                    "Expected: between 0 and 1",
                    "Actual: 2"));
            });

            runner.testFunction("insert(number,number)", () =>
            {
                function insertErrorTest(list: ByteList, index: number, value: number, expected: Error): void
                {
                    runner.test(`with ${runner.andList([list, index, value])}`, (test: Test) =>
                    {
                        test.assertThrows(() => list.insert(index, value), expected);
                    });
                }

                insertErrorTest(ByteList.create(), -1, 0, new PreConditionError(
                    "Expression: index",
                    "Expected: 0",
                    "Actual: -1"));
                insertErrorTest(ByteList.create(), 1, 0, new PreConditionError(
                    "Expression: index",
                    "Expected: 0",
                    "Actual: 1"));
                insertErrorTest(ByteList.create(), 0, -1, new PreConditionError(
                    "Expression: value",
                    "Expected: between 0 and 255",
                    "Actual: -1"));
                insertErrorTest(ByteList.create(), 0, 256, new PreConditionError(
                    "Expression: value",
                    "Expected: between 0 and 255",
                    "Actual: 256"));

                function insertTest(list: ByteList, index: number, value: number, expected: number[]): void
                {
                    runner.test(`with ${runner.andList([list, index, value])}`, (test: Test) =>
                    {
                        const insertResult: ByteList = list.insert(index, value);
                        test.assertSame(list, insertResult);
                        test.assertEqual(list.toArray(), expected);
                    });
                }

                insertTest(ByteList.create(), 0, 0, [0]);
                insertTest(ByteList.create(), 0, 200, [200]);
                insertTest(ByteList.create([1]), 0, 0, [0, 1]);
                insertTest(ByteList.create([1]), 1, 2, [1, 2]);
                insertTest(ByteList.create([1, 3]), 0, 0, [0, 1, 3]);
                insertTest(ByteList.create([1, 3]), 1, 2, [1, 2, 3]);
                insertTest(ByteList.create([1, 3]), 2, 4, [1, 3, 4]);
                
                runner.test("with a lot of calls", (test: Test) =>
                {
                    const list: ByteList = ByteList.create();
                    const count: number = 1000;
                    for (let i = 0; i < count; i++)
                    {
                        list.insert(Math.floor(i / 2), i % Bytes.maximumValue);
                    }
                    test.assertEqual(list.getCount(), count);
                });
            });

            runner.testFunction("toUint8Array()", () =>
            {
                function toUint8ArrayTest(list: ByteList, expected: Uint8Array)
                {
                    runner.test(`with ${runner.toString(list)}`, (test: Test) =>
                    {
                        test.assertEqual(list.toUint8Array(), expected);
                    });
                }

                toUint8ArrayTest(ByteList.create(), Uint8Array.of());
                toUint8ArrayTest(ByteList.create([0]), Uint8Array.of(0));
                toUint8ArrayTest(ByteList.create([0, 1]), Uint8Array.of(0, 1));
                toUint8ArrayTest(ByteList.create([0, 1, 2, 3]), Uint8Array.of(0, 1, 2, 3));
            });
        });
    });
}
test(TestRunner.create());