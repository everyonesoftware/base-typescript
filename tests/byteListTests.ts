import * as assert from "assert";
import { ByteList, Bytes, List, PreConditionError, andList, toString } from "../sources";

suite("byteList.ts", () =>
{
    suite("ByteList", () =>
    {
        suite("create(JavascriptIterable<number> | undefined)", () =>
        {
            test("with undefined", () =>
            {
                const list: ByteList = ByteList.create(undefined);
                assert.strictEqual(list.getCount(), 0);
            });

            test("with null", () =>
            {
                const list: ByteList = ByteList.create(null!);
                assert.strictEqual(list.getCount(), 0);
            });

            test("with empty array", () =>
            {
                const list: ByteList = ByteList.create([]);
                assert.strictEqual(list.getCount(), 0);
            });

            test("with non-empty array", () =>
            {
                const list: ByteList = ByteList.create([1, 2, 3]);
                assert.strictEqual(list.getCount(), 3);
                assert.deepStrictEqual(list.toArray(), [1, 2, 3]);
            });

            test("with empty Iterable<number>", () =>
            {
                const list: ByteList = ByteList.create(List.create());
                assert.strictEqual(list.getCount(), 0);
            });

            test("with non-empty Iterable<number>", () =>
            {
                const list: ByteList = ByteList.create(List.create([1, 2, 3]));
                assert.strictEqual(list.getCount(), 3);
                assert.deepStrictEqual(list.toArray(), [1, 2, 3]);
            });
        });

        suite("set(number, number)", () =>
        {
            function setErrorTest(list: ByteList, index: number, value: number, expected: Error): void
            {
                test(`with ${andList([list, index, value].map(toString))}`, () =>
                {
                    assert.throws(() => list.set(index, value), expected);
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
                test(`with ${andList([list, index, value].map(toString))}`, () =>
                {
                    const setResult: ByteList = list.set(index, value);
                    assert.strictEqual(setResult, list);
                    assert.strictEqual(list.get(index), value);
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

        suite("get(number)", () =>
        {
            function getErrorTest(list: ByteList, index: number, expected: Error): void
            {
                test(`with ${andList([list, index].map(toString))}`, () =>
                {
                    assert.throws(() => list.get(index), expected);
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

        suite("insert(number,number)", () =>
        {
            function insertErrorTest(list: ByteList, index: number, value: number, expected: Error): void
            {
                test(`with ${andList([list, index, value].map(toString))}`, () =>
                {
                    assert.throws(() => list.insert(index, value), expected);
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
                test(`with ${andList([list, index, value].map(toString))}`, () =>
                {
                    const insertResult: ByteList = list.insert(index, value);
                    assert.strictEqual(list, insertResult);
                    assert.deepStrictEqual(list.toArray(), expected);
                });
            }

            insertTest(ByteList.create(), 0, 0, [0]);
            insertTest(ByteList.create(), 0, 200, [200]);
            insertTest(ByteList.create([1]), 0, 0, [0, 1]);
            insertTest(ByteList.create([1]), 1, 2, [1, 2]);
            insertTest(ByteList.create([1, 3]), 0, 0, [0, 1, 3]);
            insertTest(ByteList.create([1, 3]), 1, 2, [1, 2, 3]);
            insertTest(ByteList.create([1, 3]), 2, 4, [1, 3, 4]);
            
            test("with a lot of calls", () =>
            {
                const list: ByteList = ByteList.create();
                const count: number = 1000;
                for (let i = 0; i < count; i++)
                {
                    list.insert(Math.floor(i / 2), i % Bytes.maximumValue);
                }
                assert.strictEqual(list.getCount(), count);
            });
        });
    });
});