import { Condition } from "./condition";
import { PostConditionError } from "./postConditionError";

/**
 * A type that encapsulates conditions that should exist after an operation has taken place.
 */
export class Post
{
    /**
     * The condition object that can be used to assert post-conditions.
     */
    public static readonly condition: Condition = Condition.create()
        .setCreateErrorFunction((message: string) =>
        {
            return new PostConditionError(message);
        });
}