import * as assert from "assert"

import { andList, escapeAndQuote, join, Condition, Pre, Post, PostConditionError, PreConditionError } from "../sources/index"

suite("condition.ts", () =>
{
    suite(Condition.name, () =>
    {
        suite("create((string) => Error)", () =>
        {
            test("with no arguments", () =>
            {
                const condition: Condition = Condition.create();
                assert.notStrictEqual(condition, undefined);
                assert.throws(() => condition.assertFalse(true),
                    new Error([
                        "Expected: false",
                        "Actual: true",
                    ].join("\n")));
            });

            test("with undefined", () =>
            {
                const condition: Condition = Condition.create(undefined);
                assert.notStrictEqual(condition, undefined);
                assert.throws(() => condition.assertFalse(true),
                    new Error([
                        "Expected: false",
                        "Actual: true",
                    ].join("\n")));
            });

            test("with defined", () =>
            {
                const condition: Condition = Condition.create((message: string) =>
                {
                    return new PostConditionError(`aaa ${message} aaa`);
                });
                assert.notStrictEqual(condition, undefined);
                assert.throws(() => condition.assertFalse(true),
                    new PostConditionError([
                        "aaa Expected: false",
                        "Actual: true aaa",
                    ].join("\n")));
            });
        });

        suite("assertNotUndefinedAndNotNull<T>(undefined|null|T,string?,string?)", () =>
        {
            test("with undefined", () =>
            {
                const condition: Condition = Condition.create();
                assert.throws(() => condition.assertNotUndefinedAndNotNull(undefined),
                    new Error([
                        "Expected: not undefined and not null",
                        "Actual: undefined",
                    ].join("\n")));
            });

            test("with null", () =>
            {
                const condition: Condition = Condition.create();
                assert.throws(() => condition.assertNotUndefinedAndNotNull(null),
                    new Error([
                        "Expected: not undefined and not null",
                        "Actual: null",
                    ].join("\n")));
            });

            test("with not undefined and not null", () =>
            {
                function valueCreator(): string | undefined
                {
                    return "hello";
                }

                const condition: Condition = Condition.create();
                const value: string | undefined = valueCreator();
                condition.assertNotUndefinedAndNotNull(value);
                assert.strictEqual(value.substring(1, 3), "el");
            });

            test("with undefined and expression", () =>
            {
                const condition: Condition = Condition.create();
                assert.throws(() => condition.assertNotUndefinedAndNotNull(undefined, "fake-expression"),
                    new Error([
                        "Expression: fake-expression",
                        "Expected: not undefined and not null",
                        "Actual: undefined"
                    ].join("\n")));
            });

            test("with null, expression, and message", () =>
            {
                const condition: Condition = Condition.create();
                assert.throws(() => condition.assertNotUndefinedAndNotNull(null, "fake-expression", "fake-message"),
                    new Error([
                        "Message: fake-message",
                        "Expression: fake-expression",
                        "Expected: not undefined and not null",
                        "Actual: null"
                    ].join("\n")));
            });
        });

        suite("assertTrue(boolean)", () =>
        {
            test("with false", () =>
            {
                const condition: Condition = Condition.create();
                assert.throws(() => condition.assertTrue(false),
                    new Error([
                        "Expected: true",
                        "Actual: false",
                    ].join("\n")));
            });

            test("with true", () =>
            {
                function valueCreator(): boolean { return true; }
                const condition: Condition = Condition.create();
                const value: boolean = valueCreator();
                condition.assertTrue(value);
                assert.strictEqual(value, true);
            });
        });

        suite("assertFalse(boolean)", () =>
        {
            test("with true", () =>
            {
                const condition: Condition = Condition.create();
                assert.throws(() => condition.assertFalse(true),
                    new Error([
                        "Expected: false",
                        "Actual: true",
                    ].join("\n")));
            });

            test("with false", () =>
            {
                function valueCreator(): boolean { return false; }
                const condition: Condition = Condition.create();
                const value: boolean = valueCreator();
                condition.assertFalse(value);
                assert.strictEqual(value, false);
            });
        });

        suite("assertSame<T>(T,T,string?,string?)", () =>
        {
            function assertSameTest<T>(expected: T, actual: T, expression: string | undefined, message: string | undefined, expectedError?: Error): void
            {
                test(`with ${andList([expected, actual, expression, message].map(x => JSON.stringify(x)))}`, () =>
                {
                    const condition: Condition = Condition.create();
                    if (expectedError)
                    {
                        assert.throws(() => condition.assertSame(expected, actual, expression, message), expectedError);
                    }
                    else
                    {
                        condition.assertSame(expected, actual, expression, message);
                    }
                });
            }

            assertSameTest(undefined, undefined, "fake-expression", "fake-message");
            assertSameTest(null, null, "fake-expression", "fake-message");
            assertSameTest(0, 0, "fake-expression", "fake-message");
            assertSameTest(10, 10, "fake-expression", "fake-message");
            assertSameTest(true, true, "fake-expression", "fake-message");
            assertSameTest("abc", "abc", "fake-expression", "fake-message");
            
            const o = {};
            assertSameTest(o, o, "fake-expression", "fake-message");

            assertSameTest(
                undefined,
                null,
                "fake-expression",
                "fake-message",
                new Error(join("\n", [
                    "Message: fake-message",
                    "Expression: fake-expression",
                    "Expected: undefined",
                    "Actual: null",
                ])));
            assertSameTest(
                3,
                4,
                "fake-expression",
                "fake-message",
                new Error(join("\n", [
                    "Message: fake-message",
                    "Expression: fake-expression",
                    "Expected: 3",
                    "Actual: 4",
                ])));
            assertSameTest(
                {},
                {},
                "fake-expression",
                "fake-message",
                new Error(join("\n", [
                    "Message: fake-message",
                    "Expression: fake-expression",
                    "Expected: {}",
                    "Actual: {}",
                ])));
            assertSameTest(
                { "a": "b" },
                { "a": "b" },
                "fake-expression",
                "fake-message",
                new Error(join("\n", [
                    "Message: fake-message",
                    "Expression: fake-expression",
                    "Expected: {\"a\":\"b\"}",
                    "Actual: {\"a\":\"b\"}",
                ])));
            assertSameTest(
                [],
                [],
                "fake-expression",
                "fake-message",
                new Error(join("\n", [
                    "Message: fake-message",
                    "Expression: fake-expression",
                    "Expected: []",
                    "Actual: []",
                ])));
        });

        suite("assertNotSame<T>(T,T,string?,string?)", () =>
        {
            function assertNotSameTest<T>(expected: T, actual: T, expression: string | undefined, message: string | undefined, expectedError?: Error): void
            {
                test(`with ${andList([expected, actual, expression, message].map(x => JSON.stringify(x)))}`, () =>
                {
                    const condition: Condition = Condition.create();
                    if (expectedError)
                    {
                        assert.throws(() => condition.assertNotSame(expected, actual, expression, message), expectedError);
                    }
                    else
                    {
                        condition.assertNotSame(expected, actual, expression, message);
                    }
                });
            }

            assertNotSameTest(
                undefined,
                undefined,
                "fake-expression",
                "fake-message",
                new Error(join("\n", [
                    "Message: fake-message",
                    "Expression: fake-expression",
                    "Expected: not undefined",
                    "Actual: undefined",
                ])));
            assertNotSameTest(
                null,
                null,
                "fake-expression",
                "fake-message",
                new Error(join("\n", [
                    "Message: fake-message",
                    "Expression: fake-expression",
                    "Expected: not null",
                    "Actual: null",
                ])));
            assertNotSameTest(
                0,
                0,
                "fake-expression",
                "fake-message",
                new Error(join("\n", [
                    "Message: fake-message",
                    "Expression: fake-expression",
                    "Expected: not 0",
                    "Actual: 0",
                ])));
            assertNotSameTest(
                10,
                10,
                "fake-expression",
                "fake-message",
                new Error(join("\n", [
                    "Message: fake-message",
                    "Expression: fake-expression",
                    "Expected: not 10",
                    "Actual: 10",
                ])));
            assertNotSameTest(
                true,
                true,
                "fake-expression",
                "fake-message",
                new Error(join("\n", [
                    "Message: fake-message",
                    "Expression: fake-expression",
                    "Expected: not true",
                    "Actual: true",
                ])));
            assertNotSameTest(
                "abc",
                "abc",
                "fake-expression",
                "fake-message",
                new Error(join("\n", [
                    "Message: fake-message",
                    "Expression: fake-expression",
                    "Expected: not \"abc\"",
                    "Actual: \"abc\"",
                ])));
            
            const o = {};
            assertNotSameTest(
                o,
                o,
                "fake-expression",
                "fake-message",
                new Error(join("\n", [
                    "Message: fake-message",
                    "Expression: fake-expression",
                    "Expected: not {}",
                    "Actual: {}",
                ])));

            assertNotSameTest(undefined, null, "fake-expression", "fake-message");
            assertNotSameTest(false, true, "fake-expression", "fake-message");
            assertNotSameTest(1, 2, "fake-expression", "fake-message");
            assertNotSameTest({}, {}, "fake-expression", "fake-message");
            assertNotSameTest({ "a": "b" }, { "a": "b" }, "fake-expression", "fake-message");
            assertNotSameTest([], [], "fake-expression", "fake-message");
        });

        suite("assertNotEmpty(string,string?,string?)", () =>
        {
            function assertNotEmptyTest(value: string, expression: string | undefined, message: string | undefined, expectedError?: Error): void
            {
                test(`with ${andList([value, expression, message].map(x => escapeAndQuote(x)))}`, () =>
                {
                    const condition: Condition = Condition.create();
                    if (expectedError)
                    {
                        assert.throws(() => condition.assertNotEmpty(value, expression, message), expectedError);
                    }
                    else
                    {
                        condition.assertNotEmpty(value, expression, message);
                    }
                });
            }

            assertNotEmptyTest(undefined!, "fake-expression", "fake-message", new Error(join("\n", [
                "Message: fake-message",
                "Expression: fake-expression",
                "Expected: not undefined and not null",
                "Actual: undefined",
            ])));
            assertNotEmptyTest(null!, "fake-expression", "fake-message", new Error(join("\n", [
                "Message: fake-message",
                "Expression: fake-expression",
                "Expected: not undefined and not null",
                "Actual: null",
            ])));
            assertNotEmptyTest("", "fake-expression", "fake-message", new Error(join("\n", [
                "Message: fake-message",
                "Expression: fake-expression",
                "Expected: not empty",
                "Actual: \"\"",
            ])));
            assertNotEmptyTest(" ", "fake-expression", "fake-message");
            assertNotEmptyTest("a", "fake-expression", "fake-message");
        });

        suite("assertLessThan(number,number,string?,string?)", () =>
        {
            function assertLessThanTest(value: number, upperBound: number, expression?: string, message?: string, expectedError?: Error): void
            {
                test(`with ${andList([`${value}`, `${upperBound}`])}`, () =>
                {
                    const condition: Condition = Condition.create();
                    if (expectedError === undefined)
                    {
                        condition.assertLessThan(value, upperBound, expression, message);
                    }
                    else
                    {
                        assert.throws(() => condition.assertLessThan(value, upperBound, expression, message), expectedError);
                    }
                });
            }

            assertLessThanTest(-10, -9);
            assertLessThanTest(-1, 0);
            assertLessThanTest(0, 1);
            assertLessThanTest(4, 5);

            assertLessThanTest(-1, -1, undefined, undefined, new Error(join("\n", [
                "Expected: less than -1",
                "Actual: -1",
            ])));
            assertLessThanTest(0, 0, undefined, undefined, new Error(join("\n", [
                "Expected: less than 0",
                "Actual: 0",
            ])));
            assertLessThanTest(2, 1, undefined, undefined, new Error(join("\n", [
                "Expected: less than 1",
                "Actual: 2",
            ])));
            assertLessThanTest(2, 1, "fake-expression", "fake-message", new Error(join("\n", [
                "Message: fake-message",
                "Expression: fake-expression",
                "Expected: less than 1",
                "Actual: 2",
            ])));
        });

        suite("assertLessThanOrEqualTo(number,number,string?,string?)", () =>
        {
            function assertLessThanOrEqualToTest(value: number, upperBound: number, expression?: string, message?: string, expectedError?: Error): void
            {
                test(`with ${andList([`${value}`, `${upperBound}`])}`, () =>
                {
                    const condition: Condition = Condition.create();
                    if (expectedError === undefined)
                    {
                        condition.assertLessThanOrEqualTo(value, upperBound, expression, message);
                    }
                    else
                    {
                        assert.throws(() => condition.assertLessThanOrEqualTo(value, upperBound, expression, message), expectedError);
                    }
                });
            }

            assertLessThanOrEqualToTest(-10, -9);
            assertLessThanOrEqualToTest(-1, 0);
            assertLessThanOrEqualToTest(0, 1);
            assertLessThanOrEqualToTest(4, 5);
            assertLessThanOrEqualToTest(-1, -1);
            assertLessThanOrEqualToTest(0, 0);
            assertLessThanOrEqualToTest(1, 1);

            assertLessThanOrEqualToTest(2, 1, undefined, undefined, new Error(join("\n", [
                "Expected: less than or equal to 1",
                "Actual: 2",
            ])));
            assertLessThanOrEqualToTest(2, 1, "fake-expression", "fake-message", new Error(join("\n", [
                "Message: fake-message",
                "Expression: fake-expression",
                "Expected: less than or equal to 1",
                "Actual: 2",
            ])));
        });

        suite("assertGreaterThanOrEqualTo(number,number,string?,string?)", () =>
        {
            function assertGreaterThanOrEqualToTest(value: number, lowerBound: number, expression?: string, message?: string, expectedError?: Error): void
            {
                test(`with ${andList([`${value}`, `${lowerBound}`])}`, () =>
                {
                    const condition: Condition = Condition.create();
                    if (expectedError === undefined)
                    {
                        condition.assertGreaterThanOrEqualTo(value, lowerBound, expression, message);
                    }
                    else
                    {
                        assert.throws(() => condition.assertGreaterThanOrEqualTo(value, lowerBound, expression, message), expectedError);
                    }
                });
            }

            assertGreaterThanOrEqualToTest(-9, -10);
            assertGreaterThanOrEqualToTest(0, -1);
            assertGreaterThanOrEqualToTest(1, 0);
            assertGreaterThanOrEqualToTest(5, 4);
            assertGreaterThanOrEqualToTest(-1, -1);
            assertGreaterThanOrEqualToTest(0, 0);
            assertGreaterThanOrEqualToTest(1, 1);

            assertGreaterThanOrEqualToTest(1, 2, undefined, undefined, new Error(join("\n", [
                "Expected: greater than or equal to 2",
                "Actual: 1",
            ])));
            assertGreaterThanOrEqualToTest(1, 2, "fake-expression", "fake-message", new Error(join("\n", [
                "Message: fake-message",
                "Expression: fake-expression",
                "Expected: greater than or equal to 2",
                "Actual: 1",
            ])));
        });

        suite("assertGreaterThan(number,number,string?,string?)", () =>
        {
            function assertGreaterThanTest(value: number, lowerBound: number, expression?: string, message?: string, expectedError?: Error): void
            {
                test(`with ${andList([`${value}`, `${lowerBound}`])}`, () =>
                {
                    const condition: Condition = Condition.create();
                    if (expectedError === undefined)
                    {
                        condition.assertGreaterThan(value, lowerBound, expression, message);
                    }
                    else
                    {
                        assert.throws(() => condition.assertGreaterThan(value, lowerBound, expression, message), expectedError);
                    }
                });
            }

            assertGreaterThanTest(-9, -10);
            assertGreaterThanTest(0, -1);
            assertGreaterThanTest(1, 0);
            assertGreaterThanTest(5, 4);

            assertGreaterThanTest(-1, -1, undefined, undefined, new Error(join("\n", [
                "Expected: greater than -1",
                "Actual: -1",
            ])));
            assertGreaterThanTest(0, 0, undefined, undefined, new Error(join("\n", [
                "Expected: greater than 0",
                "Actual: 0",
            ])));
            assertGreaterThanTest(1, 2, undefined, undefined, new Error(join("\n", [
                "Expected: greater than 2",
                "Actual: 1",
            ])));
            assertGreaterThanTest(1, 2, "fake-expression", "fake-message", new Error(join("\n", [
                "Message: fake-message",
                "Expression: fake-expression",
                "Expected: greater than 2",
                "Actual: 1",
            ])));
        });

        suite("assertBetween(number,number,number,string?,string?)", () =>
        {
            function assertBetweenTest(lowerBound: number, value: number, upperBound: number, expression?: string, message?: string, expectedError?: Error): void
            {
                test(`with ${andList([`${lowerBound}`, `${value}`, `${upperBound}`])}`, () =>
                {
                    const condition: Condition = Condition.create();
                    if (expectedError === undefined)
                    {
                        condition.assertBetween(lowerBound, value, upperBound, expression, message);
                    }
                    else
                    {
                        assert.throws(() => condition.assertBetween(lowerBound, value, upperBound, expression, message), expectedError);
                    }
                });
            }

            assertBetweenTest(-12, -11, -10);
            assertBetweenTest(-1, 0, 1);
            assertBetweenTest(0, 1, 2);
            assertBetweenTest(4, 5, 6);
            assertBetweenTest(0, 0, 0);
            assertBetweenTest(1, 1, 1);

            assertBetweenTest(0, 1, 0, undefined, undefined, new Error(join("\n", [
                "Expected: 0",
                "Actual: 1",
            ])));
            assertBetweenTest(0, -1, 0, undefined, undefined, new Error(join("\n", [
                "Expected: 0",
                "Actual: -1",
            ])));
            assertBetweenTest(0, -1, 2, undefined, undefined, new Error(join("\n", [
                "Expected: between 0 and 2",
                "Actual: -1",
            ])));
            assertBetweenTest(0, 3, 2, undefined, undefined, new Error(join("\n", [
                "Expected: between 0 and 2",
                "Actual: 3",
            ])));
            assertBetweenTest(5, 3, 2, "fake-expression", "fake-message", new Error(join("\n", [
                "Expression: lowerBound",
                "Expected: less than or equal to 2",
                "Actual: 5",
            ])));
        });

        suite("assertAccessIndex(number,number,string?,string?)", () =>
        {
            function assertAccessIndexTest(index: number, count: number, expression?: string, message?: string, expectedError?: Error): void
            {
                test(`with ${andList([`${index}`, `${count}`])}`, () =>
                {
                    const condition: Condition = Condition.create();
                    if (expectedError === undefined)
                    {
                        condition.assertAccessIndex(index, count, expression, message);
                    }
                    else
                    {
                        assert.throws(() => condition.assertAccessIndex(index, count, expression, message), expectedError);
                    }
                });
            }

            assertAccessIndexTest(0, 1);
            assertAccessIndexTest(0, 2);
            assertAccessIndexTest(1, 2);

            assertAccessIndexTest(-1, 0, undefined, undefined, new Error(join("\n", [
                "Expression: count",
                "Expected: greater than or equal to 1",
                "Actual: 0",
            ])));
            assertAccessIndexTest(0, 0, undefined, undefined, new Error(join("\n", [
                "Expression: count",
                "Expected: greater than or equal to 1",
                "Actual: 0",
            ])));
            assertAccessIndexTest(1, 0, undefined, undefined, new Error(join("\n", [
                "Expression: count",
                "Expected: greater than or equal to 1",
                "Actual: 0",
            ])));
            assertAccessIndexTest(-1, 1, undefined, undefined, new Error(join("\n", [
                "Expected: 0",
                "Actual: -1",
            ])));
            assertAccessIndexTest(1, 1, undefined, undefined, new Error(join("\n", [
                "Expected: 0",
                "Actual: 1",
            ])));
            assertAccessIndexTest(-1, 2, undefined, undefined, new Error(join("\n", [
                "Expected: between 0 and 1",
                "Actual: -1",
            ])));
            assertAccessIndexTest(1, 1, "fake-expression", "fake-message", new Error(join("\n", [
                "Message: fake-message",
                "Expression: fake-expression",
                "Expected: 0",
                "Actual: 1",
            ])));
            assertAccessIndexTest(3, 2, "fake-expression", "fake-message", new Error(join("\n", [
                "Message: fake-message",
                "Expression: fake-expression",
                "Expected: between 0 and 1",
                "Actual: 3",
            ])));
        });

        suite("assertInsertIndex(number,number,string?,string?)", () =>
        {
            function assertInsertIndexTest(index: number, count: number, expression?: string, message?: string, expectedError?: Error): void
            {
                test(`with ${andList([`${index}`, `${count}`])}`, () =>
                {
                    const condition: Condition = Condition.create();
                    if (expectedError === undefined)
                    {
                        condition.assertInsertIndex(index, count, expression, message);
                    }
                    else
                    {
                        assert.throws(() => condition.assertInsertIndex(index, count, expression, message), expectedError);
                    }
                });
            }

            assertInsertIndexTest(0, 0);
            assertInsertIndexTest(0, 1);
            assertInsertIndexTest(1, 1);
            assertInsertIndexTest(0, 2);
            assertInsertIndexTest(1, 2);
            assertInsertIndexTest(2, 2);

            assertInsertIndexTest(-1, 0, undefined, undefined, new Error(join("\n", [
                "Expected: 0",
                "Actual: -1",
            ])));
            assertInsertIndexTest(1, 0, undefined, undefined, new Error(join("\n", [
                "Expected: 0",
                "Actual: 1",
            ])));
            assertInsertIndexTest(-1, 1, undefined, undefined, new Error(join("\n", [
                "Expected: between 0 and 1",
                "Actual: -1",
            ])));
            assertInsertIndexTest(2, 1, undefined, undefined, new Error(join("\n", [
                "Expected: between 0 and 1",
                "Actual: 2",
            ])));
            assertInsertIndexTest(-1, 2, undefined, undefined, new Error(join("\n", [
                "Expected: between 0 and 2",
                "Actual: -1",
            ])));
            assertInsertIndexTest(2, 1, "fake-expression", "fake-message", new Error(join("\n", [
                "Message: fake-message",
                "Expression: fake-expression",
                "Expected: between 0 and 1",
                "Actual: 2",
            ])));
            assertInsertIndexTest(3, 2, "fake-expression", "fake-message", new Error(join("\n", [
                "Message: fake-message",
                "Expression: fake-expression",
                "Expected: between 0 and 2",
                "Actual: 3",
            ])));
        });
    });

    suite(Pre.name, () =>
    {
        test("Condition is not undefined and not null", () =>
        {
            assert.notStrictEqual(Pre.condition, undefined);
            assert.notStrictEqual(Pre.condition, null);
        });
    });

    suite(PreConditionError.name, () =>
    {
        suite("constructor(string|undefined)", () =>
        {
            test("with no arguments", () =>
            {
                const error: PreConditionError = new PreConditionError();
                assert.notStrictEqual(error, undefined);
                assert.notStrictEqual(error, null);
                assert.strictEqual(error.name, "Error");
                assert.strictEqual(error.message, "");
                assert.notStrictEqual(error.stack, undefined);
                assert.notStrictEqual(error.stack, null);
            });
        });
    });

    suite(Post.name, () =>
    {
        test("Condition is not undefined and not null", () =>
        {
            assert.notStrictEqual(Post.condition, undefined);
            assert.notStrictEqual(Post.condition, null);
        });
    });

    suite(PostConditionError.name, () =>
    {
        suite("constructor(string|undefined)", () =>
        {
            test("with no arguments", () =>
            {
                const error: PostConditionError = new PostConditionError();
                assert.notStrictEqual(error, undefined);
                assert.notStrictEqual(error, null);
                assert.strictEqual(error.name, "Error");
                assert.strictEqual(error.message, "");
                assert.notStrictEqual(error.stack, undefined);
                assert.notStrictEqual(error.stack, null);
            });
        });
    });
});
