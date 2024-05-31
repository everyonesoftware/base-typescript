import { Pre } from "./pre";
import { Test } from "./test";
import { TestSkip } from "./testSkip";
import { Type, getName, isFunction, isString } from "./types";

/**
 * A type that can be used to run tests.
 */
export abstract class TestRunner
{
    /**
     * Get the {@link string} representation of the provided value.
     * @param value The value to get the {@link string} representation of.
     */
    public toString(value: unknown): string
    {
        return TestRunner.toString(this, value);
    }

    /**
     * Get the {@link string} representation of the provided value.
     * @param value The value to get the {@link string} representation of.
     */
    public static toString(_runner: TestRunner, value: unknown): string
    {
        return JSON.stringify(value);
    }

    /**
     * Create a {@link TestSkip} object that will prevent tests from being run.
     * @param message The message that explains why the tests are being skipped.
     */
    public skip(message?: string): TestSkip
    {
        return TestRunner.skip(this, message);
    }

    /**
     * Create a {@link TestSkip} object that will prevent tests from being run.
     * @param message The message that explains why the tests are being skipped.
     */
    public static skip(_runner: TestRunner, message?: string): TestSkip
    {
        return TestSkip.create(message);
    }

    /**
     * Create a test group that will test the provided file.
     * @param fileName The name of the file that is being tested.
     * @param testAction The action that will run the tests.
     */
    public testFile(fileName: string, testAction: () => void): void;
    /**
     * Create a test group that will test the provided file.
     * @param fileName The name of the file that is being tested.
     * @param skip A value that indicates whether these tests should be skipped.
     * @param testAction The action that will run the tests.
     */
    public testFile(fileName: string, skip: TestSkip | undefined, testAction: () => void): void;
    testFile(fileName: string, skipOrTestAction: TestSkip | (() => void) | undefined, testAction?: () => void): void
    {
        TestRunner.testFile(this, fileName, skipOrTestAction, testAction);
    }

    /**
     * Create a test group that will test the provided file.
     * @param runner The {@link TestRunner} that will run the tests.
     * @param fileName The name of the file that is being tested.
     * @param testAction The action that will run the tests.
     */
    public static testFile(runner: TestRunner, fileName: string, skipOrTestAction: TestSkip | (() => void) | undefined, testAction?: () => void): void
    {
        Pre.condition.assertNotUndefinedAndNotNull(runner, "runner");
        Pre.condition.assertNotUndefinedAndNotNull(fileName, "fileName");
        Pre.condition.assertNotEmpty(fileName, "fileName");
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

        runner.testGroup(fileName, skip, testAction);
    }

    /**
     * Create a test group that will test the provided type.
     * @param type The {@link Type} or name of the type that is being tested.
     * @param testAction The action that will run the tests.
     */
    public testType(typeNameOrType: string | Type<unknown>, testAction: () => void): void;
    /**
     * Create a test group that will test the provided type.
     * @param type The {@link Type} or name of the type that is being tested.
     * @param skip A value that indicates whether these tests should be skipped.
     * @param testAction The action that will run the tests.
     */
    public testType(typeNameOrType: string | Type<unknown>, skip: TestSkip | undefined, testAction: () => void): void;
    testType(typeNameOrType: string | Type<unknown>, skipOrTestAction: TestSkip | undefined | (() => void), testAction?: () => void): void
    {
        TestRunner.testType(this, typeNameOrType, skipOrTestAction, testAction);
    }

    /**
     * Create a test group that will test the provided type.
     * @param runner The {@link TestRunner} that will run the tests.
     * @param type The {@link Type} or name of the type that is being tested.
     * @param testAction The action that will run the tests.
     */
    public static testType(runner: TestRunner, typeNameOrType: string | Type<unknown>, skipOrTestAction: TestSkip | undefined | (() => void), testAction: (() => void) | undefined): void
    {
        Pre.condition.assertNotUndefinedAndNotNull(runner, "runner");
        Pre.condition.assertNotUndefinedAndNotNull(typeNameOrType, "typeNameOrType");
        if (!isString(typeNameOrType))
        {
            typeNameOrType = getName(typeNameOrType);
        }
        Pre.condition.assertNotEmpty(typeNameOrType);
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

        runner.testGroup(typeNameOrType, skip, testAction);
    }

    /**
     * Create a test group that will test the provided function.
     * @param functionSignature The signature of the function that is being tested.
     * @param testAction The action that will run the tests.
     */
    public testFunction(functionSignature: string, testAction: () => void): void;
    public testFunction(functionSignature: string, skip: TestSkip | undefined, testAction: () => void): void;
    testFunction(functionSignature: string, skipOrTestAction: TestSkip | undefined | (() => void), testAction?: () => void): void
    {
        TestRunner.testFunction(this, functionSignature, skipOrTestAction, testAction);
    }

    /**
     * Create a test group that will test the provided function.
     * @param runner The {@link TestRunner} that will run the tests.
     * @param functionSignature The signature of the function that is being tested.
     * @param testAction The action that will run the tests.
     */
    public static testFunction(runner: TestRunner, functionSignature: string, skipOrTestAction: TestSkip | undefined | (() => void), testAction: (() => void) | undefined): void
    {
        Pre.condition.assertNotUndefinedAndNotNull(runner, "runner");
        Pre.condition.assertNotUndefinedAndNotNull(functionSignature, "functionSignature");
        Pre.condition.assertNotEmpty(functionSignature);
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

        runner.testGroup(functionSignature, skip, testAction);
    }

    /**
     * Create and run a test group with the provided name.
     * @param testGroupName The name of the test group to run.
     * @param testAction The action that runs the test group.
     */
    public abstract testGroup(testGroupName: string, testAction: () => void): void;
    /**
     * Create and run a test group with the provided name.
     * @param testGroupName The name of the test group to run.
     * @param testAction The action that runs the test group.
     */
    public abstract testGroup(testGroupName: string, skip: TestSkip | undefined, testAction: () => void): void;

    /**
     * Create and run a test with the provided name.
     * @param testName The name of the test to run.
     * @param testAction The action that runs the test.
     */
    public abstract test(testName: string, testAction: (test: Test) => void): void;
    /**
     * Create and run a test with the provided name.
     * @param testName The name of the test to run.
     * @param testAction The action that runs the test.
     */
    public abstract test(testName: string, skip: TestSkip | undefined, testAction: (test: Test) => void): void;

    /**
     * Create and run an async test with the provided name.
     * @param testName The name of the async test to run.
     * @param testAction The action that runs the test.
     */
    public abstract testAsync(testName: string, testAction: (test: Test) => Promise<unknown>): void;
    /**
     * Create and run an async test with the provided name.
     * @param testName The name of the async test to run.
     * @param testAction The action that runs the test.
     */
    public abstract testAsync(testName: string, skip: TestSkip | undefined, testAction: (test: Test) => Promise<unknown>): void;
}