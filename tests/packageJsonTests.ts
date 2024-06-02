import { Test, TestRunner } from "@everyonesoftware/test-typescript";
import { JsonDocument, NotFoundError, PackageJson, ParseError, PreConditionError, WrongTypeError } from "../sources";

export function test(runner: TestRunner): void
{
    runner.testFile("packageJson.ts", () =>
    {
        runner.testType(PackageJson.name, () =>
        {
            runner.testFunction("create()", (test: Test) =>
            {
                const packageJson: PackageJson = PackageJson.create();
                test.assertEqual(packageJson.getDocument(), JsonDocument.create());
            });

            runner.testFunction("parse(string)", () =>
            {
                function parseErrorTest(text: string, expected: Error): void
                {
                    runner.test(`with ${runner.toString(text)}`, (test: Test) =>
                    {
                        test.assertThrows(() => PackageJson.parse(text).await(),
                            expected);
                    });
                }

                parseErrorTest(
                    undefined!,
                    new PreConditionError(
                        "Expression: text",
                        "Expected: not undefined and not null",
                        "Actual: undefined"));
                parseErrorTest(
                    null!,
                    new PreConditionError(
                        "Expression: text",
                        "Expected: not undefined and not null",
                        "Actual: null"));
                parseErrorTest("", new ParseError("Missing JSON value."));

                function parseTest(text: string): void
                {
                    runner.test(`with ${runner.toString(text)}`, (test: Test) =>
                    {
                        const packageJson: PackageJson = PackageJson.parse(text).await();
                        test.assertNotUndefinedAndNotNull(packageJson);
                    });
                }

                parseTest(`{}`);
                parseTest(`{"name": "hello"}`);
            });

            runner.testFunction("getName()", () =>
            {
                function getNameErrorTest(text: string, expected: Error): void
                {
                    runner.test(`with ${runner.toString(text)}`, (test: Test) =>
                    {
                        const packageJson: PackageJson = PackageJson.parse(text).await();
                        test.assertThrows(() => packageJson.getName().await(), expected);
                    });
                }

                getNameErrorTest(`{}`, new NotFoundError(`The key "name" was not found in the map.`));
                getNameErrorTest(`{"name":5}`, new WrongTypeError("Expected JsonString but found JsonNumber."));

                function getNameTest(text: string, expected: string): void
                {
                    runner.test(`with ${runner.toString(text)}`, (test: Test) =>
                    {
                        const packageJson: PackageJson = PackageJson.parse(text).await();
                        test.assertEqual(packageJson.getName().await(), expected);
                    });
                }

                getNameTest(`{"name":"hello"}`, "hello");
            });

            runner.testFunction("getVersion()", () =>
            {
                function getVersionErrorTest(text: string, expected: Error): void
                {
                    runner.test(`with ${runner.toString(text)}`, (test: Test) =>
                    {
                        const packageJson: PackageJson = PackageJson.parse(text).await();
                        test.assertThrows(() => packageJson.getVersion().await(), expected);
                    });
                }

                getVersionErrorTest(`{}`, new NotFoundError(`The key "version" was not found in the map.`));
                getVersionErrorTest(`{"version":false}`, new WrongTypeError("Expected JsonString but found JsonBoolean."));

                function getNameTest(text: string, expected: string): void
                {
                    runner.test(`with ${runner.toString(text)}`, (test: Test) =>
                    {
                        const packageJson: PackageJson = PackageJson.parse(text).await();
                        test.assertEqual(packageJson.getVersion().await(), expected);
                    });
                }

                getNameTest(`{"version":"1.2.3"}`, "1.2.3");
            });

            runner.testFunction("iterateDependencies()", () =>
            {
                function iterateDependenciesErrorTest(text: string, expected: Error): void
                {
                    runner.test(`with ${runner.toString(text)}`, (test: Test) =>
                    {
                        const packageJson: PackageJson = PackageJson.parse(text).await();
                        test.assertThrows(() => packageJson.iterateDependencies().await(), expected);
                    });
                }

                iterateDependenciesErrorTest(`{}`, new NotFoundError(`The key "dependencies" was not found in the map.`));
                iterateDependenciesErrorTest(`{"dependencies":false}`, new WrongTypeError("Expected JsonObject but found JsonBoolean."));

                function iterateDependenciesTest(text: string, expected: [string,string][]): void
                {
                    runner.test(`with ${runner.toString(text)}`, (test: Test) =>
                    {
                        const packageJson: PackageJson = PackageJson.parse(text).await();
                        test.assertEqual(packageJson.iterateDependencies().await().toArray(), expected);
                    });
                }

                iterateDependenciesTest(`{"dependencies":{}}`, []);
                iterateDependenciesTest(
                    `{"dependencies":{"a":"1"}}`,
                    [
                        ["a", "1"],
                    ]);
                iterateDependenciesTest(
                    `{"dependencies":{"a":"1","b":"2"}}`,
                    [
                        ["a", "1"],
                        ["b", "2"],
                    ]);
            });

            runner.testFunction("iterateDevDependencies()", () =>
            {
                function iterateDevDependenciesErrorTest(text: string, expected: Error): void
                {
                    runner.test(`with ${runner.toString(text)}`, (test: Test) =>
                    {
                        const packageJson: PackageJson = PackageJson.parse(text).await();
                        test.assertThrows(() => packageJson.iterateDevDependencies().await(), expected);
                    });
                }

                iterateDevDependenciesErrorTest(`{}`, new NotFoundError(`The key "devDependencies" was not found in the map.`));
                iterateDevDependenciesErrorTest(`{"devDependencies":false}`, new WrongTypeError("Expected JsonObject but found JsonBoolean."));

                function iterateDevDependenciesTest(text: string, expected: [string,string][]): void
                {
                    runner.test(`with ${runner.toString(text)}`, (test: Test) =>
                    {
                        const packageJson: PackageJson = PackageJson.parse(text).await();
                        test.assertEqual(packageJson.iterateDevDependencies().await().toArray(), expected);
                    });
                }

                iterateDevDependenciesTest(`{"devDependencies":{}}`, []);
                iterateDevDependenciesTest(
                    `{"devDependencies":{"a":"1"}}`,
                    [
                        ["a", "1"],
                    ]);
                iterateDevDependenciesTest(
                    `{"devDependencies":{"a":"1","b":"2"}}`,
                    [
                        ["a", "1"],
                        ["b", "2"],
                    ]);
            });
        });
    });
}
test(TestRunner.create());