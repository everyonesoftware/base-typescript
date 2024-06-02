import { Test, TestRunner } from "@everyonesoftware/test-typescript";
import { CharacterList, List, PreConditionError } from "../sources";

export function test(runner: TestRunner): void
{
    runner.testFile("characterList.ts", () =>
    {
        runner.testType(CharacterList.name, () =>
        {
            runner.testFunction("create(JavascriptIterable<number> | undefined)", () =>
            {
                runner.test("with undefined", (test: Test) =>
                {
                    const list: CharacterList = CharacterList.create(undefined);
                    test.assertEqual(list.getCount(), 0);
                });

                runner.test("with null", (test: Test) =>
                {
                    const list: CharacterList = CharacterList.create(null!);
                    test.assertEqual(list.getCount(), 0);
                });

                runner.test("with empty array", (test: Test) =>
                {
                    const list: CharacterList = CharacterList.create([]);
                    test.assertEqual(list.getCount(), 0);
                });

                runner.test("with non-empty array", (test: Test) =>
                {
                    const list: CharacterList = CharacterList.create(["a", "b", "c"]);
                    test.assertEqual(list.getCount(), 3);
                    test.assertEqual(list.toArray(), ["a", "b", "c"]);
                    test.assertEqual(list.toString(), "abc");
                });

                runner.test("with empty Iterable<string>", (test: Test) =>
                {
                    const list: CharacterList = CharacterList.create(List.create());
                    test.assertEqual(list.getCount(), 0);
                });

                runner.test("with non-empty Iterable<string>", (test: Test) =>
                {
                    const list: CharacterList = CharacterList.create(List.create(["a", "b", "c"]));
                    test.assertEqual(list.getCount(), 3);
                    test.assertEqual(list.toArray(), ["a", "b", "c"]);
                    test.assertEqual(list.toString(), "abc");
                });
            });

            runner.testFunction("set(number, string)", () =>
            {
                function setErrorTest(list: CharacterList, index: number, value: string, expected: Error): void
                {
                    runner.test(`with ${runner.andList([list, index, value])}`, (test: Test) =>
                    {
                        test.assertThrows(() => list.set(index, value), expected);
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
                    runner.test(`with ${runner.andList([list, index, value])}`, (test: Test) =>
                    {
                        const setResult: CharacterList = list.set(index, value);
                        test.assertEqual(setResult, list);
                        test.assertEqual(list.get(index), value);
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

            runner.testFunction("get(number)", () =>
            {
                function getErrorTest(list: CharacterList, index: number, expected: Error): void
                {
                    runner.test(`with ${runner.andList([list, index])}`, (test: Test) =>
                    {
                        test.assertThrows(() => list.get(index), expected);
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

            runner.testFunction("insert(number,number)", () =>
            {
                function insertErrorTest(list: CharacterList, index: number, value: string, expected: Error): void
                {
                    runner.test(`with ${runner.andList([list, index, value])}`, (test: Test) =>
                    {
                        test.assertThrows(() => list.insert(index, value), expected);
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
                    runner.test(`with ${runner.andList([list, index, value])}`, (test: Test) =>
                    {
                        const insertResult: CharacterList = list.insert(index, value);
                        test.assertEqual(list, insertResult);
                        test.assertEqual(list.toArray(), expected);
                    });
                }

                insertTest(CharacterList.create(), 0, "a", ["a"]);
                insertTest(CharacterList.create(), 0, "z", ["z"]);
                insertTest(CharacterList.create(["a"]), 0, "b", ["b", "a"]);
                insertTest(CharacterList.create(["a"]), 1, "b", ["a", "b"]);
                insertTest(CharacterList.create(["a", "c"]), 0, "x", ["x", "a", "c"]);
                insertTest(CharacterList.create(["a", "c"]), 1, "x", ["a", "x", "c"]);
                insertTest(CharacterList.create(["a", "c"]), 2, "x", ["a", "c", "x"]);
                
                runner.test("with a lot of calls", (test: Test) =>
                {
                    const list: CharacterList = CharacterList.create();
                    const count: number = 1000;
                    for (let i = 0; i < count; i++)
                    {
                        list.insert(Math.floor(i / 2), "a");
                    }
                    test.assertEqual(list.getCount(), count);
                });
            });
        });
    });
}
test(TestRunner.create());