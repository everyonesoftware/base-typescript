import { Test, TestRunner } from "@everyonesoftware/test-typescript";
import { toLowercase, toUppercase, toCamelCase, toPascalCase, toSnakeCase, toUpperSnakeCase, toKebabCase, toUpperKebabCase } from "../sources";
import { createTestRunner } from "./tests";

export function test(runner: TestRunner): void
{
    runner.testFile("text.ts", () =>
    {
        runner.testFunction("toLowercase(string)", () =>
        {
            function toLowercaseTest(value: string, expected: string): void
            {
                runner.test(`with "${runner.toString(value)}"`, (test: Test) =>
                {
                    test.assertSame(toLowercase(value), expected);
                });
            }

            toLowercaseTest("", "");
            toLowercaseTest("a", "a");
            toLowercaseTest("B", "b");
        });

        runner.testFunction("toUppercase(string)", () =>
        {
            function toUppercaseTest(value: string, expected: string): void
            {
                runner.test(`with ${runner.toString(value)}`, (test: Test) =>
                {
                    test.assertSame(toUppercase(value), expected);
                });
            }

            toUppercaseTest("", "");
            toUppercaseTest("a", "A");
            toUppercaseTest("B", "B");
        });

        runner.testFunction("toCamelCase(string)", () =>
        {
            function toCamelCaseTest(value: string, expected: string): void
            {
                runner.test(`with ${runner.toString(value)}`, (test: Test) =>
                {
                    test.assertSame(toCamelCase(value), expected);
                });
            }

            toCamelCaseTest("", "");
            toCamelCaseTest("abc", "abc");
            toCamelCaseTest("abcDef", "abcDef");
            toCamelCaseTest("abc def", "abcDef");
            toCamelCaseTest("abc def ghi", "abcDefGhi");
            toCamelCaseTest("abc DEF ghi", "abcDEFGhi");
            toCamelCaseTest("  This is a test  ", "  thisIsATest  ");
            toCamelCaseTest("HTTP", "http");
            toCamelCaseTest("HTTP Client", "httpClient");
            toCamelCaseTest("HTTPClient", "httpclient");
            toCamelCaseTest("httpClient", "httpClient");
            toCamelCaseTest("My HTTP Client", "myHTTPClient");
            toCamelCaseTest("myHTTPClient", "myHTTPClient");
            toCamelCaseTest("First Sentence. Second Sentence", "firstSentence. secondSentence");
            toCamelCaseTest("I Am Trying", "iAmTrying");
            toCamelCaseTest("abcDef ghiJkl", "abcDefGhiJkl");
            toCamelCaseTest("lee7 c0d3", "lee7C0D3");
            toCamelCaseTest("simple3test", "simple3Test");
            toCamelCaseTest("a-kebab-case-example", "aKebabCaseExample");
            toCamelCaseTest("a_snake_case_example", "aSnakeCaseExample");
            toCamelCaseTest("APascalCaseExample", "apascalCaseExample");
            toCamelCaseTest("AnotherPascalCaseExample", "anotherPascalCaseExample");
            toCamelCaseTest("a b  .  c d", "aB  .  cD");
        });

        runner.testFunction("toPascalCase(string)", () =>
        {
            function toPascalCaseTest(value: string, expected: string): void
            {
                runner.test(`with ${runner.toString(value)}`, (test: Test) =>
                {
                    test.assertSame(toPascalCase(value), expected);
                });
            }

            toPascalCaseTest("", "");
            toPascalCaseTest("abc", "Abc");
            toPascalCaseTest("abcDef", "AbcDef");
            toPascalCaseTest("abc def", "AbcDef");
            toPascalCaseTest("abc def ghi", "AbcDefGhi");
            toPascalCaseTest("abc DEF ghi", "AbcDEFGhi");
            toPascalCaseTest("  This is a test  ", "  ThisIsATest  ");
            toPascalCaseTest("HTTP", "HTTP");
            toPascalCaseTest("HTTP Client", "HTTPClient");
            toPascalCaseTest("HTTPClient", "HTTPClient");
            toPascalCaseTest("httpClient", "HttpClient");
            toPascalCaseTest("My HTTP Client", "MyHTTPClient");
            toPascalCaseTest("myHTTPClient", "MyHTTPClient");
            toPascalCaseTest("First Sentence. Second Sentence", "FirstSentence. SecondSentence");
            toPascalCaseTest("I Am Trying", "IAmTrying");
            toPascalCaseTest("abcDef ghiJkl", "AbcDefGhiJkl");
            toPascalCaseTest("lee7 c0d3", "Lee7C0D3");
            toPascalCaseTest("simple3test", "Simple3Test");
            toPascalCaseTest("a-kebab-case-example", "AKebabCaseExample");
            toPascalCaseTest("a_snake_case_example", "ASnakeCaseExample");
            toPascalCaseTest("APascalCaseExample", "APascalCaseExample");
            toPascalCaseTest("AnotherPascalCaseExample", "AnotherPascalCaseExample");
            toPascalCaseTest("a b  .  c d", "AB  .  CD");
        });

        runner.testFunction("toSnakeCase(string)", () =>
        {
            function toSnakeCaseTest(value: string, expected: string): void
            {
                runner.test(`with ${runner.toString(value)}`, (test: Test) =>
                {
                    test.assertSame(toSnakeCase(value), expected);
                });
            }

            toSnakeCaseTest("", "");
            toSnakeCaseTest("abc", "abc");
            toSnakeCaseTest("abcDef", "abc_def");
            toSnakeCaseTest("abc def", "abc_def");
            toSnakeCaseTest("abc def ghi", "abc_def_ghi");
            toSnakeCaseTest("abc DEF ghi", "abc_def_ghi");
            toSnakeCaseTest("  This is a test  ", "  this_is_a_test  ");
            toSnakeCaseTest("  This   is  another   test  ", "  this_is_another_test  ");
            toSnakeCaseTest("HTTP", "http");
            toSnakeCaseTest("HTTP Client", "http_client");
            toSnakeCaseTest("HTTPClient", "httpclient");
            toSnakeCaseTest("httpClient", "http_client");
            toSnakeCaseTest("My HTTP Client", "my_http_client");
            toSnakeCaseTest("myHTTPClient", "my_httpclient");
            toSnakeCaseTest("First Sentence. Second Sentence", "first_sentence. second_sentence");
            toSnakeCaseTest("a b . . . c d", "a_b . . . c_d");
            toSnakeCaseTest("I Am Trying", "i_am_trying");
            toSnakeCaseTest("abcDef ghiJkl", "abc_def_ghi_jkl");
            toSnakeCaseTest("lee7 c0d3", "lee7_c0_d3");
            toSnakeCaseTest("simple3test", "simple3_test");
            toSnakeCaseTest("a-kebab-case-example", "a_kebab_case_example");
            toSnakeCaseTest("a_snake_case_example", "a_snake_case_example");
            toSnakeCaseTest("APascalCaseExample", "apascal_case_example");
            toSnakeCaseTest("AnotherPascalCaseExample", "another_pascal_case_example");
        });

        runner.testFunction("toUpperSnakeCase(string)", () =>
        {
            function toUpperSnakeCaseTest(value: string, expected: string): void
            {
                runner.test(`with ${runner.toString(value)}`, (test: Test) =>
                {
                    test.assertSame(toUpperSnakeCase(value), expected);
                });
            }

            toUpperSnakeCaseTest("", "");
            toUpperSnakeCaseTest("abc", "ABC");
            toUpperSnakeCaseTest("abcDef", "ABC_DEF");
            toUpperSnakeCaseTest("abc def", "ABC_DEF");
            toUpperSnakeCaseTest("abc def ghi", "ABC_DEF_GHI");
            toUpperSnakeCaseTest("abc DEF ghi", "ABC_DEF_GHI");
            toUpperSnakeCaseTest("  This is a test  ", "  THIS_IS_A_TEST  ");
            toUpperSnakeCaseTest("  This   is  another   test  ", "  THIS_IS_ANOTHER_TEST  ");
            toUpperSnakeCaseTest("HTTP", "HTTP");
            toUpperSnakeCaseTest("HTTP Client", "HTTP_CLIENT");
            toUpperSnakeCaseTest("HTTPClient", "HTTPCLIENT");
            toUpperSnakeCaseTest("httpClient", "HTTP_CLIENT");
            toUpperSnakeCaseTest("My HTTP Client", "MY_HTTP_CLIENT");
            toUpperSnakeCaseTest("myHTTPClient", "MY_HTTPCLIENT");
            toUpperSnakeCaseTest("First Sentence. Second Sentence", "FIRST_SENTENCE. SECOND_SENTENCE");
            toUpperSnakeCaseTest("a b . . . c d", "A_B . . . C_D");
            toUpperSnakeCaseTest("I Am Trying", "I_AM_TRYING");
            toUpperSnakeCaseTest("abcDef ghiJkl", "ABC_DEF_GHI_JKL");
            toUpperSnakeCaseTest("lee7 c0d3", "LEE7_C0_D3");
            toUpperSnakeCaseTest("simple3test", "SIMPLE3_TEST");
            toUpperSnakeCaseTest("a-kebab-case-example", "A_KEBAB_CASE_EXAMPLE");
            toUpperSnakeCaseTest("a_snake_case_example", "A_SNAKE_CASE_EXAMPLE");
            toUpperSnakeCaseTest("APascalCaseExample", "APASCAL_CASE_EXAMPLE");
            toUpperSnakeCaseTest("AnotherPascalCaseExample", "ANOTHER_PASCAL_CASE_EXAMPLE");
        });

        runner.testFunction("toKebabCase(string)", () =>
        {
            function toKebabCaseTest(value: string, expected: string): void
            {
                runner.test(`with ${runner.toString(value)}`, (test: Test) =>
                {
                    test.assertSame(toKebabCase(value), expected);
                });
            }

            toKebabCaseTest("", "");
            toKebabCaseTest("abc", "abc");
            toKebabCaseTest("abcDef", "abc-def");
            toKebabCaseTest("abc def", "abc-def");
            toKebabCaseTest("abc def ghi", "abc-def-ghi");
            toKebabCaseTest("abc DEF ghi", "abc-def-ghi");
            toKebabCaseTest("  This is a test  ", "  this-is-a-test  ");
            toKebabCaseTest("  This   is  another   test  ", "  this-is-another-test  ");
            toKebabCaseTest("HTTP", "http");
            toKebabCaseTest("HTTP Client", "http-client");
            toKebabCaseTest("HTTPClient", "httpclient");
            toKebabCaseTest("httpClient", "http-client");
            toKebabCaseTest("My HTTP Client", "my-http-client");
            toKebabCaseTest("myHTTPClient", "my-httpclient");
            toKebabCaseTest("First Sentence. Second Sentence", "first-sentence. second-sentence");
            toKebabCaseTest("a b . . . c d", "a-b . . . c-d");
            toKebabCaseTest("I Am Trying", "i-am-trying");
            toKebabCaseTest("abcDef ghiJkl", "abc-def-ghi-jkl");
            toKebabCaseTest("lee7 c0d3", "lee7-c0-d3");
            toKebabCaseTest("simple3test", "simple3-test");
            toKebabCaseTest("a-kebab-case-example", "a-kebab-case-example");
            toKebabCaseTest("a_snake_case_example", "a-snake-case-example");
            toKebabCaseTest("APascalCaseExample", "apascal-case-example");
            toKebabCaseTest("AnotherPascalCaseExample", "another-pascal-case-example");
        });

        runner.testFunction("toUpperKebabCase(string)", () =>
        {
            function toUpperKebabCaseTest(value: string, expected: string): void
            {
                runner.test(`with ${runner.toString(value)}`, (test: Test) =>
                {
                    test.assertSame(toUpperKebabCase(value), expected);
                });
            }

            toUpperKebabCaseTest("", "");
            toUpperKebabCaseTest("abc", "ABC");
            toUpperKebabCaseTest("abcDef", "ABC-DEF");
            toUpperKebabCaseTest("abc def", "ABC-DEF");
            toUpperKebabCaseTest("abc def ghi", "ABC-DEF-GHI");
            toUpperKebabCaseTest("abc DEF ghi", "ABC-DEF-GHI");
            toUpperKebabCaseTest("  This is a test  ", "  THIS-IS-A-TEST  ");
            toUpperKebabCaseTest("  This   is  another   test  ", "  THIS-IS-ANOTHER-TEST  ");
            toUpperKebabCaseTest("HTTP", "HTTP");
            toUpperKebabCaseTest("HTTP Client", "HTTP-CLIENT");
            toUpperKebabCaseTest("HTTPClient", "HTTPCLIENT");
            toUpperKebabCaseTest("httpClient", "HTTP-CLIENT");
            toUpperKebabCaseTest("My HTTP Client", "MY-HTTP-CLIENT");
            toUpperKebabCaseTest("myHTTPClient", "MY-HTTPCLIENT");
            toUpperKebabCaseTest("First Sentence. Second Sentence", "FIRST-SENTENCE. SECOND-SENTENCE");
            toUpperKebabCaseTest("a b . . . c d", "A-B . . . C-D");
            toUpperKebabCaseTest("I Am Trying", "I-AM-TRYING");
            toUpperKebabCaseTest("abcDef ghiJkl", "ABC-DEF-GHI-JKL");
            toUpperKebabCaseTest("lee7 c0d3", "LEE7-C0-D3");
            toUpperKebabCaseTest("simple3test", "SIMPLE3-TEST");
            toUpperKebabCaseTest("a-kebab-case-example", "A-KEBAB-CASE-EXAMPLE");
            toUpperKebabCaseTest("a_snake_case_example", "A-SNAKE-CASE-EXAMPLE");
            toUpperKebabCaseTest("APascalCaseExample", "APASCAL-CASE-EXAMPLE");
            toUpperKebabCaseTest("AnotherPascalCaseExample", "ANOTHER-PASCAL-CASE-EXAMPLE");
        });
    });
}
test(createTestRunner());