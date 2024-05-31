import { Iterator, HttpClient, JsonDocument, JsonObject, NotFoundError, NpmClient, NpmPackageDetails, PackageJson, Pre, PreConditionError, DependencyUpdate, Test, TestRunner } from "../sources";
import { MochaTestRunner } from "./mochaTestRunner";

export function test(runner: TestRunner): void
{
    runner.testFile("npmClient.ts", () =>
    {
        runner.testType(NpmClient.name, () =>
        {
            runner.testFunction("create(HttpClient)", () =>
            {
                runner.test("with undefined", (test: Test) =>
                {
                    test.assertThrows(() => NpmClient.create(undefined!),
                        new PreConditionError(
                            "Expression: httpClient",
                            "Expected: not undefined and not null",
                            "Actual: undefined"));
                });

                runner.test("with null", (test: Test) =>
                {
                    test.assertThrows(() => NpmClient.create(null!),
                        new PreConditionError(
                            "Expression: httpClient",
                            "Expected: not undefined and not null",
                            "Actual: null"));
                });

                runner.test("with defined", (test: Test) =>
                {
                    const httpClient: HttpClient = HttpClient.create();
                    const npmClient: NpmClient = NpmClient.create(httpClient);
                    test.assertNotUndefinedAndNotNull(npmClient);
                });
            });

            npmClientTests(runner, () => { return NpmClient.create(HttpClient.create()); });
        });
    });
}
test(MochaTestRunner.create());

export function npmClientTests(runner: TestRunner, creator: (() => NpmClient)): void
{
    Pre.condition.assertNotUndefinedAndNotNull(creator, "creator");

    runner.testType(NpmClient.name, runner.skip(), () =>
    {
        runner.testFunction("getPackageDetails(string)", () =>
        {
            function getPackageDetailsErrorTest(packageName: string, expected: Error): void
            {
                runner.testAsync(`with ${runner.toString(packageName)}`, async (test: Test) =>
                {
                    const npmClient: NpmClient = creator();
                    await test.assertThrowsAsync(() => npmClient.getPackageDetails(packageName),
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
                runner.testAsync(`with ${runner.toString(packageName)}`, async (test: Test) =>
                {
                    const npmClient: NpmClient = creator();
                    const packageDetails: NpmPackageDetails = await npmClient.getPackageDetails(packageName);
                    for (const propertyName of Object.keys(expected))
                    {
                        test.assertEqual((packageDetails as any)[propertyName], (expected as any)[propertyName]);
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

        runner.testFunction("findDependencyUpdates(PackageJson)", () =>
        {
            function findDependencyUpdatesErrorTest(packageJson: PackageJson, expected: Error): void
            {
                runner.testAsync(`with ${runner.toString(packageJson)}`, async (test: Test) =>
                {
                    const npmClient: NpmClient = creator();
                    await test.assertThrowsAsync(async () => await npmClient.findDependencyUpdates(packageJson),
                        expected);
                });
            }

            findDependencyUpdatesErrorTest(
                undefined!,
                new PreConditionError(
                        "Expression: packageJson",
                        "Expected: not undefined and not null",
                        "Actual: undefined"));
            findDependencyUpdatesErrorTest(
                null!,
                new PreConditionError(
                        "Expression: packageJson",
                        "Expected: not undefined and not null",
                        "Actual: null"));
            findDependencyUpdatesErrorTest(
                PackageJson.create(
                    JsonDocument.create(
                        JsonObject.create()
                            .set("dependencies", JsonObject.create()
                                .set("packagethatdoesntexist", "1.2.3")))),
                new NotFoundError(`The package "packagethatdoesntexist" doesn't exist at https://registry.npmjs.org/packagethatdoesntexist.`));
            findDependencyUpdatesErrorTest(
                PackageJson.create(),
                new NotFoundError(`No root has been added.`));
            
            function findDependencyUpdatesTest(packageJson: PackageJson, expected: DependencyUpdate[]): void
            {
                runner.testAsync(`with ${runner.toString(packageJson)}`, async (test: Test) =>
                {
                    const npmClient: NpmClient = creator();
                    const dependencyUpdates: Iterator<DependencyUpdate> = await npmClient.findDependencyUpdates(packageJson);
                    test.assertEqual(dependencyUpdates.toArray(), expected);
                });
            }

            findDependencyUpdatesTest(
                PackageJson.create(JsonDocument.create(JsonObject.create()
                    .set("dependencies", JsonObject.create()
                        .set("@types/assert", "1.5.10")))),
                []);
            findDependencyUpdatesTest(
                PackageJson.create(JsonDocument.create(JsonObject.create()
                    .set("dependencies", JsonObject.create()
                        .set("@types/assert", "1.5.9")))),
                [DependencyUpdate.create("@types/assert", "1.5.9", "1.5.10")]);
            findDependencyUpdatesTest(
                PackageJson.create(JsonDocument.create(JsonObject.create()
                    .set("dependencies", JsonObject.create()
                        .set("@types/assert", "1.5.9")
                        .set("assert", "92.1.0")))),
                [DependencyUpdate.create("@types/assert", "1.5.9", "1.5.10")]);
            findDependencyUpdatesTest(
                PackageJson.create(JsonDocument.create(JsonObject.create()
                    .set("dependencies", JsonObject.create()
                        .set("@types/assert", "1.5.9")
                        .set("assert", "1.1.0")))),
                [
                    DependencyUpdate.create("@types/assert", "1.5.9", "1.5.10"),
                    DependencyUpdate.create("assert", "1.1.0", "2.1.0"),
                ]);
        });
    });
}