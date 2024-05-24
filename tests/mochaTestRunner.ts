import { Pre, Test, TestRunner, Type } from "../sources";
import { AssertTest } from "./assertTest";

/**
 * A {@link TestRunner} implementation that passes through to mocha.
 */
export class MochaTestRunner implements TestRunner
{
    protected constructor()
    {
    }

    public static create(): MochaTestRunner
    {
        return new MochaTestRunner();
    }

    public testFile(fileName: string, testFileAction: () => void): void
    {
        TestRunner.testFile(this, fileName, testFileAction);
    }

    public testType(typeNameOrType: string | Type<unknown>, testTypeAction: () => void): void
    {
        TestRunner.testType(this, typeNameOrType, testTypeAction);
    }

    public testFunction(functionSignature: string, testFunctionAction: () => void): void
    {
        TestRunner.testFunction(this, functionSignature, testFunctionAction);
    }

    public testGroup(testGroupName: string, testGroupAction: () => void): void
    {
        Pre.condition.assertNotUndefinedAndNotNull(testGroupName, "testGroupName");
        Pre.condition.assertNotEmpty(testGroupName, "testGroupName");
        Pre.condition.assertNotUndefinedAndNotNull(testGroupAction, "testGroupAction");

        suite(testGroupName, () =>
        {
            testGroupAction();
        });
    }

    public test(testName: string, testAction: (test: Test) => void): void
    {
        Pre.condition.assertNotUndefinedAndNotNull(testName, "testName");
        Pre.condition.assertNotEmpty(testName, "testName");
        Pre.condition.assertNotUndefinedAndNotNull(testAction, "testAction");

        test(testName, () =>
        {
            testAction(AssertTest.create());
        });
    }
}