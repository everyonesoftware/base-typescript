import * as assert from "assert";
import { Bytes } from "../sources";

suite("bytes.ts", () =>
{
    suite("Bytes", () =>
    {
        test("minimumValue", () =>
        {
            assert.strictEqual(Bytes.minimumValue, 0);
        });

        test("maximumValue", () =>
        {
            assert.strictEqual(Bytes.maximumValue, 255);
        });

        suite("isByte(number)", () =>
        {
            function isByteTest(value: number, expected: boolean): void
            {
                test(`with ${value}`, () =>
                {
                    assert.strictEqual(Bytes.isByte(value), expected);
                });
            }

            isByteTest(-2, false);
            isByteTest(-1, false);
            isByteTest(0, true);
            isByteTest(1, true);
            isByteTest(128, true);
            isByteTest(254, true);
            isByteTest(255, true);
            isByteTest(256, false);
            isByteTest(257, false);
        });
    });
});