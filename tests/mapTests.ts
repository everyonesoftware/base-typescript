import * as assert from "assert";

import { Map, NotFoundError, andList } from "../sources";

suite("map.ts", () =>
{
    suite(Map.name, () =>
    {
        test("create()", () =>
        {
            const map: Map<number,string> = Map.create();
            assert.strictEqual(map.getCount(), 0);
        });
    });
});

export function mapTests(creator: () => Map<number,string>): void
{
    suite(Map.name, () =>
    {
        suite("containsKey(TKey)", () =>
        {
            test("when it doesn't contain the key", () =>
            {
                const map: Map<number,string> = creator();
                assert.strictEqual(map.getCount(), 0);

                assert.strictEqual(map.containsKey(50), false);
            });

            test("when it contains the key", () =>
            {
                const map: Map<number,string> = creator();
                assert.strictEqual(map.getCount(), 0);

                map.set(50, "fifty");

                assert.strictEqual(map.containsKey(50), true);
            });
        });

        suite("get(TKey)", () =>
        {
            test("when it contains the key", () =>
            {
                const map: Map<number,string> = creator().set(1, "one");
                assert.strictEqual(map.getCount(), 1);
                assert.strictEqual(map.get(1), "one");
                assert.strictEqual(map.getCount(), 1);
            });

            test("when it doesn't contain the key", () =>
            {
                const map: Map<number,string> = creator();
                assert.strictEqual(map.getCount(), 0);
                assert.throws(() => map.get(1), new NotFoundError(
                    "The key 1 was not found in the map.",
                ));
                assert.strictEqual(map.getCount(), 0);
            });
        });

        suite("set(TKey,TValue)", () =>
        {
            function setTest(map: Map<number,string>, key: number, value: string): void
            {
                test(`with ${andList([map, key, value].map(x => JSON.stringify(x)))}`, () =>
                {
                    const setResult: Map<number,string> = map.set(key, value);
                    assert.strictEqual(setResult, map);
                    assert.strictEqual(map.get(key), value);
                });
            }

            setTest(creator(), 0, "zero");
            setTest(creator(), 1, "1");
            setTest(creator(), -1, "negative one");

            setTest(creator(), undefined!, "hello");
            setTest(creator(), null!, "oops");
            setTest(creator(), 10, undefined!);
            setTest(creator(), 11, null!);

            setTest(creator().set(1, "1"), 1, "one");
        });

        suite("toString()", () =>
        {
            function toStringTest(map: Map<number,string>, expected: string): void
            {
                test(`with ${map}`, () =>
                {
                    assert.strictEqual(map.toString(), expected);
                });
            }

            toStringTest(creator(), "{}");
            toStringTest(creator().set(1, "one"), "{1:one}");
            toStringTest(creator().set(2, "2").set(1, "one"), "{2:2,1:one}");
        });
    });
}