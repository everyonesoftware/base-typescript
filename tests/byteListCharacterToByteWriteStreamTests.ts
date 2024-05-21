import * as assert from "assert";

import { ByteListCharacterToByteWriteStream } from "../sources";
import { byteListByteWriteStreamTests } from "./byteListByteWriteStreamTests";
import { characterWriteStreamTests } from "./characterWriteStreamTests";

suite("byteListCharacterToByteWriteStream.ts", () =>
{
    suite("ByteListCharacterToByteWriteStream", () =>
    {
        test("create()", () =>
        {
            const writeStream: ByteListCharacterToByteWriteStream = ByteListCharacterToByteWriteStream.create();
            assert.deepStrictEqual(writeStream.getBytes(), new Uint8Array());
            assert.deepStrictEqual(writeStream.getText(), "");
        });
        
        byteListByteWriteStreamTests(ByteListCharacterToByteWriteStream.create);
        characterWriteStreamTests(ByteListCharacterToByteWriteStream.create);

        test("writeCharacter(string)", () =>
        {
            const writeStream: ByteListCharacterToByteWriteStream = ByteListCharacterToByteWriteStream.create();

            assert.strictEqual(writeStream.writeCharacter("a").await(), undefined);
            assert.strictEqual(writeStream.getText(), "a");

            assert.strictEqual(writeStream.writeCharacter(" ").await(), undefined);
            assert.strictEqual(writeStream.getText(), "a ");

            assert.strictEqual(writeStream.writeCharacter("A").await(), undefined);
            assert.strictEqual(writeStream.getText(), "a A");
        });

        test("writeString(string,number?,number?)", () =>
        {
            const writeStream: ByteListCharacterToByteWriteStream = ByteListCharacterToByteWriteStream.create();

            assert.strictEqual(writeStream.writeString("a").await(), undefined);
            assert.strictEqual(writeStream.getText(), "a");

            assert.strictEqual(writeStream.writeString(" ").await(), undefined);
            assert.strictEqual(writeStream.getText(), "a ");

            assert.strictEqual(writeStream.writeString("").await(), undefined);
            assert.strictEqual(writeStream.getText(), "a ");

            assert.strictEqual(writeStream.writeString("A").await(), undefined);
            assert.strictEqual(writeStream.getText(), "a A");

            assert.strictEqual(writeStream.writeString(" z Z").await(), undefined);
            assert.strictEqual(writeStream.getText(), "a A z Z");
        });

        test("writeLine(string,number?,number?)", () =>
        {
            const writeStream: ByteListCharacterToByteWriteStream = ByteListCharacterToByteWriteStream.create();

            assert.strictEqual(writeStream.writeLine("a").await(), undefined);
            assert.strictEqual(writeStream.getText(), "a\n");

            assert.strictEqual(writeStream.writeLine(" ").await(), undefined);
            assert.strictEqual(writeStream.getText(), "a\n \n");

            assert.strictEqual(writeStream.writeLine("").await(), undefined);
            assert.strictEqual(writeStream.getText(), "a\n \n\n");

            assert.strictEqual(writeStream.writeLine("A").await(), undefined);
            assert.strictEqual(writeStream.getText(), "a\n \n\nA\n");

            assert.strictEqual(writeStream.writeLine(" z Z").await(), undefined);
            assert.strictEqual(writeStream.getText(), "a\n \n\nA\n z Z\n");
        });
    });
});