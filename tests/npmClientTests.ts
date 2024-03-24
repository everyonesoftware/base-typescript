import * as assert from "assert";
import { HttpClient, NpmClient, NpmPackageDetails, Pre, PreConditionError, escapeAndQuote } from "../sources";

suite("npmClient.ts", () =>
{
    suite("NpmClient", () =>
    {
        suite("create(HttpClient)", () =>
        {
            test("with undefined", () =>
            {
                assert.throws(() => NpmClient.create(undefined!),
                new PreConditionError(
                    "Expression: httpClient",
                    "Expected: not undefined and not null",
                    "Actual: undefined"));
            });

            test("with null", () =>
            {
                assert.throws(() => NpmClient.create(null!),
                    new PreConditionError(
                        "Expression: httpClient",
                        "Expected: not undefined and not null",
                        "Actual: null"));
            });

            test("with defined", () =>
            {
                const httpClient: HttpClient = HttpClient.create();
                const npmClient: NpmClient = NpmClient.create(httpClient);
                assert.notStrictEqual(npmClient, undefined);
            });
        });
    });
});

export function npmClientTests(creator: (() => NpmClient)): void
{
    Pre.condition.assertNotUndefinedAndNotNull(creator, "creator");

    suite("NpmClient", () =>
    {
        suite("getPackageDetails(string)", () =>
        {
            function getPackageDetailsErrorTest(packageName: string, expected: Error): void
            {
                test(`with ${escapeAndQuote(packageName)}`, async () =>
                {
                    const npmClient: NpmClient = creator();
                    await assert.rejects(() => npmClient.getPackageDetails(packageName),
                        expected);
                });
            }

            getPackageDetailsErrorTest(
                undefined!,
                new PreConditionError(
                    "Expression: packageName",
                    "Expected: not undefined and not null",
                    "Actual: undefined"));
            getPackageDetailsErrorTest(
                null!,
                new PreConditionError(
                    "Expression: packageName",
                    "Expected: not undefined and not null",
                    "Actual: null"));
            getPackageDetailsErrorTest(
                "packagethatdoesntexist",
                new PreConditionError(
                    `The package "packagethatdoesntexist" doesn't exist at https://registry.npmjs.org/packagethatdoesntexist.`));

            function getPackageDetailsTest(packageName: string, expected: NpmPackageDetails): void
            {
                test(`with ${escapeAndQuote(packageName)}`, async () =>
                {
                    const npmClient: NpmClient = creator();
                    const packageDetails: NpmPackageDetails = await npmClient.getPackageDetails(packageName);
                    for (const propertyName of Object.keys(expected))
                    {
                        assert.deepStrictEqual((packageDetails as any)[propertyName], (expected as any)[propertyName]);
                    }
                });
            }

            getPackageDetailsTest(
                "assert",
                NpmPackageDetails.create(
                    "assert",
                    "The assert module from Node.js, for the browser.",
                    [
                        '0.4.9',
                        '1.0.0',
                        '1.0.1',
                        '1.0.2',
                        '1.0.3',
                        '1.1.0',
                        '1.1.1',
                        '1.1.2',
                        '1.2.0',
                        '1.3.0',
                        '1.4.0',
                        '1.4.1',
                        '1.5.0',
                        '2.0.0',
                        '2.1.0',
                        '1.5.1'
                    ]));
            getPackageDetailsTest(
                "c8",
                NpmPackageDetails.create(
                    "c8",
                    "output coverage reports using Node.js' built in coverage",
                    [
                        "1.0.0",
                        "1.0.1",
                        "2.0.0",
                        "3.0.0-alpha.0",
                        "3.0.0-alpha.1",
                        "3.0.0-alpha.3",
                        "3.0.0-alpha.4",
                        "3.0.0-candidate.0",
                        "3.0.0-candidate.1",
                        "3.0.0-candidate.2",
                        "3.0.0",
                        "3.0.1",
                        "3.0.2",
                        "3.0.3",
                        "3.0.4-candidate.0",
                        "3.1.0",
                        "3.2.0",
                        "3.2.1",
                        "3.3.0-candidate.0",
                        "3.3.0-candidate.1",
                        "3.3.0-candidate.2",
                        "3.3.0-candidate.3",
                        "3.3.0",
                        "3.4.0",
                        "3.5.0",
                        "4.0.0-candidate.0",
                        "4.0.0-beta.1",
                        "4.0.0-beta.2",
                        "4.0.0-beta.3",
                        "4.0.0",
                        "4.1.0-candidate.0",
                        "4.1.0",
                        "4.1.1",
                        "4.1.2",
                        "4.1.3",
                        '4.1.4',
                        '4.1.5',
                        '5.0.0',
                        '5.0.1',
                        '5.0.2',
                        '5.0.3',
                        '5.0.4',
                        '6.0.0',
                        '6.0.1',
                        '7.0.0-alpha.0',
                        '7.0.0-beta.0',
                        '7.0.0-candidate.0',
                        '7.0.0',
                        '7.0.1',
                        '7.1.0',
                        '7.1.1-beta.0',
                        '7.1.1',
                        '7.1.2',
                        '7.2.0-beta.0',
                        '7.2.0',
                        '7.2.1',
                        '7.3.0',
                        '7.3.1',
                        '7.3.2',
                        '7.3.3',
                        '7.3.4',
                        '7.3.5-candidate.0',
                        '7.3.5',
                        '7.4.0',
                        '7.5.0',
                        '7.6.0',
                        '7.7.0',
                        '7.7.1',
                        '7.7.2',
                        '7.7.3',
                        '7.8.0',
                        '7.9.0',
                        '7.10.0',
                        '7.11.0',
                        '7.11.1',
                        '7.11.2',
                        '7.11.3',
                        '7.12.0',
                        '7.13.0',
                        '7.14.0',
                        '8.0.0',
                        '8.0.1',
                        '9.0.0',
                        '9.1.0'
                    ]));
        });
    });
}