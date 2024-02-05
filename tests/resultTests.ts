import * as assert from "assert";

import { PreConditionError, Result } from "../sources";

suite("result.ts", () =>
{
    suite("Result<T>", () =>
    {
        suite("create(value: T | (() => T))", () =>
        {
            test("with undefined", () =>
            {
                const result: Result<undefined> = Result.create(undefined);
                assert.strictEqual(result.await(), undefined);
            });

            test("with null", () =>
            {
                const result: Result<null> = Result.create(null);
                assert.strictEqual(result.await(), null);
            });

            test("with string", () =>
            {
                const value: string = "hello";
                const result: Result<string> = Result.create(value);
                assert.strictEqual(result.await(), value);
            });

            test("with number", () =>
            {
                const value: number = 51234;
                const result: Result<number> = Result.create(value);
                assert.strictEqual(result.await(), value);
            });

            test("with function that doesn't return a value", () =>
            {
                const result: Result<void> = Result.create(() => {});
                assert.strictEqual(result.await(), undefined);
            });

            test("with function that returns undefined", () =>
            {
                const result: Result<undefined> = Result.create(() => undefined);
                assert.strictEqual(result.await(), undefined);
            });

            test("with function that returns null", () =>
            {
                const result: Result<null> = Result.create(() => null);
                assert.strictEqual(result.await(), null);
            });

            test("with function that returns a string", () =>
            {
                const result: Result<string> = Result.create(() => "there");
                assert.strictEqual(result.await(), "there");
            });

            test("with function that throws an Error", () =>
            {
                const result: Result<never> = Result.create(() => { throw new Error("oops!"); });
                assert.throws(() => result.await(), new Error("oops!"));
            });
        });

        suite("error(unknown)", () =>
        {
            test("with undefined", () =>
            {
                assert.throws(
                    () => Result.error(undefined),
                    new PreConditionError(
                        "Expression: error",
                        "Expected: not undefined and not null",
                        "Actual: undefined",
                    ));
            });

            test("with null", () =>
            {
                assert.throws(
                    () => Result.error(null),
                    new PreConditionError(
                        "Expression: error",
                        "Expected: not undefined and not null",
                        "Actual: null",
                    ));
            });

            test("with Error", () =>
            {
                const result: Result<number> = Result.error(new Error("Hello"));
                assert.throws(() => result.await(), new Error("Hello"));
            });
        });

        suite("then<U>((() => U) | ((T) => U))", () =>
        {
            test("with error parent", () =>
            {
                const parentResult: Result<number> = Result.error(new Error("abc"));
                const thenResult: Result<string> = parentResult.then(() => "hello");
                assert.throws(() => thenResult.await(), new Error("abc"));
            });

            test("with error parent and thenFunction with side-effects", () =>
            {
                const parentResult: Result<number> = Result.error(new Error("abc"));
                let counter: number = 0;
                const thenResult: Result<string> = parentResult.then(() => { counter++; return "hello"; });
                assert.strictEqual(0, counter);
                assert.throws(() => thenResult.await(), new Error("abc"));
                assert.strictEqual(0, counter);
            });

            test("with successful parent and successful thenFunction that ignores parentResult value", () =>
            {
                const parentResult: Result<number> = Result.create(1);
                const thenResult: Result<string> = parentResult.then(() => "hello");
                assert.strictEqual("hello", thenResult.await());
            });

            test("with successful parent and successful thenFunction that uses parentResult value", () =>
            {
                const parentResult: Result<number> = Result.create(1);
                const thenResult: Result<string> = parentResult.then((argument: number) => (argument + 1).toString());
                assert.strictEqual("2", thenResult.await());
            });

            test("with successful parent and successful thenFunction that uses parentResult value with side-effects", () =>
            {
                const parentResult: Result<number> = Result.create(1);
                let counter: number = 0;
                const thenResult: Result<string> = parentResult.then((argument: number) => { counter++; return (argument + 1).toString(); });
                assert.strictEqual(1, counter);
                assert.strictEqual("2", thenResult.await());
                assert.strictEqual(1, counter);
            });
        });
    });
});