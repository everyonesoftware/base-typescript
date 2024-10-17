import { Condition } from "./condition";
import { PreConditionError } from "./preConditionError";

/**
 * A type that encapsulates conditions that should exist before an operation takes place.
 */
export class Pre
{
    /**
     * The condition object that can be used to assert pre-conditions.
     */
    public static readonly condition: Condition = Condition.create()
        .setCreateErrorFunction((message: string) =>
        {
            return new PreConditionError(message);
        });
}