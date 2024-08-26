import { Test, TestRunner } from "@everyonesoftware/test-typescript";
import { JsonDataBoolean, JsonDataType, JsonDataValue, JsonDataNull, PreConditionError } from "../sources";
import { createTestRunner } from "./tests";

export function test(runner: TestRunner): void
{
    runner.testFile("jsonDataValue.ts", () =>
    {
        runner.testType(JsonDataValue.name, () =>
        {
            runner.testFunction("toJsonDataValue(JsonDataType)", () =>
            {
                function toJsonDataValueErrorTest(value: JsonDataType, expected: Error): void
                {
                    runner.test(`with ${runner.toString(value)}`, (test: Test) =>
                    {
                        test.assertThrows(() => JsonDataValue.toJsonDataValue(value), expected);
                    });
                }

                toJsonDataValueErrorTest(undefined!, new PreConditionError(
                    "Expression: value",
                    "Expected: not undefined",
                    "Actual: undefined",
                ));

                function toJsonDataValueTest(value: JsonDataType, expected: JsonDataValue): void
                {
                    runner.test(`with ${runner.toString(value)}`, (test: Test) =>
                    {
                        test.assertEqual(JsonDataValue.toJsonDataValue(value), expected);
                    });
                }

                toJsonDataValueTest(null, JsonDataNull.create());
                toJsonDataValueTest(JsonDataNull.create(), JsonDataNull.create());

                toJsonDataValueTest(false, JsonDataBoolean.create(false));
                toJsonDataValueTest(true, JsonDataBoolean.create(true));
                toJsonDataValueTest(JsonDataBoolean.create(true), JsonDataBoolean.create(true));
            });
        });
    });
}
test(createTestRunner());