import { Test, TestRunner } from "@everyonesoftware/test-typescript";
import { CharacterListCharacterWriteStream } from "../sources";
import { characterWriteStreamTests } from "./characterWriteStreamTests";
import { createTestRunner } from "./tests";

export function test(runner: TestRunner): void
{
    runner.testFile("characterListCharacterWriteStream.ts", () =>
    {
        runner.testType(CharacterListCharacterWriteStream.name, () =>
        {
            runner.testFunction("create()", (test: Test) =>
            {
                const writeStream: CharacterListCharacterWriteStream = CharacterListCharacterWriteStream.create();
                test.assertEqual(writeStream.getText(), "");
            });

            characterWriteStreamTests(runner, CharacterListCharacterWriteStream.create);

            runner.testFunction("writeCharacter(string)", (test: Test) =>
            {
                const writeStream: CharacterListCharacterWriteStream = CharacterListCharacterWriteStream.create();

                test.assertUndefined(writeStream.writeCharacter("a").await());
                test.assertEqual(writeStream.getText(), "a");

                test.assertUndefined(writeStream.writeCharacter(" ").await());
                test.assertEqual(writeStream.getText(), "a ");

                test.assertUndefined(writeStream.writeCharacter("A").await());
                test.assertEqual(writeStream.getText(), "a A");
            });

            runner.testFunction("writeString(string,number?,number?)", (test: Test) =>
            {
                const writeStream: CharacterListCharacterWriteStream = CharacterListCharacterWriteStream.create();

                test.assertUndefined(writeStream.writeString("a").await());
                test.assertEqual(writeStream.getText(), "a");

                test.assertUndefined(writeStream.writeString(" ").await());
                test.assertEqual(writeStream.getText(), "a ");

                test.assertUndefined(writeStream.writeString("").await());
                test.assertEqual(writeStream.getText(), "a ");

                test.assertUndefined(writeStream.writeString("A").await());
                test.assertEqual(writeStream.getText(), "a A");

                test.assertUndefined(writeStream.writeString(" z Z").await());
                test.assertEqual(writeStream.getText(), "a A z Z");
            });

            runner.testFunction("writeLine(string,number?,number?)", (test: Test) =>
            {
                const writeStream: CharacterListCharacterWriteStream = CharacterListCharacterWriteStream.create();

                test.assertUndefined(writeStream.writeLine("a").await());
                test.assertEqual(writeStream.getText(), "a\n");

                test.assertUndefined(writeStream.writeLine(" ").await());
                test.assertEqual(writeStream.getText(), "a\n \n");

                test.assertUndefined(writeStream.writeLine("").await());
                test.assertEqual(writeStream.getText(), "a\n \n\n");

                test.assertUndefined(writeStream.writeLine("A").await());
                test.assertEqual(writeStream.getText(), "a\n \n\nA\n");

                test.assertUndefined(writeStream.writeLine(" z Z").await());
                test.assertEqual(writeStream.getText(), "a\n \n\nA\n z Z\n");
            });
        });
    });
}
test(createTestRunner());