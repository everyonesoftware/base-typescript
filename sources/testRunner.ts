import { Pre } from "./pre";
import { Test } from "./test";
import { Type, getName, isString } from "./types";

/**
 * A type that can be used to run tests.
 */
export abstract class TestRunner
{
    /**
     * Create a test group that will test the provided file.
     * @param fileName The name of the file that is being tested.
     * @param testFileAction The action that will run the tests.
     */
    public testFile(fileName: string, testFileAction: () => void): void
    {
        TestRunner.testFile(this, fileName, testFileAction);
    }

    /**
     * Create a test group that will test the provided file.
     * @param runner The {@link TestRunner} that will run the tests.
     * @param fileName The name of the file that is being tested.
     * @param testFileAction The action that will run the tests.
     */
    public static testFile(runner: TestRunner, fileName: string, testFileAction: () => void): void
    {
        Pre.condition.assertNotUndefinedAndNotNull(runner, "runner");
        Pre.condition.assertNotUndefinedAndNotNull(fileName, "fileName");
        Pre.condition.assertNotEmpty(fileName, "fileName");
        Pre.condition.assertNotUndefinedAndNotNull(testFileAction, "testFileAction");

        runner.testGroup(fileName, testFileAction);
    }

    /**
     * Create a test group that will test the provided type.
     * @param type The {@link Type} or name of the type that is being tested.
     * @param testTypeAction The action that will run the tests.
     */
    public testType(typeNameOrType: string | Type<unknown>, testTypeAction: () => void): void
    {
        TestRunner.testType(this, typeNameOrType, testTypeAction);
    }

    /**
     * Create a test group that will test the provided type.
     * @param runner The {@link TestRunner} that will run the tests.
     * @param type The {@link Type} or name of the type that is being tested.
     * @param testTypeAction The action that will run the tests.
     */
    public static testType(runner: TestRunner, typeNameOrType: string | Type<unknown>, testTypeAction: () => void): void
    {
        Pre.condition.assertNotUndefinedAndNotNull(runner, "runner");
        Pre.condition.assertNotUndefinedAndNotNull(typeNameOrType, "typeNameOrType");
        if (!isString(typeNameOrType))
        {
            typeNameOrType = getName(typeNameOrType);
        }
        Pre.condition.assertNotEmpty(typeNameOrType);
        Pre.condition.assertNotUndefinedAndNotNull(testTypeAction, "testTypeAction");

        runner.testGroup(typeNameOrType, testTypeAction);
    }

    /**
     * Create a test group that will test the provided function.
     * @param functionSignature The signature of the function that is being tested.
     * @param testFunctionAction The action that will run the tests.
     */
    public testFunction(functionSignature: string, testFunctionAction: () => void): void
    {
        TestRunner.testFunction(this, functionSignature, testFunctionAction);
    }

    /**
     * Create a test group that will test the provided function.
     * @param runner The {@link TestRunner} that will run the tests.
     * @param functionSignature The signature of the function that is being tested.
     * @param testFunctionAction The action that will run the tests.
     */
    public static testFunction(runner: TestRunner, functionSignature: string, testFunctionAction: () => void): void
    {
        Pre.condition.assertNotUndefinedAndNotNull(runner, "runner");
        Pre.condition.assertNotUndefinedAndNotNull(functionSignature, "functionSignature");
        Pre.condition.assertNotEmpty(functionSignature);
        Pre.condition.assertNotUndefinedAndNotNull(testFunctionAction, "testFunctionAction");

        runner.testGroup(functionSignature, testFunctionAction);
    }

    /**
     * Create and run a test group with the provided name.
     * @param testGroupName The name of the test group to run.
     * @param testGroupAction The action that runs the test group.
     */
    public abstract testGroup(testGroupName: string, testGroupAction: () => void): void;

    /**
     * Create and run a test with the provided name.
     * @param testName The name of the test to run.
     * @param testAction The action that runs the test.
     */
    public abstract test(testName: string, testAction: (test: Test) => void): void;
}