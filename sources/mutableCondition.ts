import { AssertMessageParameters } from "./assertMessageParameters";
import { ConditionBase } from "./conditionBase";
import { EqualFunctions } from "./equalFunctions";
import { ToStringFunctions } from "./toStringFunctions";

/**
 * A collection of condition methods that can be used to assert the state of an application.
 */
export class MutableCondition extends ConditionBase
{
    private toStringFunctions: ToStringFunctions;
    private equalFunctions: EqualFunctions;
    private createErrorFunction: (message: string) => Error;

    protected constructor()
    {
        super();

        this.toStringFunctions = ToStringFunctions.create();
        this.equalFunctions = EqualFunctions.create();
        this.createErrorFunction = MutableCondition.defaultCreateErrorFunction;
    }

    private static defaultCreateErrorFunction(message: string): Error
    {
        return new Error(message);
    }

    /**
     * Create a new {@link MutableCondition} object.
     */
    public static create(): MutableCondition
    {
        return new MutableCondition();
    }

    /**
     * Set the {@link ToStringFunctions} that will be used to convert values to their {@link String}
     * representations.
     * @param toStringFunctions The {@link ToStringFunctions} that will be used to convert values to
     * their {@link String} representations.
     * @returns This object for method chaining.
     */
    public setToStringFunctions(toStringFunctions: ToStringFunctions): this
    {
        this.toStringFunctions = toStringFunctions;
        return this;
    }

    /**
     * Set the {@link EqualFunctions} that will be used to determine if values are equal.
     * @param equalFunctions The {@link EqualFunctions} that will be used to determine if values are
     * equal.
     * @returns This object for method chaining.
     */
    public setEqualFunctions(equalFunctions: EqualFunctions): this
    {
        this.equalFunctions = equalFunctions;
        return this;
    }

    /**
     * Set the {@link Function} that will be used to create {@link Error}s.
     * @param createErrorFunction The {@link Function} to use to create {@link Error}.
     * @returns This object for method chaining.
     */
    public setCreateErrorFunction(createErrorFunction: (message: string) => Error): this
    {
        this.createErrorFunction = createErrorFunction;
        return this;
    }

    public areEqual(left: unknown, right: unknown)
    {
        return this.equalFunctions.areEqual(left, right);
    }

    public toString(value: unknown): string
    {
        return this.toStringFunctions.toString(value);
    }

    public createError(parameters: AssertMessageParameters): Error
    {
        const message: string = ConditionBase.createErrorMessage(parameters);
        return this.createErrorFunction(message);
    }
}