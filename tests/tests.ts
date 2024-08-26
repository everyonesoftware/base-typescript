import { MochaTestRunner } from "@everyonesoftware/mocha-typescript";
import { TestRunner, TestSkip } from "@everyonesoftware/test-typescript";

export function createTestRunner(): TestRunner
{
    return MochaTestRunner.create();
}

export function skipNetworkTests(runner: TestRunner): TestSkip
{
    return runner.skip(true, "Skipping network tests");
}