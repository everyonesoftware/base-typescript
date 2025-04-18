import { Test, TestRunner } from "@everyonesoftware/test-typescript";
import { PreConditionError, Result } from "../sources";
import { createTestRunner } from "./tests";

export function test(runner: TestRunner): void
{
    runner.testFile("result.ts", () =>
    {
        runner.testType("Result<T>", () =>
        {
            runner.testFunction("create((() => T))", () =>
            {
                runner.test("with undefined", (test: Test) =>
                {
                    test.assertThrows(() => Result.create(undefined!),
                        new PreConditionError(
                            "Expression: createFunction",
                            "Expected: not undefined and not null",
                            "Actual: undefined"));
                });

                runner.test("with null", (test: Test) =>
                {
                    test.assertThrows(() => Result.create(null!),
                        new PreConditionError(
                            "Expression: createFunction",
                            "Expected: not undefined and not null",
                            "Actual: null"));
                });

                runner.test("with function that doesn't return a value", (test: Test) =>
                {
                    const result: Result<void> = Result.create(() => {});
                    test.assertUndefined(result.await());
                });

                runner.test("with function that returns undefined", (test: Test) =>
                {
                    const result: Result<undefined> = Result.create(() => undefined);
                    const awaitResult: undefined = result.await();
                    test.assertUndefined(awaitResult);
                });

                runner.test("with function that returns null", (test: Test) =>
                {
                    const result: Result<null> = Result.create(() => null);
                    const awaitResult: null = result.await();
                    test.assertNull(awaitResult);
                });

                runner.test("with function that returns a string", (test: Test) =>
                {
                    const result: Result<string> = Result.create(() => "there");
                    const awaitResult: string = result.await();
                    test.assertEqual(awaitResult, "there");
                });

                runner.test("with function that throws an Error", (test: Test) =>
                {
                    const result: Result<never> = Result.create(() => { throw new Error("oops!"); });
                    test.assertThrows(() => result.await(), new Error("oops!"));
                });

                runner.test("with function that returns an Error", (test: Test) =>
                {
                    const result: Result<Error> = Result.create(() => { return new Error("oops!"); });
                    test.assertEqual(result.await(), new Error("oops!"));
                });
            });

            runner.testFunction("value(value: T)", () =>
            {
                runner.test("with undefined", (test: Test) =>
                {
                    const result: Result<undefined> = Result.value(undefined);
                    const awaitResult: undefined = result.await();
                    test.assertUndefined(awaitResult);
                });

                runner.test("with null", (test: Test) =>
                {
                    const result: Result<null> = Result.value(null);
                    const awaitResult: null = result.await();
                    test.assertNull(awaitResult);
                });

                runner.test("with string", (test: Test) =>
                {
                    const value: string = "hello";
                    const result: Result<string> = Result.value(value);
                    test.assertSame(result.await(), value);
                });

                runner.test("with number", (test: Test) =>
                {
                    const value: number = 51234;
                    const result: Result<number> = Result.value(value);
                    test.assertSame(result.await(), value);
                });

                runner.test("with function that doesn't return a value", (test: Test) =>
                {
                    const result: Result<() => void> = Result.value(() => {});
                    test.assertSame(result.await()(), undefined);
                });

                runner.test("with function that returns undefined", (test: Test) =>
                {
                    const result: Result<() => undefined> = Result.value(() => undefined);
                    test.assertSame(result.await()(), undefined);
                });

                runner.test("with function that returns null", (test: Test) =>
                {
                    const result: Result<() => null> = Result.value(() => null);
                    test.assertSame(result.await()(), null);
                });

                runner.test("with function that returns a string", (test: Test) =>
                {
                    const result: Result<() => string> = Result.value(() => "there");
                    test.assertSame(result.await()(), "there");
                });

                runner.test("with function that throws an Error", (test: Test) =>
                {
                    const result: Result<() => Error> = Result.value(() => { throw new Error("oops!"); });
                    test.assertThrows(() => result.await()(),
                        new Error("oops!"));
                });
            });

            runner.testFunction("error(unknown)", () =>
            {
                runner.test("with undefined", (test: Test) =>
                {
                    test.assertThrows(
                        () => Result.error(undefined),
                        new PreConditionError(
                            "Expression: error",
                            "Expected: not undefined and not null",
                            "Actual: undefined",
                        ));
                });

                runner.test("with null", (test: Test) =>
                {
                    test.assertThrows(
                        () => Result.error(null),
                        new PreConditionError(
                            "Expression: error",
                            "Expected: not undefined and not null",
                            "Actual: null",
                        ));
                });

                runner.test("with Error", (test: Test) =>
                {
                    const result: Result<number> = Result.error(new Error("Hello"));
                    test.assertThrows(() => result.await(), new Error("Hello"));
                });
            });

            runner.testFunction("then<U>((() => U) | ((T) => U))", () =>
            {
                runner.test("with error parent", (test: Test) =>
                {
                    const parentResult: Result<number> = Result.error(new Error("abc"));
                    const thenResult: Result<string> = parentResult.then(() => "hello");
                    test.assertThrows(() => thenResult.await(), new Error("abc"));
                });

                runner.test("with error parent and thenFunction with side-effects", (test: Test) =>
                {
                    const parentResult: Result<number> = Result.error(new Error("abc"));
                    let counter: number = 0;
                    const thenResult: Result<string> = parentResult.then(() => { counter++; return "hello"; });
                    test.assertEqual(0, counter);
                    test.assertThrows(() => thenResult.await(), new Error("abc"));
                    test.assertEqual(0, counter);
                });

                runner.test("with successful parent and successful thenFunction that ignores parentResult value", (test: Test) =>
                {
                    const parentResult: Result<number> = Result.value(1);
                    const thenResult: Result<string> = parentResult.then(() => "hello");
                    test.assertEqual("hello", thenResult.await());
                });

                runner.test("with successful parent and successful thenFunction that uses parentResult value", (test: Test) =>
                {
                    const parentResult: Result<number> = Result.value(1);
                    const thenResult: Result<string> = parentResult.then((argument: number) => (argument + 1).toString());
                    test.assertEqual("2", thenResult.await());
                });

                runner.test("with successful parent and successful thenFunction that uses parentResult value with side-effects", (test: Test) =>
                {
                    const parentResult: Result<number> = Result.value(1);
                    let counter: number = 0;
                    const thenResult: Result<string> = parentResult.then((argument: number) => { counter++; return (argument + 1).toString(); });
                    test.assertEqual(1, counter);
                    test.assertEqual("2", thenResult.await());
                    test.assertEqual(1, counter);
                });

                runner.test("with successful parent and thenFunction that throws", (test: Test) =>
                {
                    const parentResult: Result<number> = Result.value(10);
                    let counter: number = 0;
                    const thenResult: Result<string> = parentResult.then((argument: number) =>
                    {
                        counter++;
                        throw new Error(`arg: ${argument}`);
                    });
                    test.assertEqual(counter, 1);

                    for (let i = 0; i < 3; i++)
                    {
                        test.assertThrows(() => thenResult.await(),
                            new Error("arg: 10"));
                        test.assertEqual(counter, 1);
                    }
                });
            });

            runner.testFunction("onValue((() => void) | ((T) => void))", () =>
            {
                runner.test("with error parent", (test: Test) =>
                {
                    const parentResult: Result<number> = Result.error(new Error("abc"));
                    let counter: number = 0;
                    const onValueResult: Result<number> = parentResult.onValue(() => counter++);
                    test.assertEqual(counter, 0);
                    for (let i = 0; i < 3; i++)
                    {
                        test.assertThrows(() => onValueResult.await(), new Error("abc"));
                        test.assertEqual(counter, 0);
                    }
                });

                runner.test("with successful parent and successful thenFunction that ignores parentResult value", (test: Test) =>
                {
                    const parentResult: Result<number> = Result.value(10);
                    let counter: number = 0;
                    const onValueResult: Result<number> = parentResult.onValue(() => counter++);
                    test.assertEqual(counter, 1);
                    for (let i = 0; i < 3; i++)
                    {
                        test.assertEqual(10, onValueResult.await());
                        test.assertEqual(counter, 1);
                    }
                });

                runner.test("with successful parent and successful thenFunction that uses parentResult value", (test: Test) =>
                {
                    const parentResult: Result<number> = Result.value(2);
                    let counter: number = 0;
                    const onValueResult: Result<number> = parentResult.onValue((argument: number) => counter += argument);
                    test.assertEqual(counter, 2);
                    for (let i = 0; i < 3; i++)
                    {
                        test.assertSame(onValueResult.await(), 2);
                        test.assertSame(counter, 2);
                    }
                });

                runner.test("with successful parent and onValueFunction that throws", (test: Test) =>
                {
                    const parentResult: Result<number> = Result.value(2);
                    let counter: number = 0;
                    const onValueResult: Result<number> = parentResult.onValue((argument: number) =>
                    {
                        counter += argument;
                        throw new Error(`argument: ${argument}`);
                    });
                    test.assertSame(counter, 2);
                    for (let i = 0; i < 3; i++)
                    {
                        test.assertThrows(() => onValueResult.await(),
                            new Error("argument: 2"));
                        test.assertSame(counter, 2);
                    }
                });
            });

            runner.testFunction("catch<TError>(Type<TError>,(() => T) | ((TError) => T))", () =>
            {
                runner.test("with undefined errorType", (test: Test) =>
                {
                    const parentResult: Result<number> = Result.value(5);
                    test.assertThrows(() => parentResult.catch(undefined!, () => 6),
                        new PreConditionError(
                            "Expression: errorType",
                            "Expected: not undefined and not null",
                            "Actual: undefined"));
                });

                runner.test("with null errorType", (test: Test) =>
                {
                    const parentResult: Result<number> = Result.value(5);
                    test.assertThrows(() => parentResult.catch(null!, () => 6),
                        new PreConditionError(
                            "Expression: errorType",
                            "Expected: not undefined and not null",
                            "Actual: null"));
                });

                runner.test("with error parent", (test: Test) =>
                {
                    const parentResult: Result<number> = Result.error(new Error("abc"));
                    const catchResult: Result<number> = parentResult.catch(Error, () => 20);
                    test.assertSame(catchResult.await(), 20);
                });

                runner.test("with error parent, no errorType, and no error parameter", (test: Test) =>
                {
                    const parentResult: Result<number> = Result.error(new Error("abc"));
                    let counter: number = 0;
                    const catchResult: Result<number> = parentResult.catch(() => { counter++; return 21; });
                    test.assertSame(1, counter);
                    for (let i = 0; i < 3; i++)
                    {
                        test.assertSame(catchResult.await(), 21);
                        test.assertSame(1, counter);
                    }
                });

                runner.test("with error parent, no errorType, and unknown error parameter", (test: Test) =>
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
                    test.assertSame(3, counter);
                    for (let i = 0; i < 3; i++)
                    {
                        test.assertSame(catchResult.await(), 21);
                        test.assertSame(3, counter);
                    }
                });

                runner.test("with error parent and catchFunction with side-effects", (test: Test) =>
                {
                    const parentResult: Result<number> = Result.error(new Error("abc"));
                    let counter: number = 0;
                    const catchResult: Result<number> = parentResult.catch(Error, () => { counter++; return 21; });
                    test.assertSame(1, counter);
                    for (let i = 0; i < 3; i++)
                    {
                        test.assertSame(catchResult.await(), 21);
                        test.assertSame(1, counter);
                    }
                });

                runner.test("with errorType that is a super-type of the actual error without error parameter", (test: Test) =>
                {
                    const parentResult: Result<number> = Result.error(new PreConditionError("abc"));
                    const catchResult: Result<number> = parentResult.catch(Error, () => 5);
                    test.assertSame(catchResult.await(), 5);
                });

                runner.test("with errorType that is a super-type of the actual error with error parameter", (test: Test) =>
                {
                    const parentResult: Result<number> = Result.error(new PreConditionError("abc"));
                    const catchResult: Result<number> = parentResult.catch(Error, (error: Error) => error.message.length);
                    test.assertSame(catchResult.await(), 3);
                });

                runner.test("with errorType that is a sub-type of the actual error", (test: Test) =>
                {
                    const parentResult: Result<number> = Result.error(new Error("abc"));
                    const catchResult: Result<number> = parentResult.catch(PreConditionError, () => 20);
                    test.assertThrows(() => catchResult.await(),
                        new Error("abc"));
                });

                runner.test("with errorType that is unrelated to the actual error", (test: Test) =>
                {
                    const parentResult: Result<number> = Result.error(new PreConditionError("def"));
                    const catchResult: Result<number> = parentResult.catch(RangeError, () => 20);
                    test.assertThrows(() => catchResult.await(),
                        new PreConditionError("def"));
                });

                runner.test("with catchFunction that throws", (test: Test) =>
                {
                    const parentResult: Result<number> = Result.error(new PreConditionError("def"));
                    const catchResult: Result<number> = parentResult.catch(Error, () => { throw new TypeError("abc"); });
                    test.assertThrows(() => catchResult.await(),
                        new TypeError("abc"));
                });

                runner.test("with successful parent", (test: Test) =>
                {
                    const parentResult: Result<number> = Result.value(1);
                    const catchResult: Result<number> = parentResult.catch(Error, () => 2);
                    test.assertSame(catchResult.await(), 1);
                });
            });

            runner.testFunction("onError<TError>(Type<TError>,(() => void) | ((TError) => void))", () =>
            {
                runner.test("with undefined errorType", (test: Test) =>
                {
                    const parentResult: Result<number> = Result.value(5);
                    test.assertThrows(() => parentResult.onError(undefined!, () => 6),
                        new PreConditionError(
                            "Expression: errorType",
                            "Expected: not undefined and not null",
                            "Actual: undefined"));
                });

                runner.test("with null errorType", (test: Test) =>
                {
                    const parentResult: Result<number> = Result.value(5);
                    test.assertThrows(() => parentResult.onError(null!, () => 6),
                        new PreConditionError(
                            "Expression: errorType",
                            "Expected: not undefined and not null",
                            "Actual: null"));
                });

                runner.test("with error parent, no errorType, and no error parameter", (test: Test) =>
                {
                    const parentResult: Result<number> = Result.error(new Error("abc"));
                    let counter: number = 0;
                    const catchResult: Result<number> = parentResult.onError(() => { counter++; });
                    test.assertSame(1, counter);
                    for (let i = 0; i < 3; i++)
                    {
                        test.assertThrows(() => catchResult.await(),
                            new Error("abc"));
                        test.assertSame(1, counter);
                    }
                });

                runner.test("with error parent, no errorType, and unknown error parameter", (test: Test) =>
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
                    test.assertSame(3, counter);
                    for (let i = 0; i < 3; i++)
                    {
                        test.assertThrows(() => catchResult.await(),
                            new Error("abc"));
                        test.assertSame(3, counter);
                    }
                });

                runner.test("with errorType that is a super-type of the actual error without error parameter", (test: Test) =>
                {
                    const parentResult: Result<number> = Result.error(new PreConditionError("abc"));
                    let counter: number = 0;
                    const catchResult: Result<number> = parentResult.onError(Error, () => counter++);
                    test.assertSame(counter, 1);
                    for (let i = 0; i < 3; i++)
                    {
                        test.assertThrows(() => catchResult.await(),
                            new PreConditionError("abc"));
                        test.assertSame(counter, 1);
                    }
                });

                runner.test("with errorType that is a super-type of the actual error with error parameter", (test: Test) =>
                {
                    const parentResult: Result<number> = Result.error(new PreConditionError("abc"));
                    let counter: number = 0;
                    const catchResult: Result<number> = parentResult.onError(Error, (error: Error) => counter += error.message.length);
                    test.assertSame(counter, 3);
                    for (let i = 0; i < 3; i++)
                    {
                        test.assertThrows(() => catchResult.await(), 
                            new PreConditionError("abc"));
                        test.assertSame(counter, 3);
                    }
                });

                runner.test("with errorType that is a sub-type of the actual error", (test: Test) =>
                {
                    const parentResult: Result<number> = Result.error(new Error("abc"));
                    let counter: number = 0;
                    const catchResult: Result<number> = parentResult.onError(PreConditionError, () => counter++);
                    test.assertSame(counter, 0);
                    for (let i = 0; i < 3; i++)
                    {
                        test.assertThrows(() => catchResult.await(),
                            new Error("abc"));
                        test.assertSame(counter, 0);
                    }
                });

                runner.test("with errorType that is unrelated to the actual error", (test: Test) =>
                {
                    const parentResult: Result<number> = Result.error(new PreConditionError("def"));
                    let counter: number = 0;
                    const catchResult: Result<number> = parentResult.onError(RangeError, () => counter++);
                    test.assertSame(counter, 0);
                    for (let i = 0; i < 3; i++)
                    {
                        test.assertThrows(() => catchResult.await(),
                            new PreConditionError("def"));
                        test.assertSame(counter, 0);
                    }
                });

                runner.test("with onErrorFunction that throws", (test: Test) =>
                {
                    const parentResult: Result<number> = Result.error(new PreConditionError("def"));
                    let counter: number = 0;
                    const catchResult: Result<number> = parentResult.onError(Error, () => { counter++; throw new Error("abc"); });
                    test.assertSame(counter, 1);
                    for (let i = 0; i < 3; i++)
                    {
                        test.assertThrows(() => catchResult.await(),
                            new Error("abc"));
                        test.assertSame(counter, 1);
                    }
                });

                runner.test("with successful parent", (test: Test) =>
                {
                    const parentResult: Result<number> = Result.value(1);
                    let counter: number = 0;
                    const catchResult: Result<number> = parentResult.onError(Error, () => counter++);
                    test.assertSame(counter, 0);
                    for (let i = 0; i < 3; i++)
                    {
                        test.assertSame(catchResult.await(), 1);
                        test.assertSame(counter, 0);
                    }
                });
            });

            runner.testFunction("convertError<TError>((() => unknown))", () =>
            {
                runner.test("with undefined convertErrorFunction", (test: Test) =>
                {
                    const parentResult: Result<number> = Result.value(5);
                    test.assertThrows(() => parentResult.convertError(undefined!),
                        new PreConditionError(
                            "Expression: convertErrorFunction",
                            "Expected: not undefined and not null",
                            "Actual: undefined"));
                });

                runner.test("with null convertErrorFunction", (test: Test) =>
                {
                    const parentResult: Result<number> = Result.value(5);
                    test.assertThrows(() => parentResult.convertError(null!),
                        new PreConditionError(
                            "Expression: convertErrorFunction",
                            "Expected: not undefined and not null",
                            "Actual: null"));
                });

                runner.test("with successful parent", (test: Test) =>
                {
                    const parentResult: Result<number> = Result.value(5);
                    let counter: number = 0;
                    const convertErrorResult: Result<number> = parentResult.convertError(() =>
                    {
                        counter++;
                        return new Error("abc");
                    });
                    test.assertSame(counter, 0);
                    for (let i = 0; i < 3; i++)
                    {
                        test.assertSame(convertErrorResult.await(), 5);
                        test.assertSame(counter, 0);
                    }
                });

                runner.test("with error parent and non-throwing convertErrorFunction", (test: Test) =>
                {
                    const parentResult: Result<number> = Result.error(new Error("abc"));
                    let counter: number = 0;
                    const convertErrorResult: Result<number> = parentResult.convertError(() =>
                    {
                        counter++;
                        return new Error("def");
                    });
                    test.assertSame(counter, 1);
                    for (let i = 0; i < 3; i++)
                    {
                        test.assertThrows(() => convertErrorResult.await(),
                            new Error("def"));
                        test.assertSame(counter, 1);
                    }
                });

                runner.test("with error parent and throwing convertErrorFunction", (test: Test) =>
                {
                    const parentResult: Result<number> = Result.error(new Error("abc"));
                    let counter: number = 0;
                    const convertErrorResult: Result<number> = parentResult.convertError(() =>
                    {
                        counter++;
                        throw new Error("def");
                    });
                    test.assertSame(counter, 1);
                    for (let i = 0; i < 3; i++)
                    {
                        test.assertThrows(() => convertErrorResult.await(),
                            new Error("def"));
                        test.assertSame(counter, 1);
                    }
                });
            });

            runner.testFunction("convertError<TError>(((unknown) => unknown))", () =>
            {
                runner.test("with undefined convertErrorFunction", (test: Test) =>
                {
                    const parentResult: Result<number> = Result.value(5);
                    test.assertThrows(() => parentResult.convertError(undefined!),
                        new PreConditionError(
                            "Expression: convertErrorFunction",
                            "Expected: not undefined and not null",
                            "Actual: undefined"));
                });

                runner.test("with null convertErrorFunction", (test: Test) =>
                {
                    const parentResult: Result<number> = Result.value(5);
                    test.assertThrows(() => parentResult.convertError(null!),
                        new PreConditionError(
                            "Expression: convertErrorFunction",
                            "Expected: not undefined and not null",
                            "Actual: null"));
                });

                runner.test("with successful parent", (test: Test) =>
                {
                    const parentResult: Result<number> = Result.value(5);
                    let counter: number = 0;
                    const convertErrorResult: Result<number> = parentResult.convertError((error: unknown) =>
                    {
                        counter++;
                        return new Error(`${error} - abc`);
                    });
                    test.assertSame(counter, 0);
                    for (let i = 0; i < 3; i++)
                    {
                        test.assertSame(convertErrorResult.await(), 5);
                        test.assertSame(counter, 0);
                    }
                });

                runner.test("with error parent and non-throwing convertErrorFunction", (test: Test) =>
                {
                    const parentResult: Result<number> = Result.error(new Error("abc"));
                    let counter: number = 0;
                    const convertErrorResult: Result<number> = parentResult.convertError((error: unknown) =>
                    {
                        counter++;
                        return new Error(`${error} - def`);
                    });
                    test.assertSame(counter, 1);
                    for (let i = 0; i < 3; i++)
                    {
                        test.assertThrows(() => convertErrorResult.await(),
                            new Error("Error: abc - def"));
                        test.assertSame(counter, 1);
                    }
                });

                runner.test("with error parent and throwing convertErrorFunction", (test: Test) =>
                {
                    const parentResult: Result<number> = Result.error(new Error("abc"));
                    let counter: number = 0;
                    const convertErrorResult: Result<number> = parentResult.convertError((error: unknown) =>
                    {
                        counter++;
                        throw new Error(`${error} - def`);
                    });
                    test.assertSame(counter, 1);
                    for (let i = 0; i < 3; i++)
                    {
                        test.assertThrows(() => convertErrorResult.await(),
                            new Error("Error: abc - def"));
                        test.assertSame(counter, 1);
                    }
                });
            });

            runner.testFunction("convertError<TError>(Type<TError>,(() => unknown))", () =>
            {
                runner.test("with successful parent", (test: Test) =>
                {
                    const parentResult: Result<number> = Result.value(5);
                    let counter: number = 0;
                    const convertErrorResult: Result<number> = parentResult.convertError(Error, () =>
                    {
                        counter++;
                        return new Error("abc");
                    });
                    test.assertSame(counter, 0);
                    for (let i = 0; i < 3; i++)
                    {
                        test.assertSame(convertErrorResult.await(), 5);
                        test.assertSame(counter, 0);
                    }
                });

                runner.test("with error parent, exact error match, and non-throwing convertErrorFunction", (test: Test) =>
                {
                    const parentResult: Result<number> = Result.error(new Error("abc"));
                    let counter: number = 0;
                    const convertErrorResult: Result<number> = parentResult.convertError(Error, () =>
                    {
                        counter++;
                        return new Error("def");
                    });
                    test.assertSame(counter, 1);
                    for (let i = 0; i < 3; i++)
                    {
                        test.assertThrows(() => convertErrorResult.await(),
                            new Error("def"));
                        test.assertSame(counter, 1);
                    }
                });

                runner.test("with error parent, super error match, and non-throwing convertErrorFunction", (test: Test) =>
                {
                    const parentResult: Result<number> = Result.error(new PreConditionError("abc"));
                    let counter: number = 0;
                    const convertErrorResult: Result<number> = parentResult.convertError(Error, () =>
                    {
                        counter++;
                        return new Error("def");
                    });
                    test.assertSame(counter, 1);
                    for (let i = 0; i < 3; i++)
                    {
                        test.assertThrows(() => convertErrorResult.await(),
                            new Error("def"));
                        test.assertSame(counter, 1);
                    }
                });

                runner.test("with error parent, no error match, and non-throwing convertErrorFunction", (test: Test) =>
                {
                    const parentResult: Result<number> = Result.error(new PreConditionError("abc"));
                    let counter: number = 0;
                    const convertErrorResult: Result<number> = parentResult.convertError(TypeError, () =>
                    {
                        counter++;
                        return new Error("def");
                    });
                    test.assertSame(counter, 0);
                    for (let i = 0; i < 3; i++)
                    {
                        test.assertThrows(() => convertErrorResult.await(),
                            new PreConditionError("abc"));
                        test.assertSame(counter, 0);
                    }
                });

                runner.test("with error parent, exact error match, and throwing convertErrorFunction", (test: Test) =>
                {
                    const parentResult: Result<number> = Result.error(new Error("abc"));
                    let counter: number = 0;
                    const convertErrorResult: Result<number> = parentResult.convertError(Error, () =>
                    {
                        counter++;
                        throw new Error("def");
                    });
                    test.assertSame(counter, 1);
                    for (let i = 0; i < 3; i++)
                    {
                        test.assertThrows(() => convertErrorResult.await(),
                            new Error("def"));
                        test.assertSame(counter, 1);
                    }
                });

                runner.test("with error parent, super error match, and throwing convertErrorFunction", (test: Test) =>
                {
                    const parentResult: Result<number> = Result.error(new TypeError("abc"));
                    let counter: number = 0;
                    const convertErrorResult: Result<number> = parentResult.convertError(Error, () =>
                    {
                        counter++;
                        throw new Error("def");
                    });
                    test.assertSame(counter, 1);
                    for (let i = 0; i < 3; i++)
                    {
                        test.assertThrows(() => convertErrorResult.await(),
                            new Error("def"));
                        test.assertSame(counter, 1);
                    }
                });

                runner.test("with error parent, no error match, and throwing convertErrorFunction", (test: Test) =>
                {
                    const parentResult: Result<number> = Result.error(new TypeError("abc"));
                    let counter: number = 0;
                    const convertErrorResult: Result<number> = parentResult.convertError(PreConditionError, () =>
                    {
                        counter++;
                        throw new Error("def");
                    });
                    test.assertSame(counter, 0);
                    for (let i = 0; i < 3; i++)
                    {
                        test.assertThrows(() => convertErrorResult.await(),
                            new TypeError("abc"));
                        test.assertSame(counter, 0);
                    }
                });
            });

            runner.testFunction("convertError<TError>(Type<TError>,((TError) => unknown))", () =>
            {
                runner.test("with successful parent", (test: Test) =>
                {
                    const parentResult: Result<number> = Result.value(5);
                    let counter: number = 0;
                    const convertErrorResult: Result<number> = parentResult.convertError(Error, (error: Error) =>
                    {
                        counter++;
                        return new Error(`${error} - abc`);
                    });
                    test.assertSame(counter, 0);
                    for (let i = 0; i < 3; i++)
                    {
                        test.assertSame(convertErrorResult.await(), 5);
                        test.assertSame(counter, 0);
                    }
                });

                runner.test("with error parent, exact error match, and non-throwing convertErrorFunction", (test: Test) =>
                {
                    const parentResult: Result<number> = Result.error(new Error("abc"));
                    let counter: number = 0;
                    const convertErrorResult: Result<number> = parentResult.convertError(Error, (error: Error) =>
                    {
                        counter++;
                        return new Error(`${error} - def`);
                    });
                    test.assertSame(counter, 1);
                    for (let i = 0; i < 3; i++)
                    {
                        test.assertThrows(() => convertErrorResult.await(),
                            new Error("Error: abc - def"));
                        test.assertSame(counter, 1);
                    }
                });

                runner.test("with error parent, super error match, and non-throwing convertErrorFunction", (test: Test) =>
                {
                    const parentResult: Result<number> = Result.error(new PreConditionError("abc"));
                    let counter: number = 0;
                    const convertErrorResult: Result<number> = parentResult.convertError(Error, (error: Error) =>
                    {
                        counter++;
                        return new Error(`${error} - def`);
                    });
                    test.assertSame(counter, 1);
                    for (let i = 0; i < 3; i++)
                    {
                        test.assertThrows(() => convertErrorResult.await(),
                            new Error("Error: abc - def"));
                        test.assertSame(counter, 1);
                    }
                });

                runner.test("with error parent, no error match, and non-throwing convertErrorFunction", (test: Test) =>
                {
                    const parentResult: Result<number> = Result.error(new PreConditionError("abc"));
                    let counter: number = 0;
                    const convertErrorResult: Result<number> = parentResult.convertError(TypeError, (error: TypeError) =>
                    {
                        counter++;
                        return new Error(`${error} - def`);
                    });
                    test.assertSame(counter, 0);
                    for (let i = 0; i < 3; i++)
                    {
                        test.assertThrows(() => convertErrorResult.await(),
                            new PreConditionError("abc"));
                        test.assertSame(counter, 0);
                    }
                });

                runner.test("with error parent, exact error match, and throwing convertErrorFunction", (test: Test) =>
                {
                    const parentResult: Result<number> = Result.error(new Error("abc"));
                    let counter: number = 0;
                    const convertErrorResult: Result<number> = parentResult.convertError(Error, (error: Error) =>
                    {
                        counter++;
                        throw new Error(`${error} - def`);
                    });
                    test.assertSame(counter, 1);
                    for (let i = 0; i < 3; i++)
                    {
                        test.assertThrows(() => convertErrorResult.await(),
                            new Error("Error: abc - def"));
                        test.assertSame(counter, 1);
                    }
                });

                runner.test("with error parent, super error match, and throwing convertErrorFunction", (test: Test) =>
                {
                    const parentResult: Result<number> = Result.error(new TypeError("abc"));
                    let counter: number = 0;
                    const convertErrorResult: Result<number> = parentResult.convertError(Error, (error: Error) =>
                    {
                        counter++;
                        throw new Error(`${error} - def`);
                    });
                    test.assertSame(counter, 1);
                    for (let i = 0; i < 3; i++)
                    {
                        test.assertThrows(() => convertErrorResult.await(),
                            new Error("TypeError: abc - def"));
                        test.assertSame(counter, 1);
                    }
                });

                runner.test("with error parent, no error match, and throwing convertErrorFunction", (test: Test) =>
                {
                    const parentResult: Result<number> = Result.error(new TypeError("abc"));
                    let counter: number = 0;
                    const convertErrorResult: Result<number> = parentResult.convertError(PreConditionError, (error: PreConditionError) =>
                    {
                        counter++;
                        throw new Error(`${error} - def`);
                    });
                    test.assertSame(counter, 0);
                    for (let i = 0; i < 3; i++)
                    {
                        test.assertThrows(() => convertErrorResult.await(),
                            new TypeError("abc"));
                        test.assertSame(counter, 0);
                    }
                });
            });

            runner.testFunction("toPromise()", () =>
            {
                runner.test("with void return type that doesn't throw", async (test: Test) =>
                {
                    let value: number = 0;
                    const result: Result<void> = Result.create(() => { value++; });
                    test.assertEqual(value, 1);

                    const promise: PromiseLike<void> = result.toPromise();
                    test.assertEqual(value, 1);

                    for (let i = 0; i < 3; i++)
                    {
                        const promiseResult: void = await promise;
                        test.assertUndefined(promiseResult);
                        test.assertEqual(value, 1);
                    }
                });

                runner.test("with void return type that throws", async (test: Test) =>
                {
                    let value: number = 0;
                    const result: Result<void> = Result.create(() =>
                    {
                        value++;
                        throw new Error("oops!");
                    });
                    test.assertEqual(value, 1);

                    const promise: PromiseLike<void> = result.toPromise();
                    test.assertEqual(value, 1);

                    for (let i = 0; i < 3; i++)
                    {
                        await test.assertThrowsAsync(async () => await promise, new Error("oops!"));
                        test.assertEqual(value, 1);
                    }
                });

                runner.test("with non-void return type that doesn't throw", async (test: Test) =>
                {
                    let value: string = "";
                    const result: Result<number> = Result.create(() =>
                    {
                        value += "a";
                        return value.length;
                    });
                    test.assertEqual(value, "a");

                    const promise: PromiseLike<number> = result.toPromise();
                    test.assertEqual(value, "a");

                    for (let i = 0; i < 3; i++)
                    {
                        const promiseResult: number = await promise;
                        test.assertEqual(promiseResult, 1);
                        test.assertEqual(value, "a");
                    }
                });

                runner.test("with non-void return type that throws", async (test: Test) =>
                {
                    let value: string = "";
                    const result: Result<number> = Result.create(() =>
                    {
                        value += "a";
                        if (value === "a")
                        {
                            throw new Error("oops again!");
                        }
                        return value.length;
                    });
                    test.assertEqual(value, "a");

                    const promise: PromiseLike<number> = result.toPromise();
                    test.assertEqual(value, "a");

                    for (let i = 0; i < 3; i++)
                    {
                        await test.assertThrowsAsync(async () => await promise, new Error("oops again!asdf"));
                    }
                });
            });
        });
    });
}
test(createTestRunner());