import * as assert from "assert";

import { JsonNull, JsonSegmentType } from "../sources";

suite("jsonNull.ts", () =>
{
    suite("JsonNull", () =>
    {
        test("create()", () =>
        {
            const json: JsonNull = JsonNull.create();
            assert.strictEqual(json.getSegmentType(), JsonSegmentType.Null);
            assert.strictEqual(json.toString(), "null");
        });
    });
});