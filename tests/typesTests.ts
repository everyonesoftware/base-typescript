import { Test, TestRunner } from "@everyonesoftware/test-typescript";
import { Indexable, Iterable, List, MutableIndexable, asBoolean, hasFunction, hasProperty, isArray, isBoolean, isFunction, isNumber, isObject, isObjectOrArrayOrNull as isObjectArrayOrNull, isString } from "../sources/";
import { createTestRunner } from "./tests";

export function test(runner: TestRunner): void
{
    runner.testFile("types.ts", () =>
    {
        runner.testFunction("isBoolean(unknown)", () =>
        {
            function isBooleanTest(value: unknown, expected: boolean): void
            {
                runner.test(`with ${runner.toString(value)}`, (test: Test) =>
                {
                    test.assertSame(isBoolean(value), expected);
                });
            }

            isBooleanTest(undefined, false);
            isBooleanTest(null, false);
            isBooleanTest("", false);
            isBooleanTest("true", false);
            isBooleanTest(123, false);
            isBooleanTest({}, false);
            isBooleanTest([], false);
            isBooleanTest(true, true);
            isBooleanTest(false, true);
        });

        runner.testFunction("asBoolean(unknown)", () =>
        {
            function asBooleanTest(value: unknown, expected: boolean | undefined): void
            {
                runner.test(`with ${runner.toString(value)}`, (test: Test) =>
                {
                    test.assertEqual(asBoolean(value), expected);
                });
            }

            asBooleanTest(undefined, undefined);
            asBooleanTest(null, undefined);
            asBooleanTest("", undefined);
            asBooleanTest("true", undefined);
            asBooleanTest(123, undefined);
            asBooleanTest({}, undefined);
            asBooleanTest([], undefined);
            asBooleanTest(true, true);
            asBooleanTest(false, false);
            asBooleanTest(() => false, undefined);
            asBooleanTest(() => true, undefined);
        });

        runner.testFunction("isNumber(unknown)", () =>
        {
            function isNumberTest(value: unknown, expected: boolean): void
            {
                runner.test(`with ${runner.toString(value)}`, (test: Test) =>
                {
                    test.assertSame(isNumber(value), expected);
                });
            }

            isNumberTest(undefined, false);
            isNumberTest(null, false);
            isNumberTest("", false);
            isNumberTest("123", false);
            isNumberTest({}, false);
            isNumberTest([], false);
            isNumberTest(true, false);
            isNumberTest(false, false);
            isNumberTest(123, true);
            isNumberTest(Infinity, true);
            isNumberTest(-Infinity, true);
            isNumberTest(NaN, true);
        });

        runner.testFunction("isString(unknown)", () =>
        {
            function isStringTest(value: unknown, expected: boolean): void
            {
                runner.test(`with ${runner.toString(value)}`, (test: Test) =>
                {
                    test.assertSame(isString(value), expected);
                });
            }

            isStringTest(undefined, false);
            isStringTest(null, false);
            isStringTest(50, false);
            isStringTest({}, false);
            isStringTest("", true);
            isStringTest("hello", true);
        });

        runner.testFunction("isFunction(unknown)", () =>
        {
            function isFunctionTest(value: unknown, expected: boolean): void
            {
                runner.test(`with ${runner.toString(value)}`, (test: Test) =>
                {
                    test.assertSame(isFunction(value), expected);
                });
            }

            isFunctionTest(undefined, false);
            isFunctionTest(null, false);
            isFunctionTest(false, false);
            isFunctionTest(true, false);
            isFunctionTest(123, false);
            isFunctionTest("abc", false);
            isFunctionTest({}, false);
            isFunctionTest([], false);

            isFunctionTest(isArray, true);
            isFunctionTest(isFunction, true);
            isFunctionTest(() => 123, true);
        });

        runner.testFunction("isArray(unknown)", () =>
        {
            function isArrayTest(value: unknown, expected: boolean): void
            {
                runner.test(`with ${runner.toString(value)}`, (test: Test) =>
                {
                    test.assertSame(isArray(value), expected);
                });
            }

            isArrayTest(undefined, false);
            isArrayTest(null, false);
            isArrayTest(50, false);
            isArrayTest({}, false);
            isArrayTest("", false);
            isArrayTest("hello", false);
            isArrayTest(Iterable.create(), false);
            isArrayTest(Indexable.create(), false);
            isArrayTest(MutableIndexable.create(), false);
            isArrayTest(List.create(), false);

            isArrayTest([], true);
            isArrayTest(["a", "b"], true);
            isArrayTest(new Array(), true);
            isArrayTest(Array.from([1, 2]), true);
        });

        runner.testFunction("isObjectOrNull(unknown)", () =>
        {
            function isObjectOrNullTest(value: unknown, expected: boolean): void
            {
                runner.test(`with ${runner.toString(value)}`, (test: Test) =>
                {
                    test.assertSame(isObjectArrayOrNull(value), expected);
                });
            }

            isObjectOrNullTest(undefined, false);
            isObjectOrNullTest(50, false);
            isObjectOrNullTest("", false);
            isObjectOrNullTest("hello", false);
            
            isObjectOrNullTest({}, true);
            isObjectOrNullTest(null, true);
            isObjectOrNullTest([], true);
            isObjectOrNullTest(["a", "b"], true);
            isObjectOrNullTest(new Array(), true);
            isObjectOrNullTest(Array.from([1, 2]), true);
            isObjectOrNullTest(Iterable.create(), true);
            isObjectOrNullTest(Indexable.create(), true);
            isObjectOrNullTest(MutableIndexable.create(), true);
            isObjectOrNullTest(List.create(), true);
        });

        runner.testFunction("isObjectArrayOrNull(unknown)", () =>
        {
            function isObjectArrayOrNullTest(value: unknown, expected: boolean): void
            {
                runner.test(`with ${runner.toString(value)}`, (test: Test) =>
                {
                    test.assertSame(isObjectArrayOrNull(value), expected);
                });
            }

            isObjectArrayOrNullTest(undefined, false);
            isObjectArrayOrNullTest(50, false);
            isObjectArrayOrNullTest("", false);
            isObjectArrayOrNullTest("hello", false);
            
            isObjectArrayOrNullTest({}, true);
            isObjectArrayOrNullTest(null, true);
            isObjectArrayOrNullTest([], true);
            isObjectArrayOrNullTest(["a", "b"], true);
            isObjectArrayOrNullTest(new Array(), true);
            isObjectArrayOrNullTest(Array.from([1, 2]), true);
            isObjectArrayOrNullTest(Iterable.create(), true);
            isObjectArrayOrNullTest(Indexable.create(), true);
            isObjectArrayOrNullTest(MutableIndexable.create(), true);
            isObjectArrayOrNullTest(List.create(), true);
        });

        runner.testFunction("isObject(unknown)", () =>
        {
            function isObjectTest(value: unknown, expected: boolean): void
            {
                runner.test(`with ${runner.toString(value)}`, (test: Test) =>
                {
                    test.assertSame(isObject(value), expected);
                });
            }

            isObjectTest(undefined, false);
            isObjectTest(50, false);
            isObjectTest("", false);
            isObjectTest("hello", false);
            isObjectTest(null, false);
            isObjectTest([], false);
            isObjectTest(["a", "b"], false);
            isObjectTest(new Array(), false);
            isObjectTest(Array.from([1, 2]), false);
            
            isObjectTest({}, true);
            isObjectTest(Iterable.create(), true);
            isObjectTest(Indexable.create(), true);
            isObjectTest(MutableIndexable.create(), true);
            isObjectTest(List.create(), true);
        });

        runner.testFunction("hasProperty(TValue,TPropertyKey extends PropertyKey)", () =>
        {
            function hasPropertyTest<TPropertyKey extends PropertyKey>(value: unknown, propertyKey: TPropertyKey, expected: boolean): void
            {
                runner.test(`with ${runner.andList([value, propertyKey])}`, (test: Test) =>
                {
                    const result: boolean = hasProperty(value, propertyKey);
                    test.assertSame(result, expected);
                    if (value !== undefined && value !== null)
                    {
                        if (result)
                        {
                            test.assertNotUndefined((value as any)[propertyKey]);
                        }
                        else
                        {
                            test.assertUndefined((value as any)[propertyKey]);
                        }
                    }
                });
            }

            hasPropertyTest(undefined, "spam", false);
            hasPropertyTest(null, "spam", false);
            hasPropertyTest([], "spam", false);
            hasPropertyTest([], "length", true);
            hasPropertyTest({}, "spam", false);
            hasPropertyTest("", "spam", false);
            hasPropertyTest("", "length", true);
            hasPropertyTest(5, "spam", false);
            hasPropertyTest(5, "toString", true);
        });

        runner.testFunction("hasFunction(TValue,TPropertyKey extends PropertyKey)", () =>
        {
            function hasFunctionTest<TPropertyKey extends PropertyKey>(value: unknown, propertyKey: TPropertyKey, expected: boolean): void
            {
                runner.test(`with ${runner.andList([value, propertyKey])}`, (test: Test) =>
                {
                    test.assertSame(hasFunction(value, propertyKey), expected);
                });
            }

            hasFunctionTest(undefined, "spam", false);
            hasFunctionTest(null, "spam", false);
            hasFunctionTest([], "spam", false);
            hasFunctionTest([], "length", false);
            hasFunctionTest([], Symbol.iterator, true);
            hasFunctionTest({}, "spam", false);
            hasFunctionTest("", "spam", false);
            hasFunctionTest("", "length", false);
            hasFunctionTest("", "at", true);
            hasFunctionTest("", Symbol.iterator, true);
            hasFunctionTest(5, "spam", false);
            hasFunctionTest(5, "toString", true);
        });
    });
}
test(createTestRunner());