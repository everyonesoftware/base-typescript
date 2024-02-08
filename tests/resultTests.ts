import * as assert from "assert";

import { PreConditionError, Result } from "../sources";

suite("result.ts", () =>
{
    suite("Result<T>", () =>
    {
        suite("create((() => T))", () =>
        {
            test("with undefined", () =>
            {
                assert.throws(() => Result.create(undefined!),
                    new PreConditionError(
                        "Expression: createFunction",
                        "Expected: not undefined and not null",
                        "Actual: undefined"));
            });

            test("with null", () =>
            {
                assert.throws(() => Result.create(null!),
                    new PreConditionError(
                        "Expression: createFunction",
                        "Expected: not undefined and not null",
                        "Actual: null"));
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

            test("with function that returns an Error", () =>
            {
                const result: Result<Error> = Result.create(() => { return new Error("oops!"); });
                assert.deepStrictEqual(result.await(), new Error("oops!"));
            });
        });

        suite("value(value: T)", () =>
        {
            test("with undefined", () =>
            {
                const result: Result<undefined> = Result.value(undefined);
                assert.strictEqual(result.await(), undefined);
            });

            test("with null", () =>
            {
                const result: Result<null> = Result.value(null);
                assert.strictEqual(result.await(), null);
            });

            test("with string", () =>
            {
                const value: string = "hello";
                const result: Result<string> = Result.value(value);
                assert.strictEqual(result.await(), value);
            });

            test("with number", () =>
            {
                const value: number = 51234;
                const result: Result<number> = Result.value(value);
                assert.strictEqual(result.await(), value);
            });

            test("with function that doesn't return a value", () =>
            {
                const result: Result<() => void> = Result.value(() => {});
                assert.strictEqual(result.await()(), undefined);
            });

            test("with function that returns undefined", () =>
            {
                const result: Result<() => undefined> = Result.value(() => undefined);
                assert.strictEqual(result.await()(), undefined);
            });

            test("with function that returns null", () =>
            {
                const result: Result<() => null> = Result.value(() => null);
                assert.strictEqual(result.await()(), null);
            });

            test("with function that returns a string", () =>
            {
                const result: Result<() => string> = Result.value(() => "there");
                assert.strictEqual(result.await()(), "there");
            });

            test("with function that throws an Error", () =>
            {
                const result: Result<() => Error> = Result.value(() => { throw new Error("oops!"); });
                assert.throws(() => result.await()(),
                    new Error("oops!"));
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
                const parentResult: Result<number> = Result.value(1);
                const thenResult: Result<string> = parentResult.then(() => "hello");
                assert.strictEqual("hello", thenResult.await());
            });

            test("with successful parent and successful thenFunction that uses parentResult value", () =>
            {
                const parentResult: Result<number> = Result.value(1);
                const thenResult: Result<string> = parentResult.then((argument: number) => (argument + 1).toString());
                assert.strictEqual("2", thenResult.await());
            });

            test("with successful parent and successful thenFunction that uses parentResult value with side-effects", () =>
            {
                const parentResult: Result<number> = Result.value(1);
                let counter: number = 0;
                const thenResult: Result<string> = parentResult.then((argument: number) => { counter++; return (argument + 1).toString(); });
                assert.strictEqual(1, counter);
                assert.strictEqual("2", thenResult.await());
                assert.strictEqual(1, counter);
            });

            test("with successful parent and thenFunction that throws", () =>
            {
                const parentResult: Result<number> = Result.value(10);
                let counter: number = 0;
                const thenResult: Result<string> = parentResult.then((argument: number) =>
                {
                    counter++;
                    throw new Error(`arg: ${argument}`);
                });
                assert.strictEqual(counter, 1);

                for (let i = 0; i < 3; i++)
                {
                    assert.throws(() => thenResult.await(),
                        new Error("arg: 10"));
                    assert.strictEqual(counter, 1);
                }
            });
        });

        suite("onValue((() => void) | ((T) => void))", () =>
        {
            test("with error parent", () =>
            {
                const parentResult: Result<number> = Result.error(new Error("abc"));
                let counter: number = 0;
                const onValueResult: Result<number> = parentResult.onValue(() => counter++);
                assert.strictEqual(counter, 0);
                for (let i = 0; i < 3; i++)
                {
                    assert.throws(() => onValueResult.await(), new Error("abc"));
                    assert.strictEqual(counter, 0);
                }
            });

            test("with successful parent and successful thenFunction that ignores parentResult value", () =>
            {
                const parentResult: Result<number> = Result.value(10);
                let counter: number = 0;
                const onValueResult: Result<number> = parentResult.onValue(() => counter++);
                assert.strictEqual(counter, 1);
                for (let i = 0; i < 3; i++)
                {
                    assert.strictEqual(10, onValueResult.await());
                    assert.strictEqual(counter, 1);
                }
            });

            test("with successful parent and successful thenFunction that uses parentResult value", () =>
            {
                const parentResult: Result<number> = Result.value(2);
                let counter: number = 0;
                const onValueResult: Result<number> = parentResult.onValue((argument: number) => counter += argument);
                assert.strictEqual(counter, 2);
                for (let i = 0; i < 3; i++)
                {
                    assert.strictEqual(onValueResult.await(), 2);
                    assert.strictEqual(counter, 2);
                }
            });

            test("with successful parent and onValueFunction that throws", () =>
            {
                const parentResult: Result<number> = Result.value(2);
                let counter: number = 0;
                const onValueResult: Result<number> = parentResult.onValue((argument: number) =>
                {
                    counter += argument;
                    throw new Error(`argument: ${argument}`);
                });
                assert.strictEqual(counter, 2);
                for (let i = 0; i < 3; i++)
                {
                    assert.throws(() => onValueResult.await(),
                        new Error("argument: 2"));
                    assert.strictEqual(counter, 2);
                }
            });
        });

        suite("catch<TError>(Type<TError>,(() => T) | ((TError) => T))", () =>
        {
            test("with undefined errorType", () =>
            {
                const parentResult: Result<number> = Result.value(5);
                assert.throws(() => parentResult.catch(undefined!, () => 6),
                    new PreConditionError(
                        "Expression: errorType",
                        "Expected: not undefined and not null",
                        "Actual: undefined"));
            });

            test("with null errorType", () =>
            {
                const parentResult: Result<number> = Result.value(5);
                assert.throws(() => parentResult.catch(null!, () => 6),
                    new PreConditionError(
                        "Expression: errorType",
                        "Expected: not undefined and not null",
                        "Actual: null"));
            });

            test("with error parent", () =>
            {
                const parentResult: Result<number> = Result.error(new Error("abc"));
                const catchResult: Result<number> = parentResult.catch(Error, () => 20);
                assert.strictEqual(catchResult.await(), 20);
            });

            test("with error parent, no errorType, and no error parameter", () =>
            {
                const parentResult: Result<number> = Result.error(new Error("abc"));
                let counter: number = 0;
                const catchResult: Result<number> = parentResult.catch(() => { counter++; return 21; });
                assert.strictEqual(1, counter);
                for (let i = 0; i < 3; i++)
                {
                    assert.strictEqual(catchResult.await(), 21);
                    assert.strictEqual(1, counter);
                }
            });

            test("with error parent, no errorType, and unknown error parameter", () =>
            {
                const parentResult: Result<number> = Result.error(new Error("abc"));
                let counter: number = 0;
                const catchResult: Result<number> = parentResult.catch((error: unknown) =>
                {
                    if (error instanceof Error)
                    {
                        counter += error.message.length;
                    }
                    else
                    {
                        counter -= 1;
                    }
                    return 21;
                });
                assert.strictEqual(3, counter);
                for (let i = 0; i < 3; i++)
                {
                    assert.strictEqual(catchResult.await(), 21);
                    assert.strictEqual(3, counter);
                }
            });

            test("with error parent and catchFunction with side-effects", () =>
            {
                const parentResult: Result<number> = Result.error(new Error("abc"));
                let counter: number = 0;
                const catchResult: Result<number> = parentResult.catch(Error, () => { counter++; return 21; });
                assert.strictEqual(1, counter);
                for (let i = 0; i < 3; i++)
                {
                    assert.strictEqual(catchResult.await(), 21);
                    assert.strictEqual(1, counter);
                }
            });

            test("with errorType that is a super-type of the actual error without error parameter", () =>
            {
                const parentResult: Result<number> = Result.error(new PreConditionError("abc"));
                const catchResult: Result<number> = parentResult.catch(Error, () => 5);
                assert.strictEqual(catchResult.await(), 5);
            });

            test("with errorType that is a super-type of the actual error with error parameter", () =>
            {
                const parentResult: Result<number> = Result.error(new PreConditionError("abc"));
                const catchResult: Result<number> = parentResult.catch(Error, (error: Error) => error.message.length);
                assert.strictEqual(catchResult.await(), 3);
            });

            test("with errorType that is a sub-type of the actual error", () =>
            {
                const parentResult: Result<number> = Result.error(new Error("abc"));
                const catchResult: Result<number> = parentResult.catch(PreConditionError, () => 20);
                assert.throws(() => catchResult.await(),
                    new Error("abc"));
            });

            test("with errorType that is unrelated to the actual error", () =>
            {
                const parentResult: Result<number> = Result.error(new PreConditionError("def"));
                const catchResult: Result<number> = parentResult.catch(RangeError, () => 20);
                assert.throws(() => catchResult.await(),
                    new PreConditionError("def"));
            });

            test("with catchFunction that throws", () =>
            {
                const parentResult: Result<number> = Result.error(new PreConditionError("def"));
                const catchResult: Result<number> = parentResult.catch(Error, () => { throw new TypeError("abc"); });
                assert.throws(() => catchResult.await(),
                    new TypeError("abc"));
            });

            test("with successful parent", () =>
            {
                const parentResult: Result<number> = Result.value(1);
                const catchResult: Result<number> = parentResult.catch(Error, () => 2);
                assert.strictEqual(catchResult.await(), 1);
            });
        });

        suite("onError<TError>(Type<TError>,(() => void) | ((TError) => void))", () =>
        {
            test("with undefined errorType", () =>
            {
                const parentResult: Result<number> = Result.value(5);
                assert.throws(() => parentResult.onError(undefined!, () => 6),
                    new PreConditionError(
                        "Expression: errorType",
                        "Expected: not undefined and not null",
                        "Actual: undefined"));
            });

            test("with null errorType", () =>
            {
                const parentResult: Result<number> = Result.value(5);
                assert.throws(() => parentResult.onError(null!, () => 6),
                    new PreConditionError(
                        "Expression: errorType",
                        "Expected: not undefined and not null",
                        "Actual: null"));
            });

            test("with error parent, no errorType, and no error parameter", () =>
            {
                const parentResult: Result<number> = Result.error(new Error("abc"));
                let counter: number = 0;
                const catchResult: Result<number> = parentResult.onError(() => { counter++; });
                assert.strictEqual(1, counter);
                for (let i = 0; i < 3; i++)
                {
                    assert.throws(() => catchResult.await(),
                        new Error("abc"));
                    assert.strictEqual(1, counter);
                }
            });

            test("with error parent, no errorType, and unknown error parameter", () =>
            {
                const parentResult: Result<number> = Result.error(new Error("abc"));
                let counter: number = 0;
                const catchResult: Result<number> = parentResult.onError((error: unknown) =>
                {
                    if (error instanceof Error)
                    {
                        counter += error.message.length;
                    }
                    else
                    {
                        counter -= 1;
                    }
                    return 21;
                });
                assert.strictEqual(3, counter);
                for (let i = 0; i < 3; i++)
                {
                    assert.throws(() => catchResult.await(),
                        new Error("abc"));
                    assert.strictEqual(3, counter);
                }
            });

            test("with errorType that is a super-type of the actual error without error parameter", () =>
            {
                const parentResult: Result<number> = Result.error(new PreConditionError("abc"));
                let counter: number = 0;
                const catchResult: Result<number> = parentResult.onError(Error, () => counter++);
                assert.strictEqual(counter, 1);
                for (let i = 0; i < 3; i++)
                {
                    assert.throws(() => catchResult.await(),
                        new PreConditionError("abc"));
                    assert.strictEqual(counter, 1);
                }
            });

            test("with errorType that is a super-type of the actual error with error parameter", () =>
            {
                const parentResult: Result<number> = Result.error(new PreConditionError("abc"));
                let counter: number = 0;
                const catchResult: Result<number> = parentResult.onError(Error, (error: Error) => counter += error.message.length);
                assert.strictEqual(counter, 3);
                for (let i = 0; i < 3; i++)
                {
                    assert.throws(() => catchResult.await(), 
                        new PreConditionError("abc"));
                    assert.strictEqual(counter, 3);
                }
            });

            test("with errorType that is a sub-type of the actual error", () =>
            {
                const parentResult: Result<number> = Result.error(new Error("abc"));
                let counter: number = 0;
                const catchResult: Result<number> = parentResult.onError(PreConditionError, () => counter++);
                assert.strictEqual(counter, 0);
                for (let i = 0; i < 3; i++)
                {
                    assert.throws(() => catchResult.await(),
                        new Error("abc"));
                    assert.strictEqual(counter, 0);
                }
            });

            test("with errorType that is unrelated to the actual error", () =>
            {
                const parentResult: Result<number> = Result.error(new PreConditionError("def"));
                let counter: number = 0;
                const catchResult: Result<number> = parentResult.onError(RangeError, () => counter++);
                assert.strictEqual(counter, 0);
                for (let i = 0; i < 3; i++)
                {
                    assert.throws(() => catchResult.await(),
                        new PreConditionError("def"));
                    assert.strictEqual(counter, 0);
                }
            });

            test("with onErrorFunction that throws", () =>
            {
                const parentResult: Result<number> = Result.error(new PreConditionError("def"));
                let counter: number = 0;
                const catchResult: Result<number> = parentResult.onError(Error, () => { counter++; throw new Error("abc"); });
                assert.strictEqual(counter, 1);
                for (let i = 0; i < 3; i++)
                {
                    assert.throws(() => catchResult.await(),
                        new Error("abc"));
                    assert.strictEqual(counter, 1);
                }
            });

            test("with successful parent", () =>
            {
                const parentResult: Result<number> = Result.value(1);
                let counter: number = 0;
                const catchResult: Result<number> = parentResult.onError(Error, () => counter++);
                assert.strictEqual(counter, 0);
                for (let i = 0; i < 3; i++)
                {
                    assert.strictEqual(catchResult.await(), 1);
                    assert.strictEqual(counter, 0);
                }
            });
        });

        suite("convertError<TError>((() => unknown))", () =>
        {
            test("with undefined convertErrorFunction", () =>
            {
                const parentResult: Result<number> = Result.value(5);
                assert.throws(() => parentResult.convertError(undefined!),
                    new PreConditionError(
                        "Expression: convertErrorFunction",
                        "Expected: not undefined and not null",
                        "Actual: undefined"));
            });

            test("with null convertErrorFunction", () =>
            {
                const parentResult: Result<number> = Result.value(5);
                assert.throws(() => parentResult.convertError(null!),
                    new PreConditionError(
                        "Expression: convertErrorFunction",
                        "Expected: not undefined and not null",
                        "Actual: null"));
            });

            test("with successful parent", () =>
            {
                const parentResult: Result<number> = Result.value(5);
                let counter: number = 0;
                const convertErrorResult: Result<number> = parentResult.convertError(() =>
                {
                    counter++;
                    return new Error("abc");
                });
                assert.strictEqual(counter, 0);
                for (let i = 0; i < 3; i++)
                {
                    assert.strictEqual(convertErrorResult.await(), 5);
                    assert.strictEqual(counter, 0);
                }
            });

            test("with error parent and non-throwing convertErrorFunction", () =>
            {
                const parentResult: Result<number> = Result.error(new Error("abc"));
                let counter: number = 0;
                const convertErrorResult: Result<number> = parentResult.convertError(() =>
                {
                    counter++;
                    return new Error("def");
                });
                assert.strictEqual(counter, 1);
                for (let i = 0; i < 3; i++)
                {
                    assert.throws(() => convertErrorResult.await(),
                        new Error("def"));
                    assert.strictEqual(counter, 1);
                }
            });

            test("with error parent and throwing convertErrorFunction", () =>
            {
                const parentResult: Result<number> = Result.error(new Error("abc"));
                let counter: number = 0;
                const convertErrorResult: Result<number> = parentResult.convertError(() =>
                {
                    counter++;
                    throw new Error("def");
                });
                assert.strictEqual(counter, 1);
                for (let i = 0; i < 3; i++)
                {
                    assert.throws(() => convertErrorResult.await(),
                        new Error("def"));
                    assert.strictEqual(counter, 1);
                }
            });
        });

        suite("convertError<TError>(((unknown) => unknown))", () =>
        {
            test("with undefined convertErrorFunction", () =>
            {
                const parentResult: Result<number> = Result.value(5);
                assert.throws(() => parentResult.convertError(undefined!),
                    new PreConditionError(
                        "Expression: convertErrorFunction",
                        "Expected: not undefined and not null",
                        "Actual: undefined"));
            });

            test("with null convertErrorFunction", () =>
            {
                const parentResult: Result<number> = Result.value(5);
                assert.throws(() => parentResult.convertError(null!),
                    new PreConditionError(
                        "Expression: convertErrorFunction",
                        "Expected: not undefined and not null",
                        "Actual: null"));
            });

            test("with successful parent", () =>
            {
                const parentResult: Result<number> = Result.value(5);
                let counter: number = 0;
                const convertErrorResult: Result<number> = parentResult.convertError((error: unknown) =>
                {
                    counter++;
                    return new Error(`${error} - abc`);
                });
                assert.strictEqual(counter, 0);
                for (let i = 0; i < 3; i++)
                {
                    assert.strictEqual(convertErrorResult.await(), 5);
                    assert.strictEqual(counter, 0);
                }
            });

            test("with error parent and non-throwing convertErrorFunction", () =>
            {
                const parentResult: Result<number> = Result.error(new Error("abc"));
                let counter: number = 0;
                const convertErrorResult: Result<number> = parentResult.convertError((error: unknown) =>
                {
                    counter++;
                    return new Error(`${error} - def`);
                });
                assert.strictEqual(counter, 1);
                for (let i = 0; i < 3; i++)
                {
                    assert.throws(() => convertErrorResult.await(),
                        new Error("Error: abc - def"));
                    assert.strictEqual(counter, 1);
                }
            });

            test("with error parent and throwing convertErrorFunction", () =>
            {
                const parentResult: Result<number> = Result.error(new Error("abc"));
                let counter: number = 0;
                const convertErrorResult: Result<number> = parentResult.convertError((error: unknown) =>
                {
                    counter++;
                    throw new Error(`${error} - def`);
                });
                assert.strictEqual(counter, 1);
                for (let i = 0; i < 3; i++)
                {
                    assert.throws(() => convertErrorResult.await(),
                        new Error("Error: abc - def"));
                    assert.strictEqual(counter, 1);
                }
            });
        });

        suite("convertError<TError>(Type<TError>,(() => unknown))", () =>
        {
            test("with successful parent", () =>
            {
                const parentResult: Result<number> = Result.value(5);
                let counter: number = 0;
                const convertErrorResult: Result<number> = parentResult.convertError(Error, () =>
                {
                    counter++;
                    return new Error("abc");
                });
                assert.strictEqual(counter, 0);
                for (let i = 0; i < 3; i++)
                {
                    assert.strictEqual(convertErrorResult.await(), 5);
                    assert.strictEqual(counter, 0);
                }
            });

            test("with error parent, exact error match, and non-throwing convertErrorFunction", () =>
            {
                const parentResult: Result<number> = Result.error(new Error("abc"));
                let counter: number = 0;
                const convertErrorResult: Result<number> = parentResult.convertError(Error, () =>
                {
                    counter++;
                    return new Error("def");
                });
                assert.strictEqual(counter, 1);
                for (let i = 0; i < 3; i++)
                {
                    assert.throws(() => convertErrorResult.await(),
                        new Error("def"));
                    assert.strictEqual(counter, 1);
                }
            });

            test("with error parent, super error match, and non-throwing convertErrorFunction", () =>
            {
                const parentResult: Result<number> = Result.error(new PreConditionError("abc"));
                let counter: number = 0;
                const convertErrorResult: Result<number> = parentResult.convertError(Error, () =>
                {
                    counter++;
                    return new Error("def");
                });
                assert.strictEqual(counter, 1);
                for (let i = 0; i < 3; i++)
                {
                    assert.throws(() => convertErrorResult.await(),
                        new Error("def"));
                    assert.strictEqual(counter, 1);
                }
            });

            test("with error parent, no error match, and non-throwing convertErrorFunction", () =>
            {
                const parentResult: Result<number> = Result.error(new PreConditionError("abc"));
                let counter: number = 0;
                const convertErrorResult: Result<number> = parentResult.convertError(TypeError, () =>
                {
                    counter++;
                    return new Error("def");
                });
                assert.strictEqual(counter, 0);
                for (let i = 0; i < 3; i++)
                {
                    assert.throws(() => convertErrorResult.await(),
                        new PreConditionError("abc"));
                    assert.strictEqual(counter, 0);
                }
            });

            test("with error parent, exact error match, and throwing convertErrorFunction", () =>
            {
                const parentResult: Result<number> = Result.error(new Error("abc"));
                let counter: number = 0;
                const convertErrorResult: Result<number> = parentResult.convertError(Error, () =>
                {
                    counter++;
                    throw new Error("def");
                });
                assert.strictEqual(counter, 1);
                for (let i = 0; i < 3; i++)
                {
                    assert.throws(() => convertErrorResult.await(),
                        new Error("def"));
                    assert.strictEqual(counter, 1);
                }
            });

            test("with error parent, super error match, and throwing convertErrorFunction", () =>
            {
                const parentResult: Result<number> = Result.error(new TypeError("abc"));
                let counter: number = 0;
                const convertErrorResult: Result<number> = parentResult.convertError(Error, () =>
                {
                    counter++;
                    throw new Error("def");
                });
                assert.strictEqual(counter, 1);
                for (let i = 0; i < 3; i++)
                {
                    assert.throws(() => convertErrorResult.await(),
                        new Error("def"));
                    assert.strictEqual(counter, 1);
                }
            });

            test("with error parent, no error match, and throwing convertErrorFunction", () =>
            {
                const parentResult: Result<number> = Result.error(new TypeError("abc"));
                let counter: number = 0;
                const convertErrorResult: Result<number> = parentResult.convertError(PreConditionError, () =>
                {
                    counter++;
                    throw new Error("def");
                });
                assert.strictEqual(counter, 0);
                for (let i = 0; i < 3; i++)
                {
                    assert.throws(() => convertErrorResult.await(),
                        new TypeError("abc"));
                    assert.strictEqual(counter, 0);
                }
            });
        });

        suite("convertError<TError>(Type<TError>,((TError) => unknown))", () =>
        {
            test("with successful parent", () =>
            {
                const parentResult: Result<number> = Result.value(5);
                let counter: number = 0;
                const convertErrorResult: Result<number> = parentResult.convertError(Error, (error: Error) =>
                {
                    counter++;
                    return new Error(`${error} - abc`);
                });
                assert.strictEqual(counter, 0);
                for (let i = 0; i < 3; i++)
                {
                    assert.strictEqual(convertErrorResult.await(), 5);
                    assert.strictEqual(counter, 0);
                }
            });

            test("with error parent, exact error match, and non-throwing convertErrorFunction", () =>
            {
                const parentResult: Result<number> = Result.error(new Error("abc"));
                let counter: number = 0;
                const convertErrorResult: Result<number> = parentResult.convertError(Error, (error: Error) =>
                {
                    counter++;
                    return new Error(`${error} - def`);
                });
                assert.strictEqual(counter, 1);
                for (let i = 0; i < 3; i++)
                {
                    assert.throws(() => convertErrorResult.await(),
                        new Error("Error: abc - def"));
                    assert.strictEqual(counter, 1);
                }
            });

            test("with error parent, super error match, and non-throwing convertErrorFunction", () =>
            {
                const parentResult: Result<number> = Result.error(new PreConditionError("abc"));
                let counter: number = 0;
                const convertErrorResult: Result<number> = parentResult.convertError(Error, (error: Error) =>
                {
                    counter++;
                    return new Error(`${error} - def`);
                });
                assert.strictEqual(counter, 1);
                for (let i = 0; i < 3; i++)
                {
                    assert.throws(() => convertErrorResult.await(),
                        new Error("Error: abc - def"));
                    assert.strictEqual(counter, 1);
                }
            });

            test("with error parent, no error match, and non-throwing convertErrorFunction", () =>
            {
                const parentResult: Result<number> = Result.error(new PreConditionError("abc"));
                let counter: number = 0;
                const convertErrorResult: Result<number> = parentResult.convertError(TypeError, (error: TypeError) =>
                {
                    counter++;
                    return new Error(`${error} - def`);
                });
                assert.strictEqual(counter, 0);
                for (let i = 0; i < 3; i++)
                {
                    assert.throws(() => convertErrorResult.await(),
                        new PreConditionError("abc"));
                    assert.strictEqual(counter, 0);
                }
            });

            test("with error parent, exact error match, and throwing convertErrorFunction", () =>
            {
                const parentResult: Result<number> = Result.error(new Error("abc"));
                let counter: number = 0;
                const convertErrorResult: Result<number> = parentResult.convertError(Error, (error: Error) =>
                {
                    counter++;
                    throw new Error(`${error} - def`);
                });
                assert.strictEqual(counter, 1);
                for (let i = 0; i < 3; i++)
                {
                    assert.throws(() => convertErrorResult.await(),
                        new Error("Error: abc - def"));
                    assert.strictEqual(counter, 1);
                }
            });

            test("with error parent, super error match, and throwing convertErrorFunction", () =>
            {
                const parentResult: Result<number> = Result.error(new TypeError("abc"));
                let counter: number = 0;
                const convertErrorResult: Result<number> = parentResult.convertError(Error, (error: Error) =>
                {
                    counter++;
                    throw new Error(`${error} - def`);
                });
                assert.strictEqual(counter, 1);
                for (let i = 0; i < 3; i++)
                {
                    assert.throws(() => convertErrorResult.await(),
                        new Error("TypeError: abc - def"));
                    assert.strictEqual(counter, 1);
                }
            });

            test("with error parent, no error match, and throwing convertErrorFunction", () =>
            {
                const parentResult: Result<number> = Result.error(new TypeError("abc"));
                let counter: number = 0;
                const convertErrorResult: Result<number> = parentResult.convertError(PreConditionError, (error: PreConditionError) =>
                {
                    counter++;
                    throw new Error(`${error} - def`);
                });
                assert.strictEqual(counter, 0);
                for (let i = 0; i < 3; i++)
                {
                    assert.throws(() => convertErrorResult.await(),
                        new TypeError("abc"));
                    assert.strictEqual(counter, 0);
                }
            });
        });
    });
});