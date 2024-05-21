import * as assert from "assert";

import { CharacterListCharacterWriteStream } from "../sources";
import { characterWriteStreamTests } from "./characterWriteStreamTests";

suite("characterListCharacterWriteStream.ts", () =>
{
    suite("CharacterListCharacterWriteStream", () =>
    {
        test("create()", () =>
        {
            const writeStream: CharacterListCharacterWriteStream = CharacterListCharacterWriteStream.create();
            assert.strictEqual(writeStream.getText(), "");
        });

        characterWriteStreamTests(CharacterListCharacterWriteStream.create);

        test("writeCharacter(string)", () =>
        {
            const writeStream: CharacterListCharacterWriteStream = CharacterListCharacterWriteStream.create();

            assert.strictEqual(writeStream.writeCharacter("a").await(), undefined);
            assert.strictEqual(writeStream.getText(), "a");

            assert.strictEqual(writeStream.writeCharacter(" ").await(), undefined);
            assert.strictEqual(writeStream.getText(), "a ");

            assert.strictEqual(writeStream.writeCharacter("A").await(), undefined);
            assert.strictEqual(writeStream.getText(), "a A");
        });

        test("writeString(string,number?,number?)", () =>
        {
            const writeStream: CharacterListCharacterWriteStream = CharacterListCharacterWriteStream.create();

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
            const writeStream: CharacterListCharacterWriteStream = CharacterListCharacterWriteStream.create();

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