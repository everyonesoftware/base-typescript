import { andList } from "./english";
import { Iterable } from "./iterable";
import { Pre } from "./pre";
import { escapeAndQuote } from "./strings";
import { Test } from "./test";
import { TestSkip } from "./testSkip";
import { Type, getName, getParameterCount, isFunction, isString } from "./types";

/**
 * A type that can be used to run tests.
 */
export abstract class TestRunner
{
    /**
     * Get a {@link string} that concatenates the {@link string} representation of each
     * of the provided values into an "and-list".
     * @param values The values to concatenate.
     */
    public andList(values: unknown[] | Iterable<unknown>): string
    {
        return TestRunner.andList(this, values);
    }

    /**
     * Get a {@link string} that concatenates the {@link string} representation of each
     * of the provided values into an "and-list".
     * @param values The values to concatenate.
     */
    public static andList(runner: TestRunner, values: unknown[] | Iterable<unknown>): string
    {
        return andList(values.map(runner.toString));
    }

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
        let result: string;
        if (isString(value))
        {
            result = escapeAndQuote(value);
        }
        else
        {
            result = JSON.stringify(value);
        }
        return result;
    }

    /**
     * Create a {@link TestSkip} object that will prevent tests from being run.
     * @param shouldSkip Whether these tests should be skipped.
     * @param message The message that explains why the tests are being skipped.
     */
    public skip(shouldSkip?: boolean, message?: string): TestSkip
    {
        return TestRunner.skip(this, shouldSkip, message);
    }

    /**
     * Create a {@link TestSkip} object that will prevent tests from being run.
     * @param shouldSkip Whether these tests should be skipped.
     * @param message The message that explains why the tests are being skipped.
     */
    public static skip(_runner: TestRunner, shouldSkip?: boolean, message?: string): TestSkip
    {
        return TestSkip.create(shouldSkip, message);
    }

    /**
     * Get whether the tests associated with the provided {@link TestSkip} should be
     * skipped.
     * @param skip The {@link TestSkip} associated with a set of tests.
     */
    public static shouldSkip(skip: TestSkip | undefined): boolean
    {
        return skip?.getShouldSkip() === true;
    }

    /**
     * Get whether the tests associated with the provided {@link TestSkip} should be
     * run.
     * @param skip The {@link TestSkip} associated with a set of tests.
     */
    public static shouldRun(skip: TestSkip | undefined): boolean
    {
        return !TestRunner.shouldSkip(skip);
    }

    public static runTestAction(runner: TestRunner, name: string, skip: TestSkip | undefined, testAction: (() => void) | ((test: Test) => void)): void
    {
        if (getParameterCount(testAction) === 0)
        {
            runner.testGroup(name, skip, <() => void>testAction);
        }
        else
        {
            runner.test(name, skip, <(test: Test) => void>testAction);
        }
    }

    /**
     * Create a test group that will test the provided file.
     * @param fileName The name of the file that is being tested.
     * @param testAction The action that will run the tests.
     */
    public testFile(fileName: string, testAction: (() => void) | ((test: Test) => void)): void;
    /**
     * Create a test group that will test the provided file.
     * @param fileName The name of the file that is being tested.
     * @param skip A value that indicates whether these tests should be skipped.
     * @param testAction The action that will run the tests.
     */
    public testFile(fileName: string, skip: TestSkip | undefined, testAction: (() => void) | ((test: Test) => void)): void;
    testFile(fileName: string, skipOrTestAction: TestSkip | ((() => void) | ((test: Test) => void)) | undefined, testAction?: (() => void) | ((test: Test) => void)): void
    {
        TestRunner.testFile(this, fileName, skipOrTestAction, testAction);
    }

    /**
     * Create a test group that will test the provided file.
     * @param runner The {@link TestRunner} that will run the tests.
     * @param fileName The name of the file that is being tested.
     * @param testAction The action that will run the tests.
     */
    public static testFile(runner: TestRunner, fileName: string, skipOrTestAction: TestSkip | ((() => void) | ((test: Test) => void)) | undefined, testAction?: (() => void) | ((test: Test) => void)): void
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

        TestRunner.runTestAction(runner, fileName, skip, testAction);
    }

    /**
     * Create a test group that will test the provided type.
     * @param type The {@link Type} or name of the type that is being tested.
     * @param testAction The action that will run the tests.
     */
    public testType(typeNameOrType: string | Type<unknown>, testAction: (() => void) | ((test: Test) => void)): void;
    /**
     * Create a test group that will test the provided type.
     * @param type The {@link Type} or name of the type that is being tested.
     * @param skip A value that indicates whether these tests should be skipped.
     * @param testAction The action that will run the tests.
     */
    public testType(typeNameOrType: string | Type<unknown>, skip: TestSkip | undefined, testAction: (() => void) | ((test: Test) => void)): void;
    testType(typeNameOrType: string | Type<unknown>, skipOrTestAction: TestSkip | undefined | ((() => void) | ((test: Test) => void)), testAction?: (() => void) | ((test: Test) => void)): void
    {
        TestRunner.testType(this, typeNameOrType, skipOrTestAction, testAction);
    }

    /**
     * Create a test group that will test the provided type.
     * @param runner The {@link TestRunner} that will run the tests.
     * @param type The {@link Type} or name of the type that is being tested.
     * @param testAction The action that will run the tests.
     */
    public static testType(runner: TestRunner, typeNameOrType: string | Type<unknown>, skipOrTestAction: TestSkip | undefined | ((() => void) | ((test: Test) => void)), testAction: ((() => void) | ((test: Test) => void)) | undefined): void
    {
        Pre.condition.assertNotUndefinedAndNotNull(runner, "runner");
        Pre.condition.assertNotUndefinedAndNotNull(typeNameOrType, "typeNameOrType");
        let typeName: string;
        if (isString(typeNameOrType))
        {
            typeName = typeNameOrType;
        }
        else
        {
            typeName = getName(typeNameOrType);
        }
        Pre.condition.assertNotEmpty(typeName, "typeName");
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

        TestRunner.runTestAction(runner, typeName, skip, testAction);
    }

    /**
     * Create a test group that will test the provided function.
     * @param functionSignature The signature of the function that is being tested.
     * @param testAction The action that will run the tests.
     */
    public testFunction(functionSignature: string, testAction: (() => void) | ((test: Test) => void)): void;
    public testFunction(functionSignature: string, skip: TestSkip | undefined, testAction: (() => void) | ((test: Test) => void)): void;
    testFunction(functionSignature: string, skipOrTestAction: TestSkip | undefined | ((() => void) | ((test: Test) => void)), testAction?: (() => void) | ((test: Test) => void)): void
    {
        TestRunner.testFunction(this, functionSignature, skipOrTestAction, testAction);
    }

    /**
     * Create a test group that will test the provided function.
     * @param runner The {@link TestRunner} that will run the tests.
     * @param functionSignature The signature of the function that is being tested.
     * @param testAction The action that will run the tests.
     */
    public static testFunction(runner: TestRunner, functionSignature: string, skipOrTestAction: TestSkip | undefined | ((() => void) | ((test: Test) => void)), testAction: ((() => void) | ((test: Test) => void)) | undefined): void
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

        TestRunner.runTestAction(runner, functionSignature, skip, testAction);
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