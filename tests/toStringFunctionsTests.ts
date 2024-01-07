import * as assert from "assert";

import { Iterable, List, ToStringFunctions, isIterable } from "../sources";

suite("toStringFunctions.ts", () =>
{
    suite("ToStringFunctions", () =>
    {
        suite("toString(unknown)", () =>
        {
            suite("with default functions", () =>
            {
                function toStringTest(value: unknown, expected: string)
                {
                    test(`with ${value}`, () =>
                    {
                        const functions: ToStringFunctions = ToStringFunctions.create();
                        assert.strictEqual(functions.toString(value), expected);
                    });
                }

                toStringTest(undefined, "undefined");
                toStringTest(null, "null");
                toStringTest(false, "false");
                toStringTest(true, "true");
                toStringTest(50, "50");
                toStringTest(1.2, "1.2");
                toStringTest("hello\tthere\nfriend", `"hello\\tthere\\nfriend"`);
                toStringTest({}, "{}");
                toStringTest({1:"one", b: "two"}, `{"1":"one","b":"two"}`);
                toStringTest([], "[]");
                toStringTest([undefined, undefined], "[undefined,undefined]");
                toStringTest([1, 2.3, false], "[1,2.3,false]");
                toStringTest([[[]]], "[[[]]]");
                toStringTest(List.create(), `{"array":[]}`);
                toStringTest(List.create<string>(["abc"]), `{"array":["abc"]}`);
                toStringTest(List.create([1, 2, 3]), `{"array":[1,2,3]}`);
            });

            suite("with Iterable.toString()", () =>
            {
                function toStringTest(value: unknown, expected: string)
                {
                    test(`with ${value}`, () =>
                    {
                        const functions: ToStringFunctions = ToStringFunctions.create();
                        functions.add(isIterable, (value: Iterable<unknown>) => Iterable.toString(value, functions));
                        assert.strictEqual(functions.toString(value), expected);
                    });
                }

                toStringTest(undefined, "undefined");
                toStringTest(null, "null");
                toStringTest(false, "false");
                toStringTest(true, "true");
                toStringTest(50, "50");
                toStringTest(1.2, "1.2");
                toStringTest("hello\tthere\nfriend", `"hello\\tthere\\nfriend"`);
                toStringTest({}, "{}");
                toStringTest({1:"one", b: "two"}, `{"1":"one","b":"two"}`);
                toStringTest([], "[]");
                toStringTest([undefined, undefined], "[undefined,undefined]");
                toStringTest([1, 2.3, false], "[1,2.3,false]");
                toStringTest([[[]]], "[[[]]]");
                toStringTest(List.create(), `[]`);
                toStringTest(List.create<string>(["abc"]), `["abc"]`);
                toStringTest(List.create([1, 2, 3]), `[1,2,3]`);
            });
        });
    });
});