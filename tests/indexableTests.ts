import * as assert from "assert";

import { Indexable } from "../sources/";

suite("indexable.ts", () =>
{
    suite("Indexable<T>", () =>
    {
        suite("create(T[]|Iterable<T>)", () =>
        {
            function createTest<T>(values: T[]): void
            {
                test(`with ${JSON.stringify(values)}`, () =>
                {
                    const indexable: Indexable<T> = Indexable.create(values);
                    assert.deepStrictEqual(indexable.toArray(), values ?? []);
                });
            }

            createTest(undefined!);
            createTest(null!);
            createTest([]);
            createTest([1, 2, 3]);
        });
    });
});