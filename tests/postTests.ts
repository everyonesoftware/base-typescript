import * as assert from "assert";

import { Post } from "../sources";

suite("post.ts", () =>
{
    suite(Post.name, () =>
    {
        test("Condition is not undefined and not null", () =>
        {
            assert.notStrictEqual(Post.condition, undefined);
            assert.notStrictEqual(Post.condition, null);
            Post.condition.assertTrue(true);
        });
    });
});