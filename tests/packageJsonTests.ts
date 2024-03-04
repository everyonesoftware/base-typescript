import * as assert from "assert";

import { JsonDocument, NotFoundError, PackageJson, ParseError, PreConditionError, WrongTypeError, escapeAndQuote } from "../sources";

suite("packageJson.ts", () =>
{
    suite("PackageJson", () =>
    {
        test("create()", () =>
        {
            const packageJson: PackageJson = PackageJson.create();
            assert.deepStrictEqual(packageJson.getDocument(), JsonDocument.create());
        });

        suite("parse(string)", () =>
        {
            function parseErrorTest(text: string, expected: Error): void
            {
                test(`with ${escapeAndQuote(text)}`, () =>
                {
                    assert.throws(() => PackageJson.parse(text).await(),
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
                test(`with ${escapeAndQuote(text)}`, () =>
                {
                    const packageJson: PackageJson = PackageJson.parse(text).await();
                    assert.notStrictEqual(packageJson, undefined);
                });
            }

            parseTest(`{}`);
            parseTest(`{"name": "hello"}`);
        });

        suite("getName()", () =>
        {
            function getNameErrorTest(text: string, expected: Error): void
            {
                test(`with ${escapeAndQuote(text)}`, () =>
                {
                    const packageJson: PackageJson = PackageJson.parse(text).await();
                    assert.throws(() => packageJson.getName().await(), expected);
                });
            }

            getNameErrorTest(`{}`, new NotFoundError(`The key "name" was not found in the map.`));
            getNameErrorTest(`{"name":5}`, new WrongTypeError("Expected JsonString but found JsonNumber."));

            function getNameTest(text: string, expected: string): void
            {
                test(`with ${escapeAndQuote(text)}`, () =>
                {
                    const packageJson: PackageJson = PackageJson.parse(text).await();
                    assert.strictEqual(packageJson.getName().await(), expected);
                });
            }

            getNameTest(`{"name":"hello"}`, "hello");
        });

        suite("getVersion()", () =>
        {
            function getVersionErrorTest(text: string, expected: Error): void
            {
                test(`with ${escapeAndQuote(text)}`, () =>
                {
                    const packageJson: PackageJson = PackageJson.parse(text).await();
                    assert.throws(() => packageJson.getVersion().await(), expected);
                });
            }

            getVersionErrorTest(`{}`, new NotFoundError(`The key "version" was not found in the map.`));
            getVersionErrorTest(`{"version":false}`, new WrongTypeError("Expected JsonString but found JsonBoolean."));

            function getNameTest(text: string, expected: string): void
            {
                test(`with ${escapeAndQuote(text)}`, () =>
                {
                    const packageJson: PackageJson = PackageJson.parse(text).await();
                    assert.strictEqual(packageJson.getVersion().await(), expected);
                });
            }

            getNameTest(`{"version":"1.2.3"}`, "1.2.3");
        });

        suite("iterateDependencies()", () =>
        {
            function iterateDependenciesErrorTest(text: string, expected: Error): void
            {
                test(`with ${escapeAndQuote(text)}`, () =>
                {
                    const packageJson: PackageJson = PackageJson.parse(text).await();
                    assert.throws(() => packageJson.iterateDependencies().await(), expected);
                });
            }

            iterateDependenciesErrorTest(`{}`, new NotFoundError(`The key "dependencies" was not found in the map.`));
            iterateDependenciesErrorTest(`{"dependencies":false}`, new WrongTypeError("Expected JsonObject but found JsonBoolean."));

            function iterateDependenciesTest(text: string, expected: [string,string][]): void
            {
                test(`with ${escapeAndQuote(text)}`, () =>
                {
                    const packageJson: PackageJson = PackageJson.parse(text).await();
                    assert.deepStrictEqual(packageJson.iterateDependencies().await().toArray(), expected);
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

        suite("iterateDevDependencies()", () =>
        {
            function iterateDevDependenciesErrorTest(text: string, expected: Error): void
            {
                test(`with ${escapeAndQuote(text)}`, () =>
                {
                    const packageJson: PackageJson = PackageJson.parse(text).await();
                    assert.throws(() => packageJson.iterateDevDependencies().await(), expected);
                });
            }

            iterateDevDependenciesErrorTest(`{}`, new NotFoundError(`The key "devDependencies" was not found in the map.`));
            iterateDevDependenciesErrorTest(`{"devDependencies":false}`, new WrongTypeError("Expected JsonObject but found JsonBoolean."));

            function iterateDevDependenciesTest(text: string, expected: [string,string][]): void
            {
                test(`with ${escapeAndQuote(text)}`, () =>
                {
                    const packageJson: PackageJson = PackageJson.parse(text).await();
                    assert.deepStrictEqual(packageJson.iterateDevDependencies().await().toArray(), expected);
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