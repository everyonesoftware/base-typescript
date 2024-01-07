import * as assert from "assert";

import { JavascriptMapMap } from "../sources";
import { mapTests } from "./mapTests";

suite("javascriptMapMap.ts", () =>
{
    suite(JavascriptMapMap.name, () =>
    {
        test("create()", () =>
        {
            const map: JavascriptMapMap<number,string> = JavascriptMapMap.create();
            assert.strictEqual(map.getCount(), 0);
        });

        mapTests(JavascriptMapMap.create);
    });
});