import { Pre, Test, TestRunner, Type, isFunction } from "../sources";
import { TestSkip } from "../sources/testSkip";
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

    public skip(message?: string): TestSkip
    {
        return TestRunner.skip(this, message);
    }

    public testFile(fileName: string, testAction: () => void): void;
    public testFile(fileName: string, skip: TestSkip | undefined, testAction: () => void): void;
    public testFile(fileName: string, skipOrTestAction: TestSkip | (() => void) | undefined, testAction?: (() => void) | undefined): void
    {
        TestRunner.testFile(this, fileName, skipOrTestAction, testAction);
    }

    public testType(typeNameOrType: string | Type<unknown>, testAction: () => void): void;
    public testType(typeNameOrType: string | Type<unknown>, skip: TestSkip | undefined, testAction: () => void): void;
    public testType(typeNameOrType: string | Type<unknown>, skipOrTestAction: TestSkip | (() => void) | undefined, testAction?: (() => void) | undefined): void
    {
        TestRunner.testType(this, typeNameOrType, skipOrTestAction, testAction);
    }

    public testFunction(functionSignature: string, testAction: () => void): void;
    public testFunction(functionSignature: string, skip: TestSkip | undefined, testAction: () => void): void;
    public testFunction(functionSignature: string, skipOrTestAction: TestSkip | (() => void) | undefined, testAction?: (() => void) | undefined): void
    {
        TestRunner.testFunction(this, functionSignature, skipOrTestAction, testAction);
    }

    public testGroup(testGroupName: string, testAction: () => void): void;
    public testGroup(testGroupName: string, skip: TestSkip | undefined, testAction: () => void): void;
    testGroup(testGroupName: string, skipOrTestAction: TestSkip | undefined | (() => void), testAction?: () => void): void
    {
        Pre.condition.assertNotUndefinedAndNotNull(testGroupName, "testGroupName");
        Pre.condition.assertNotEmpty(testGroupName, "testGroupName");
        let skip: TestSkip | undefined;
        if (isFunction(skipOrTestAction))
        {
            Pre.condition.assertUndefined(testAction, "testAction");

            skip = undefined;
            testAction = skipOrTestAction;
        }
        else
        {
            skip = skipOrTestAction;
        }
        Pre.condition.assertNotUndefinedAndNotNull(testAction, "testAction");

        if (skip === undefined)
        {
            suite(testGroupName, () =>
            {
                testAction();
            });
        }
    }

    public test(testName: string, testAction: (test: Test) => void): void;
    public test(testName: string, skip: TestSkip | undefined, testAction: (test: Test) => void): void;
    test(testName: string, skipOrTestAction: TestSkip | undefined | ((test: Test) => void), testAction?: (test: Test) => void): void
    {
        Pre.condition.assertNotUndefinedAndNotNull(testName, "testName");
        Pre.condition.assertNotEmpty(testName, "testName");
        let skip: TestSkip | undefined;
        if (isFunction(skipOrTestAction))
        {
            Pre.condition.assertUndefined(testAction, "testAction");

            skip = undefined;
            testAction = skipOrTestAction;
        }
        else
        {
            skip = skipOrTestAction;
        }
        Pre.condition.assertNotUndefinedAndNotNull(testAction, "testAction");

        if (skip === undefined)
        {
            test(testName, () =>
            {
                testAction(AssertTest.create());
            });
        }
    }

    public testAsync(testName: string, testAction: (test: Test) => Promise<unknown>): void;
    public testAsync(testName: string, skip: TestSkip | undefined, testAction: (test: Test) => Promise<unknown>): void;
    testAsync(testName: string, skipOrTestAction: TestSkip | undefined | ((test: Test) => Promise<unknown>), testAction?: (test: Test) => Promise<unknown>): void
    {
        Pre.condition.assertNotUndefinedAndNotNull(testName, "testName");
        Pre.condition.assertNotEmpty(testName, "testName");
        let skip: TestSkip | undefined;
        if (isFunction(skipOrTestAction))
        {
            Pre.condition.assertUndefined(testAction, "testAction");

            skip = undefined;
            testAction = skipOrTestAction;
        }
        else
        {
            skip = skipOrTestAction;
        }
        Pre.condition.assertNotUndefinedAndNotNull(testAction, "testAction");

        if (skip === undefined)
        {
            test(testName, async () =>
            {
                await testAction(AssertTest.create());
            });
        }
    }

    public toString(value: unknown): string
    {
        return TestRunner.toString(this, value);
    }
}