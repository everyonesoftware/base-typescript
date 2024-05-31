import { ByteListCharacterToByteWriteStream, Test, TestRunner } from "../sources";
import { byteListByteWriteStreamTests } from "./byteListByteWriteStreamTests";
import { characterWriteStreamTests } from "./characterWriteStreamTests";
import { MochaTestRunner } from "./mochaTestRunner";

export function test(runner: TestRunner): void
{
    runner.testFile("byteListCharacterToByteWriteStream.ts", () =>
    {
        runner.testType(ByteListCharacterToByteWriteStream, () =>
        {
            runner.test("create()", (test: Test) =>
            {
                const writeStream: ByteListCharacterToByteWriteStream = ByteListCharacterToByteWriteStream.create();
                test.assertEqual(writeStream.getBytes(), new Uint8Array());
                test.assertEqual(writeStream.getText(), "");
            });
            
            byteListByteWriteStreamTests(runner, ByteListCharacterToByteWriteStream.create);
            characterWriteStreamTests(runner, ByteListCharacterToByteWriteStream.create);

            runner.test("writeCharacter(string)", (test: Test) =>
            {
                const writeStream: ByteListCharacterToByteWriteStream = ByteListCharacterToByteWriteStream.create();

                test.assertUndefined(writeStream.writeCharacter("a").await());
                test.assertEqual(writeStream.getText(), "a");

                test.assertUndefined(writeStream.writeCharacter(" ").await());
                test.assertEqual(writeStream.getText(), "a ");

                test.assertUndefined(writeStream.writeCharacter("A").await());
                test.assertEqual(writeStream.getText(), "a A");
            });

            runner.test("writeString(string,number?,number?)", (test: Test) =>
            {
                const writeStream: ByteListCharacterToByteWriteStream = ByteListCharacterToByteWriteStream.create();

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

            runner.test("writeLine(string,number?,number?)", (test: Test) =>
            {
                const writeStream: ByteListCharacterToByteWriteStream = ByteListCharacterToByteWriteStream.create();

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
test(MochaTestRunner.create());