import * as assert from "assert";
import { CharacterList, List, PreConditionError, andList, toString } from "../sources";

suite("characterList.ts", () =>
{
    suite("CharacterList", () =>
    {
        suite("create(JavascriptIterable<number> | undefined)", () =>
        {
            test("with undefined", () =>
            {
                const list: CharacterList = CharacterList.create(undefined);
                assert.strictEqual(list.getCount(), 0);
            });

            test("with null", () =>
            {
                const list: CharacterList = CharacterList.create(null!);
                assert.strictEqual(list.getCount(), 0);
            });

            test("with empty array", () =>
            {
                const list: CharacterList = CharacterList.create([]);
                assert.strictEqual(list.getCount(), 0);
            });

            test("with non-empty array", () =>
            {
                const list: CharacterList = CharacterList.create(["a", "b", "c"]);
                assert.strictEqual(list.getCount(), 3);
                assert.deepStrictEqual(list.toArray(), ["a", "b", "c"]);
                assert.strictEqual(list.toString(), "abc");
            });

            test("with empty Iterable<string>", () =>
            {
                const list: CharacterList = CharacterList.create(List.create());
                assert.strictEqual(list.getCount(), 0);
            });

            test("with non-empty Iterable<string>", () =>
            {
                const list: CharacterList = CharacterList.create(List.create(["a", "b", "c"]));
                assert.strictEqual(list.getCount(), 3);
                assert.deepStrictEqual(list.toArray(), ["a", "b", "c"]);
                assert.strictEqual(list.toString(), "abc");
            });
        });

        suite("set(number, string)", () =>
        {
            function setErrorTest(list: CharacterList, index: number, value: string, expected: Error): void
            {
                test(`with ${andList([list, index, value].map(toString))}`, () =>
                {
                    assert.throws(() => list.set(index, value), expected);
                });
            }

            setErrorTest(CharacterList.create(), -1, "a", new PreConditionError(
                "Expression: count",
                "Expected: greater than or equal to 1",
                "Actual: 0"));
            setErrorTest(CharacterList.create(), 0, "a", new PreConditionError(
                "Expression: count",
                "Expected: greater than or equal to 1",
                "Actual: 0"));
            setErrorTest(CharacterList.create(), 1, "a", new PreConditionError(
                "Expression: count",
                "Expected: greater than or equal to 1",
                "Actual: 0"));
            setErrorTest(CharacterList.create(["a"]), -1, "b", new PreConditionError(
                "Expression: index",
                "Expected: 0",
                "Actual: -1"));
            setErrorTest(CharacterList.create(["a"]), 1, "b", new PreConditionError(
                "Expression: index",
                "Expected: 0",
                "Actual: 1"));
            setErrorTest(CharacterList.create(["a", "b"]), -1, "b", new PreConditionError(
                "Expression: index",
                "Expected: between 0 and 1",
                "Actual: -1"));
            setErrorTest(CharacterList.create(["a", "b"]), 2, "b", new PreConditionError(
                "Expression: index",
                "Expected: between 0 and 1",
                "Actual: 2"));

            function setTest(list: CharacterList, index: number, value: string): void
            {
                test(`with ${andList([list, index, value].map(toString))}`, () =>
                {
                    const setResult: CharacterList = list.set(index, value);
                    assert.strictEqual(setResult, list);
                    assert.strictEqual(list.get(index), value);
                });
            }

            setTest(CharacterList.create(["a"]), 0, "b");
            setTest(CharacterList.create(["a"]), 0, "c");
            setTest(CharacterList.create(["a"]), 0, "D");
            setTest(CharacterList.create(["a"]), 0, "E");
            setTest(CharacterList.create(["a"]), 0, "5");
            setTest(CharacterList.create(["a", "b"]), 0, "/");
            setTest(CharacterList.create(["a", "b"]), 1, "*");
        });

        suite("get(number)", () =>
        {
            function getErrorTest(list: CharacterList, index: number, expected: Error): void
            {
                test(`with ${andList([list, index].map(toString))}`, () =>
                {
                    assert.throws(() => list.get(index), expected);
                });
            }

            getErrorTest(CharacterList.create(), -1, new PreConditionError(
                "Expression: count",
                "Expected: greater than or equal to 1",
                "Actual: 0"));
            getErrorTest(CharacterList.create(), 0, new PreConditionError(
                "Expression: count",
                "Expected: greater than or equal to 1",
                "Actual: 0"));
            getErrorTest(CharacterList.create(), 1, new PreConditionError(
                "Expression: count",
                "Expected: greater than or equal to 1",
                "Actual: 0"));

            getErrorTest(CharacterList.create(["f"]), -1, new PreConditionError(
                "Expression: index",
                "Expected: 0",
                "Actual: -1"));
            getErrorTest(CharacterList.create(["f"]), 1, new PreConditionError(
                "Expression: index",
                "Expected: 0",
                "Actual: 1"));

            getErrorTest(CharacterList.create(["f", "g"]), -1, new PreConditionError(
                "Expression: index",
                "Expected: between 0 and 1",
                "Actual: -1"));
            getErrorTest(CharacterList.create(["f", "g"]), 2, new PreConditionError(
                "Expression: index",
                "Expected: between 0 and 1",
                "Actual: 2"));
        });

        suite("insert(number,number)", () =>
        {
            function insertErrorTest(list: CharacterList, index: number, value: string, expected: Error): void
            {
                test(`with ${andList([list, index, value].map(toString))}`, () =>
                {
                    assert.throws(() => list.insert(index, value), expected);
                });
            }

            insertErrorTest(CharacterList.create(), -1, "a", new PreConditionError(
                "Expression: index",
                "Expected: 0",
                "Actual: -1"));
            insertErrorTest(CharacterList.create(), 1, "a", new PreConditionError(
                "Expression: index",
                "Expected: 0",
                "Actual: 1"));

            function insertTest(list: CharacterList, index: number, value: string, expected: string[]): void
            {
                test(`with ${andList([list, index, value].map(toString))}`, () =>
                {
                    const insertResult: CharacterList = list.insert(index, value);
                    assert.strictEqual(list, insertResult);
                    assert.deepStrictEqual(list.toArray(), expected);
                });
            }

            insertTest(CharacterList.create(), 0, "a", ["a"]);
            insertTest(CharacterList.create(), 0, "z", ["z"]);
            insertTest(CharacterList.create(["a"]), 0, "b", ["b", "a"]);
            insertTest(CharacterList.create(["a"]), 1, "b", ["a", "b"]);
            insertTest(CharacterList.create(["a", "c"]), 0, "x", ["x", "a", "c"]);
            insertTest(CharacterList.create(["a", "c"]), 1, "x", ["a", "x", "c"]);
            insertTest(CharacterList.create(["a", "c"]), 2, "x", ["a", "c", "x"]);
            
            test("with a lot of calls", () =>
            {
                const list: CharacterList = CharacterList.create();
                const count: number = 1000;
                for (let i = 0; i < count; i++)
                {
                    list.insert(Math.floor(i / 2), "a");
                }
                assert.strictEqual(list.getCount(), count);
            });
        });
    });
});