import { JsonToken, JsonTokenType, Test, TestRunner } from "../sources";
import { MochaTestRunner } from "./mochaTestRunner";

export function test(runner: TestRunner): void
{
    runner.testFile("jsonToken.ts", () =>
    {
        runner.testType(JsonToken.name, () =>
        {
            runner.testFunction("leftCurlyBrace()", (test: Test) =>
            {
                const token: JsonToken = JsonToken.leftCurlyBrace();
                test.assertSame(token.getText(), "{");
                test.assertSame(token.getTokenType(), JsonTokenType.LeftCurlyBrace);
            });

            runner.testFunction("rightCurlyBrace()", (test: Test) =>
            {
                const token: JsonToken = JsonToken.rightCurlyBrace();
                test.assertSame(token.getText(), "}");
                test.assertSame(token.getTokenType(), JsonTokenType.RightCurlyBrace);
            });

            runner.testFunction("leftSquareBracket()", (test: Test) =>
            {
                const token: JsonToken = JsonToken.leftSquareBracket();
                test.assertSame(token.getText(), "[");
                test.assertSame(token.getTokenType(), JsonTokenType.LeftSquareBracket);
            });

            runner.testFunction("rightSquareBracket()", (test: Test) =>
            {
                const token: JsonToken = JsonToken.rightSquareBracket();
                test.assertSame(token.getText(), "]");
                test.assertSame(token.getTokenType(), JsonTokenType.RightSquareBracket);
            });
        });
    });
}
test(MochaTestRunner.create());
