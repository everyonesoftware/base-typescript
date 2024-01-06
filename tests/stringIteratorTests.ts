import * as assert from "assert";

import { join, PreConditionError, StringIterator } from "../sources/index";

suite("stringIterator.ts", () =>
{
    suite(StringIterator.name, () =>
    {
        suite("create(string)", () =>
        {
            function createErrorTest(value: string | undefined | null, expectedError: Error): void
            {
                test(`with ${value}`, () =>
                {
                    assert.throws(() => StringIterator.create(value!),
                        expectedError);
                });
            }

            createErrorTest(
                undefined,
                new PreConditionError([
                    "Expression: value",
                    "Expected: not undefined and not null",
                    "Actual: undefined",
                ].join("\n")));
            createErrorTest(
                null,
                new PreConditionError([
                    "Expression: value",
                    "Expected: not undefined and not null",
                    "Actual: null",
                ].join("\n")));

            function createTest(value: string): void
            {
                test(`with "${value}"`, () =>
                {
                    const iterator: StringIterator = StringIterator.create(value);
                    assert.strictEqual(iterator.hasStarted(), false);
                    assert.strictEqual(iterator.hasCurrent(), false);
                    assert.throws(() => iterator.getCurrentIndex(),
                        new PreConditionError([
                            "Expression: this.hasCurrent()",
                            "Expected: true",
                            "Actual: false",
                        ].join("\n")));
                    assert.throws(() => iterator.getCurrent(),
                        new PreConditionError([
                            "Expression: this.hasCurrent()",
                            "Expected: true",
                            "Actual: false",
                        ].join("\n")));
                });
            }

            createTest("");
            createTest("abc");
        });

        suite("start()", () =>
        {
            test("with empty iterator", () =>
            {
                const iterator = StringIterator.create("");
                assert.strictEqual(iterator.hasStarted(), false);

                for (let i: number = 0; i < 2; i++)
                {
                    const startResult = iterator.start();
                    assert.strictEqual(startResult, iterator);
                    assert.strictEqual(iterator.hasStarted(), true);
                    assert.strictEqual(iterator.hasCurrent(), false);
                }
            });

            test("with non-empty iterator", () =>
            {
                const iterator = StringIterator.create("abc");
                assert.strictEqual(iterator.hasStarted(), false);

                for (let i: number = 0; i < 2; i++)
                {
                    const startResult = iterator.start();
                    assert.strictEqual(startResult, iterator);
                    assert.strictEqual(iterator.hasStarted(), true);
                    assert.strictEqual(iterator.hasCurrent(), true);
                    assert.strictEqual(iterator.getCurrent(), "a");
                    assert.strictEqual(iterator.getCurrentIndex(), 0);
                }
            });
        });

        suite("takeCurrent()", () =>
        {
            test("when the Iterator doesn't have a current value", () =>
            {
                const iterator: StringIterator = StringIterator.create("");
                for (let i = 0; i < 2; i++)
                {
                    assert.throws(() => iterator.takeCurrent(),
                        new PreConditionError(join("\n", [
                            "Expression: iterator.hasCurrent()",
                            "Expected: true",
                            "Actual: false",
                        ])));
                    assert.strictEqual(iterator.hasStarted(), false);
                    assert.strictEqual(iterator.hasCurrent(), false);
                }
            });

            test("when the Iterator has a current value", () =>
            {
                const value: string = "abc";
                const iterator: StringIterator = StringIterator.create(value);

                assert.throws(() => iterator.takeCurrent(),
                        new PreConditionError(join("\n", [
                            "Expression: iterator.hasCurrent()",
                            "Expected: true",
                            "Actual: false",
                        ])));
                    assert.strictEqual(iterator.hasStarted(), false);
                    assert.strictEqual(iterator.hasCurrent(), false);

                iterator.start();
                for (let i = 0; i < value.length; i++)
                {
                    assert.strictEqual(iterator.takeCurrent(), value[i]);
                    assert.strictEqual(iterator.hasStarted(), true);
                    assert.strictEqual(iterator.hasCurrent(), (i < value.length - 1));
                }

                for (let i = 0; i < 2; i++)
                {
                    assert.throws(() => iterator.takeCurrent(),
                        new PreConditionError(join("\n", [
                            "Expression: iterator.hasCurrent()",
                            "Expected: true",
                            "Actual: false",
                        ])));
                    assert.strictEqual(iterator.hasStarted(), true);
                    assert.strictEqual(iterator.hasCurrent(), false);
                }
            });
        });

        suite("next()", () =>
        {
            function nextTest(value: string): void
            {
                test(`with "${value}"`, () =>
                {
                    const iterator: StringIterator = StringIterator.create(value);

                    for (let i = 0; i < value.length; i++)
                    {
                        assert.strictEqual(iterator.next(), true);
                        assert.strictEqual(iterator.hasStarted(), true);
                        assert.strictEqual(iterator.hasCurrent(), true);
                        assert.strictEqual(iterator.getCurrentIndex(), i);
                        assert.strictEqual(iterator.getCurrent(), value[i]);
                    }

                    for (let i = 0; i < 2; i++)
                    {
                        assert.strictEqual(iterator.next(), false);
                        assert.strictEqual(iterator.hasStarted(), true);
                        assert.strictEqual(iterator.hasCurrent(), false);
                        assert.throws(() => iterator.getCurrentIndex(),
                            new PreConditionError([
                                "Expression: this.hasCurrent()",
                                "Expected: true",
                                "Actual: false",
                            ].join("\n")));
                        assert.throws(() => iterator.getCurrent(),
                            new PreConditionError([
                                "Expression: this.hasCurrent()",
                                "Expected: true",
                                "Actual: false",
                            ].join("\n")));
                    }
                });
            }

            nextTest("");
            nextTest("a");
            nextTest("abc");
        });

        suite("for...of", () =>
        {
            function forOfTest(value: string): void
            {
                test(`with "${value}"`, () =>
                {
                    const iterator: StringIterator = StringIterator.create(value);

                    let expectedIndex: number = 0;
                    for (const c of iterator)
                    {
                        assert.strictEqual(iterator.hasStarted(), true);
                        assert.strictEqual(iterator.hasCurrent(), true);
                        assert.strictEqual(iterator.getCurrentIndex(), expectedIndex);
                        assert.strictEqual(iterator.getCurrent(), value[expectedIndex]);
                        assert.strictEqual(c, value[expectedIndex]);
                        expectedIndex++;
                    }

                    for (let i = 0; i < 2; i++)
                    {
                        assert.strictEqual(iterator.next(), false);
                        assert.strictEqual(iterator.hasStarted(), true);
                        assert.strictEqual(iterator.hasCurrent(), false);
                        assert.throws(() => iterator.getCurrentIndex(),
                            new PreConditionError([
                                "Expression: this.hasCurrent()",
                                "Expected: true",
                                "Actual: false",
                            ].join("\n")));
                        assert.throws(() => iterator.getCurrent(),
                            new PreConditionError([
                                "Expression: this.hasCurrent()",
                                "Expected: true",
                                "Actual: false",
                            ].join("\n")));
                    }
                });
            }

            forOfTest("");
            forOfTest("a");
            forOfTest("abc");
        });
    });
});