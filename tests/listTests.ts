import * as assert from "assert";

import { Iterable, List, PreConditionError, andList, join } from "../sources/index";

suite("list.ts", () =>
{
    suite(List.name, () =>
    {
        suite("create(T[]|Iterable<T>|undefined)", () =>
        {
            test("with no arguments", () =>
            {
                const list: List<number> = List.create();
                assert.notStrictEqual(list, undefined);
                assert.deepStrictEqual(list.toArray(), []);
                assert.strictEqual(list.toString(), "[]");
                assert.strictEqual(list.getCount(), 0);
            });

            test("with undefined", () =>
            {
                const list: List<number> = List.create(undefined);
                assert.notStrictEqual(list, undefined);
                assert.deepStrictEqual(list.toArray(), []);
                assert.strictEqual(list.toString(), "[]");
                assert.strictEqual(list.getCount(), 0);
            });

            test("with empty array", () =>
            {
                const list: List<number> = List.create([]);
                assert.notStrictEqual(list, undefined);
                assert.deepStrictEqual(list.toArray(), []);
                assert.strictEqual(list.toString(), "[]");
                assert.strictEqual(list.getCount(), 0);
            });

            test("with non-empty array", () =>
            {
                const list: List<number> = List.create([1, 2, 3]);
                assert.notStrictEqual(list, undefined);
                assert.deepStrictEqual(list.toArray(), [1, 2, 3]);
                assert.strictEqual(list.toString(), "[1,2,3]");
                assert.strictEqual(list.getCount(), 3);
            });

            test("with empty Iterable<T>", () =>
            {
                const list: List<number> = List.create(List.create());
                assert.notStrictEqual(list, undefined);
                assert.deepStrictEqual(list.toArray(), []);
                assert.strictEqual(list.toString(), "[]");
                assert.strictEqual(list.getCount(), 0);
            });

            test("with non-empty Iterable<T>", () =>
            {
                const list: List<number> = List.create(List.create([1, 2, 3]));
                assert.notStrictEqual(list, undefined);
                assert.deepStrictEqual(list.toArray(), [1, 2, 3]);
                assert.strictEqual(list.toString(), "[1,2,3]");
                assert.strictEqual(list.getCount(), 3);
            });
        });

        suite("set(number,T)", () =>
        {
            function setErrorTest(list: List<number>, index: number, value: number, expectedError: Error): void
            {
                test(`with ${andList([list, index, value].map(x => x.toString()))}`, () =>
                {
                    const backupList: List<Number> = List.create(list);
                    assert.throws(() => list.set(index, value), expectedError);
                    assert.deepStrictEqual(list, backupList);
                });
            }

            setErrorTest(List.create(), -1, 5, new PreConditionError(join("\n", [
                "Expression: count",
                "Expected: greater than or equal to 1",
                "Actual: 0"
            ])));
            setErrorTest(List.create(), 0, 5, new PreConditionError(join("\n", [
                "Expression: count",
                "Expected: greater than or equal to 1",
                "Actual: 0"
            ])));
            setErrorTest(List.create(), 1, 5, new PreConditionError(join("\n", [
                "Expression: count",
                "Expected: greater than or equal to 1",
                "Actual: 0"
            ])));
            setErrorTest(List.create([1]), -1, 5, new PreConditionError(join("\n", [
                "Expression: index",
                "Expected: 0",
                "Actual: -1"
            ])));
            setErrorTest(List.create([1]), 1, 5, new PreConditionError(join("\n", [
                "Expression: index",
                "Expected: 0",
                "Actual: 1"
            ])));

            function setTest(list: List<number>, index: number, value: number, expected: number[]): void
            {
                test(`with ${andList([list, index, value].map(x => x.toString()))}`, () =>
                {
                    const setResult: List<number> = list.set(index, value);
                    assert.strictEqual(list, setResult);
                    assert.deepStrictEqual(list.toArray(), expected);
                });
            }

            setTest(List.create([1]), 0, 5, [5]);
            setTest(List.create([1, 2]), 0, 5, [5, 2]);
            setTest(List.create([1, 2]), 1, 5, [1, 5]);
        });

        suite("get(number)", () =>
        {
            function getErrorTest(list: List<number>, index: number, expectedError: Error): void
            {
                test(`with ${andList([list, index].map(x => x.toString()))}`, () =>
                {
                    const backupList: List<Number> = List.create(list);
                    assert.throws(() => list.get(index), expectedError);
                    assert.deepStrictEqual(list, backupList);
                });
            }

            getErrorTest(List.create(), -1, new PreConditionError(join("\n", [
                "Expression: count",
                "Expected: greater than or equal to 1",
                "Actual: 0"
            ])));
            getErrorTest(List.create(), 0, new PreConditionError(join("\n", [
                "Expression: count",
                "Expected: greater than or equal to 1",
                "Actual: 0"
            ])));
            getErrorTest(List.create(), 1, new PreConditionError(join("\n", [
                "Expression: count",
                "Expected: greater than or equal to 1",
                "Actual: 0"
            ])));
            getErrorTest(List.create([1]), -1, new PreConditionError(join("\n", [
                "Expression: index",
                "Expected: 0",
                "Actual: -1"
            ])));
            getErrorTest(List.create([1]), 1, new PreConditionError(join("\n", [
                "Expression: index",
                "Expected: 0",
                "Actual: 1"
            ])));

            function getTest(list: List<number>, index: number, expected: number): void
            {
                test(`with ${andList([list, index].map(x => x.toString()))}`, () =>
                {
                    assert.strictEqual(list.get(index), expected);
                });
            }

            getTest(List.create([1]), 0, 1);
            getTest(List.create([1, 2]), 0, 1);
            getTest(List.create([1, 2]), 1, 2);
        });

        suite("add(T)", () =>
        {
            function addTest(list: List<number>, value: number, expected: number[]): void
            {
                test(`with ${andList([list, value].map(x => x.toString()))}`, () =>
                {
                    const addResult: List<number> = list.add(value);
                    assert.strictEqual(addResult, list);
                    assert.deepStrictEqual(list.toArray(), expected);
                });
            }

            addTest(List.create(), 1, [1]);
            addTest(List.create([1]), 2, [1, 2]);
            addTest(List.create([1, 2]), 3, [1, 2, 3]);
        });

        suite("addAll(T)", () =>
        {
            function addAllTest(list: List<number>, values: number[] | Iterable<number>, expected: number[]): void
            {
                test(`with ${andList([list, values].map(x => x.toString()))}`, () =>
                {
                    const addResult: List<number> = list.addAll(values);
                    assert.strictEqual(addResult, list);
                    assert.deepStrictEqual(list.toArray(), expected);
                });
            }

            addAllTest(List.create(), [1], [1]);
            addAllTest(List.create([1]), [2], [1, 2]);
            addAllTest(List.create([1, 2]), [3], [1, 2, 3]);
            addAllTest(List.create(), [1, 2], [1, 2]);
            addAllTest(List.create([1]), [2, 3], [1, 2, 3]);
            addAllTest(List.create([1, 2]), [3, 4], [1, 2, 3, 4]);

            addAllTest(List.create(), List.create([1]), [1]);
            addAllTest(List.create([1]), List.create([2]), [1, 2]);
            addAllTest(List.create([1, 2]), List.create([3]), [1, 2, 3]);
            addAllTest(List.create(), List.create([1, 2]), [1, 2]);
            addAllTest(List.create([1]), List.create([2, 3]), [1, 2, 3]);
            addAllTest(List.create([1, 2]), List.create([3, 4]), [1, 2, 3, 4]);
        });

        suite("insert(number,T)", () =>
        {
            function insertErrorTest(list: List<number>, index: number, value: number, expected: Error): void
            {
                test(`with ${andList([list, index, value].map(x => x.toString()))}`, () =>
                {
                    const backupList: List<number> = List.create(list);
                    assert.throws(() => list.insert(index, value), expected);
                    assert.deepStrictEqual(list, backupList);
                });
            }

            insertErrorTest(List.create(), -1, 1, new PreConditionError(join("\n", [
                "Expression: index",
                "Expected: 0",
                "Actual: -1"
            ])));
            insertErrorTest(List.create(), 1, 1, new PreConditionError(join("\n", [
                "Expression: index",
                "Expected: 0",
                "Actual: 1"
            ])));
            insertErrorTest(List.create([1]), -1, 1, new PreConditionError(join("\n", [
                "Expression: index",
                "Expected: between 0 and 1",
                "Actual: -1"
            ])));
            insertErrorTest(List.create([1]), 2, 1, new PreConditionError(join("\n", [
                "Expression: index",
                "Expected: between 0 and 1",
                "Actual: 2"
            ])));

            function insertTest(list: List<number>, index: number, value: number, expected: number[]): void
            {
                test(`with ${andList([list, index, value].map(x => x.toString()))}`, () =>
                {
                    const insertResult: List<number> = list.insert(index, value);
                    assert.strictEqual(insertResult, list);
                    assert.deepStrictEqual(list.toArray(), expected);
                });
            }

            insertTest(List.create(), 0, 1, [1]);
            insertTest(List.create([2]), 0, 1, [1, 2]);
            insertTest(List.create([1]), 1, 2, [1, 2]);
            insertTest(List.create([2, 3]), 0, 1, [1, 2, 3]);
            insertTest(List.create([1, 3]), 1, 2, [1, 2, 3]);
            insertTest(List.create([1, 2]), 2, 3, [1, 2, 3]);
        });

        suite("insertAll(number,T)", () =>
        {
            function insertAllErrorTest(list: List<number>, index: number, values: number[] | Iterable<number>, expected: Error): void
            {
                test(`with ${andList([list, index, values].map(x => x.toString()))}`, () =>
                {
                    const backupList: List<number> = List.create(list);
                    assert.throws(() => list.insertAll(index, values), expected);
                    assert.deepStrictEqual(list, backupList);
                });
            }

            insertAllErrorTest(List.create(), -1, [1], new PreConditionError(join("\n", [
                "Expression: index",
                "Expected: 0",
                "Actual: -1"
            ])));
            insertAllErrorTest(List.create(), 1, [1], new PreConditionError(join("\n", [
                "Expression: index",
                "Expected: 0",
                "Actual: 1"
            ])));
            insertAllErrorTest(List.create([1]), -1, [1], new PreConditionError(join("\n", [
                "Expression: index",
                "Expected: between 0 and 1",
                "Actual: -1"
            ])));
            insertAllErrorTest(List.create([1]), 2, [1], new PreConditionError(join("\n", [
                "Expression: index",
                "Expected: between 0 and 1",
                "Actual: 2"
            ])));

            function insertAllTest(list: List<number>, index: number, values: number[] | Iterable<number>, expected: number[]): void
            {
                test(`with ${andList([list, index, values].map(x => x.toString()))}`, () =>
                {
                    const insertResult: List<number> = list.insertAll(index, values);
                    assert.strictEqual(insertResult, list);
                    assert.deepStrictEqual(list.toArray(), expected);
                });
            }

            insertAllTest(List.create(), 0, [], []);
            insertAllTest(List.create(), 0, [1], [1]);
            insertAllTest(List.create([2]), 0, [1], [1, 2]);
            insertAllTest(List.create([1]), 1, [2], [1, 2]);
            insertAllTest(List.create([2, 3]), 0, [1], [1, 2, 3]);
            insertAllTest(List.create([1, 3]), 1, [2], [1, 2, 3]);
            insertAllTest(List.create([1, 2]), 2, [3], [1, 2, 3]);
            insertAllTest(List.create([3]), 0, [1, 2], [1, 2, 3]);
            insertAllTest(List.create([1]), 1, [2, 3], [1, 2, 3]);
            insertAllTest(List.create([1, 4]), 1, [2, 3], [1, 2, 3, 4]);

            insertAllTest(List.create(), 0, List.create([]), []);
            insertAllTest(List.create(), 0, List.create([1]), [1]);
            insertAllTest(List.create([2]), 0, List.create([1]), [1, 2]);
            insertAllTest(List.create([1]), 1, List.create([2]), [1, 2]);
            insertAllTest(List.create([2, 3]), 0, List.create([1]), [1, 2, 3]);
            insertAllTest(List.create([1, 3]), 1, List.create([2]), [1, 2, 3]);
            insertAllTest(List.create([1, 2]), 2, List.create([3]), [1, 2, 3]);
            insertAllTest(List.create([3]), 0, List.create([1, 2]), [1, 2, 3]);
            insertAllTest(List.create([1]), 1, List.create([2, 3]), [1, 2, 3]);
            insertAllTest(List.create([1, 4]), 1, List.create([2, 3]), [1, 2, 3, 4]);
        });
    });
});