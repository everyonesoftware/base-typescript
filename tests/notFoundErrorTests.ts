import * as assert from "assert";

import { NotFoundError } from "../sources";

suite("notFoundError.ts", () =>
{
    suite(NotFoundError.name, () =>
    {
        suite("constructor(...string[])", () =>
        {
            test("with no arguments", () =>
            {
                const error: NotFoundError = new NotFoundError();
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