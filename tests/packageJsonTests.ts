import * as assert from "assert";

import { JsonDocument, PackageJson } from "../sources";

suite("packageJson.ts", () =>
{
    suite("PackageJson", () =>
    {
        test("create()", () =>
        {
            const packageJson: PackageJson = PackageJson.create();
            assert.deepStrictEqual(packageJson.getDocument(), JsonDocument.create());
        });
    });
});