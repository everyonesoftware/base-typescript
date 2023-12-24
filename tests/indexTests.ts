import * as assert from "assert";

import * as index from "../sources/index";

suite("index", () =>
{
    test("condition", () =>
    {
        assert.notStrictEqual(index.Condition, undefined);
    });

    test("english", () =>
    {
        assert.notStrictEqual(index.andList, undefined);
    });

    test("iterator", () =>
    {
        assert.notStrictEqual(index.Iterator, undefined);
    });

    test("strings", () =>
    {
        assert.notStrictEqual(index.isLetterOrDigit, undefined);
    });

    test("types", () =>
    {
        assert.notStrictEqual(index.isString, undefined);
    });
});