import * as assert from "assert";

import { Pre } from "../sources";

suite("pre.ts", () =>
{
    suite(Pre.name, () =>
    {
        test("Condition is not undefined and not null", () =>
        {
            assert.notStrictEqual(Pre.condition, undefined);
            assert.notStrictEqual(Pre.condition, null);
            Pre.condition.assertTrue(true);
        });
    });
});