// import { Test, TestRunner } from "@everyonesoftware/test-typescript";
// import { JsonDocument } from "../sources/jsonDocument";
// import { JavascriptIterable, JsonArray, JsonBoolean, JsonNull, JsonNumber, JsonObject, JsonSegment, JsonString, MissingValueParseError, ParseError, PreConditionError, WrongValueParseError, escapeAndQuote } from "../sources";
// import { createTestRunner } from "./tests";

// export function test(runner: TestRunner): void
// {
//     runner.testFile("jsonDocument.ts", () =>
//     {
//         runner.testType(JsonDocument.name, () =>
//         {
//             runner.testFunction("create()", (test: Test) =>
//             {
//                 const json: JsonDocument = JsonDocument.create();
//                 test.assertEqual(json.iterateRoots().toArray(), []);
//             });

//             runner.testFunction("parse(string)", () =>
//             {
//                 function parseErrorTest(text: string, expected: Error): void
//                 {
//                     runner.test(`with ${runner.toString(text)}`, (test: Test) =>
//                     {
//                         test.assertThrows(() => JsonDocument.parse(text).await(), expected);
//                     });
//                 }

//                 parseErrorTest(
//                     undefined!,
//                     new PreConditionError(
//                         "Expression: text",
//                         "Expected: not undefined and not null",
//                         "Actual: undefined",
//                     ));
//                 parseErrorTest(
//                     null!,
//                     new PreConditionError(
//                         "Expression: text",
//                         "Expected: not undefined and not null",
//                         "Actual: null",
//                     ));
//                 parseErrorTest(
//                     ``,
//                     new ParseError(
//                         "Missing JSON value.",
//                     ));
//                 parseErrorTest(
//                     `"`,
//                     new ParseError(
//                         `Missing string end quote: "\\"" (34)`,
//                     ));
//                 parseErrorTest(
//                     `"\t"`,
//                     new ParseError(
//                         `Invalid string character: "\\t" (9)`,
//                     ));
//                 parseErrorTest(
//                     `{`,
//                     new ParseError(
//                         `Missing object property or object closing brace ('}').`,
//                     ));
//                 parseErrorTest(
//                     `  {  `,
//                     new ParseError(
//                         `Missing object property or object closing brace ('}').`,
//                     ));
//                 parseErrorTest(
//                     `{,`,
//                     new ParseError(
//                         `Expected object property or object closing brace ('}'), but found "," instead.`,
//                     ));
//                 parseErrorTest(
//                     `{hello`,
//                     new ParseError(
//                         `Expected "}" or "\\"", but found hello instead.`,
//                     ));
//                 parseErrorTest(
//                     `{"hello`,
//                     new ParseError(
//                         `Missing string end quote: "\\"" (34)`,
//                     ));
//                 parseErrorTest(
//                     `{"hello"`,
//                     new MissingValueParseError("property name/value separator (':')"),
//                 );
//                 parseErrorTest(
//                     `{  "hello"  `,
//                     new MissingValueParseError("property name/value separator (':')"),
//                 );
//                 parseErrorTest(
//                     `{  "hello"  *  `,
//                     new WrongValueParseError("property name/value separator (':')", escapeAndQuote("*")),
//                 );
//                 parseErrorTest(
//                     `{  "hello"  :  `,
//                     new MissingValueParseError("property value"),
//                 );
//                 parseErrorTest(
//                     `{  "hello"  :  ,`,
//                     new WrongValueParseError("property value", escapeAndQuote(",")),
//                 );
//                 parseErrorTest(
//                     `{  "hello"  : "there" `,
//                     new MissingValueParseError("object closing brace ('}')"),
//                 );
//                 parseErrorTest(
//                     `{  "hello"  : "there" "a":1 `,
//                     new ParseError(
//                         `Expected object property separator (',') or object closing brace ('}'), but found "\\"a\\"" instead.`,
//                     ));
//                 parseErrorTest(
//                     `{  "hello"  : "there" , `,
//                     new ParseError(
//                         `Missing object property.`,
//                     ));
//                 parseErrorTest(
//                     `{  "hello"  : "there" , }`,
//                     new ParseError(
//                         `Expected object property, but found "}" instead.`,
//                     ));
//                 parseErrorTest(
//                     `[`,
//                     new ParseError(
//                         `Missing array element or array closing bracket (']').`,
//                     ));
//                 parseErrorTest(
//                     `  [  `,
//                     new ParseError(
//                         `Missing array element or array closing bracket (']').`,
//                     ));
//                 parseErrorTest(
//                     `[hello`,
//                     new ParseError(
//                         `Expected array element or array closing bracket (']'), but found "hello" instead.`,
//                     ));
//                 parseErrorTest(
//                     `["hello`,
//                     new ParseError(
//                         `Missing string end quote: "\\"" (34)`,
//                     ));
//                 parseErrorTest(
//                     `[,`,
//                     new ParseError(
//                         `Expected array element or array closing bracket (']'), but found "," instead.`,
//                     ));
//                 parseErrorTest(
//                     `[false`,
//                     new MissingValueParseError("array closing bracket (']')"),
//                 );
//                 parseErrorTest(
//                     `[false true`,
//                     new ParseError(
//                         `Expected array element separator (',') or array closing bracket (']'), but found "true" instead.`,
//                     ));
//                 parseErrorTest(
//                     `[false,`,
//                     new ParseError(
//                         `Missing array element.`,
//                     ));
//                 parseErrorTest(
//                     `[false,  ]`,
//                     new ParseError(
//                         `Expected array element, but found "]" instead.`,
//                     ));
//                 parseErrorTest(
//                     `[false,,`,
//                     new ParseError(
//                         `Expected array element or array closing bracket (']'), but found "," instead.`,
//                     ));
//                 parseErrorTest(
//                     `false   true`,
//                     new ParseError(
//                         `Unexpected value: true`
//                     ));
//                 parseErrorTest(
//                     `&`,
//                     new ParseError(
//                         `Unexpected value: &`
//                     ));

