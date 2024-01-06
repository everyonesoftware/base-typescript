import * as assert from "assert";

import { PreConditionError } from "../sources";

suite("preConditionError.ts", () =>
{
    suite(PreConditionError.name, () =>
    {
        suite("constructor(string|undefined)", () =>
        {
            test("with no arguments", () =>
            {
                const error: PreConditionError = new PreConditionError();
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