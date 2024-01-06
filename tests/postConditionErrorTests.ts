import * as assert from "assert";

import { PostConditionError } from "../sources";

suite("postConditionError.ts", () =>
{
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