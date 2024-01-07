import * as assert from "assert";

import { Iterable } from "../sources";

suite("iterable.ts", () =>
{
    suite("Iterable<T>", () =>
    {
        suite("create(JavascriptIterable<T>|undefined)", () =>
        {
            test("with no arguments", () =>
            {
                const iterable: Iterable<number> = Iterable.create();
                assert.notStrictEqual(iterable, undefined);
                assert.deepStrictEqual(iterable.toArray(), []);
            });

            test("with empty array", () =>
            {
                const iterable: Iterable<number> = Iterable.create<number>([]);
                assert.notStrictEqual(iterable, undefined);
                assert.deepStrictEqual(iterable.toArray(), []);
            });

            test("with non-empty array", () =>
            {
                const iterable: Iterable<number> = Iterable.create([1, 2, 3]);
                assert.notStrictEqual(iterable, undefined);
                assert.deepStrictEqual(iterable.toArray(), [1, 2, 3]);
            });
        });
    });
});