//                 function parseTest(text: string, expectedRoots: JavascriptIterable<JsonSegment>): void
//                 {
//                     runner.test(`with ${runner.toString(text)}`, (test: Test) =>
//                     {
//                         const expectedDocument: JsonDocument = JsonDocument.create();
//                         for (const root of expectedRoots)
//                         {
//                             expectedDocument.addRoot(root);
//                         }
//                         test.assertEqual(JsonDocument.parse(text).await(), expectedDocument);
//                     });
//                 }

//                 parseTest("null", [JsonNull.create()]);
//                 parseTest("false", [JsonBoolean.create(false)]);
//                 parseTest("true", [JsonBoolean.create(true)]);
//                 parseTest(`""`, [JsonString.create("")]);
//                 parseTest(`"hello"`, [JsonString.create("hello")]);
//                 parseTest(`"\\\""`, [JsonString.create("\\\"")]);
//                 parseTest(`"\\t"`, [JsonString.create("\\t")]);
//                 parseTest(`"\\m"`, [JsonString.create("\\m")]);
//                 parseTest(`5`, [JsonNumber.create(5)]);
//                 parseTest(`{}`, [JsonObject.create()]);
//                 parseTest(` { } `, [JsonObject.create()]);
//                 parseTest(`{"a":1}`, [JsonObject.create().set("a", 1)]);
//                 parseTest(`{"a":[]}`, [JsonObject.create().set("a", JsonArray.create())]);
//                 parseTest(`{"a":{}}`, [JsonObject.create().set("a", JsonObject.create())]);
//                 parseTest(`{"a":"apple"}`, [JsonObject.create().set("a", "apple")]);
//                 parseTest(`{"a":32}`, [JsonObject.create().set("a", 32)]);
//                 parseTest(`{"a":false}`, [JsonObject.create().set("a", false)]);
//                 parseTest(`{"a":1,"b":true}`, [JsonObject.create().set("a", 1).set("b", true)]);
//                 parseTest(`[]`, [JsonArray.create()]);
//                 parseTest(`[[]]`, [JsonArray.create([JsonArray.create()])]);
//                 parseTest(`[{}]`, [JsonArray.create([JsonObject.create()])]);
//                 parseTest(`["abc"]`, [JsonArray.create([JsonString.create("abc")])]);
//                 parseTest(`[true]`, [JsonArray.create([JsonBoolean.create(true)])]);
//                 parseTest(`[null]`, [JsonArray.create([JsonNull.create()])]);
//                 parseTest(`[12345]`, [JsonArray.create([JsonNumber.create(12345)])]);
//                 parseTest(`[1,2,3]`, [JsonArray.create([1, 2, 3])]);
//             });

//             runner.testFunction("addRoot(JsonSegment)", () =>
//             {
//                 function addRootErrorTest(root: JsonSegment, expected: Error): void
//                 {
//                     runner.test(`with ${runner.toString(root)}`, (test: Test) =>
//                     {
//                         const json: JsonDocument = JsonDocument.create();
//                         test.assertThrows(() => json.addRoot(root), expected);
//                         test.assertEqual(json.iterateRoots().toArray(), []);
//                     });
//                 }

//                 addRootErrorTest(
//                     undefined!,
//                     new PreConditionError(
//                         "Expression: root",
//                         "Expected: not undefined and not null",
//                         "Actual: undefined"));
//                 addRootErrorTest(
//                     null!,
//                     new PreConditionError(
//                         "Expression: root",
//                         "Expected: not undefined and not null",
//                         "Actual: null"));

//                 function addRootTest(root: JsonSegment): void
//                 {
//                     runner.test(`with ${runner.toString(root)}`, (test: Test) =>
//                     {
//                         const json: JsonDocument = JsonDocument.create();
//                         const addRootResult: JsonDocument = json.addRoot(root);
//                         test.assertSame(addRootResult, json);
//                         test.assertSame(json.getRoot().await(), root);
//                         test.assertEqual(json.iterateRoots().toArray(), [root]);
//                     });
//                 }

//                 addRootTest(JsonBoolean.create(false));
//                 addRootTest(JsonBoolean.create(true));
//                 addRootTest(JsonNumber.create(1));
//                 addRootTest(JsonString.create("hello"));
//                 addRootTest(JsonObject.create());
//                 addRootTest(JsonArray.create());

//                 runner.test("with multiple roots", (test: Test) =>
//                 {
//                     const json: JsonDocument = JsonDocument.create();
                    
//                     const root1: JsonObject = JsonObject.create();
//                     const addRootResult1: JsonDocument = json.addRoot(root1);
//                     test.assertSame(addRootResult1, json);
//                     test.assertSame(json.getRoot().await(), root1);
//                     test.assertEqual(json.iterateRoots().toArray(), [root1]);

//                     const root2: JsonArray = JsonArray.create();
//                     const addRootResult2: JsonDocument = json.addRoot(root2);
//                     test.assertSame(addRootResult2, json);
//                     test.assertSame(json.getRoot().await(), root1);
//                     test.assertEqual(json.iterateRoots().toArray(), [root1, root2]);
//                 });
//             });
//         });
//     });
// }
// test(createTestRunner());