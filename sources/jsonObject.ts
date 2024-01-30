import { JsonProperty } from "./jsonProperty";
import { JsonSegment } from "./jsonSegment";
import { JsonSegmentType } from "./jsonSegmentType";
import { Map } from "./map";
import { MapDecorator } from "./mapDecorator";
import { Pre } from "./pre";
import { join } from "./strings";
import { isString } from "./types";

export class JsonObject extends MapDecorator<string,JsonSegment> implements JsonSegment
{
    private constructor()
    {
        super(Map.create());
    }

    public static create(): JsonObject
    {
        return new JsonObject();
    }

    public getSegmentType(): JsonSegmentType.Object
    {
        return JsonSegmentType.Object;
    }

    public override toString(): string
    {
        return `{${join(",", this.iterate().map(entry => entry.toString()))}}`;
    }

    public override set(propertyName: string, propertyValue: JsonSegment|number|boolean|string|null): this;
    public override set(property: JsonProperty): this;
    public override set(propertyOrName: string|JsonProperty, propertyValue?: JsonSegment|number|boolean|string|null): this
    {
        let propertyName: string;
        if (propertyValue === undefined)
        {
            Pre.condition.assertNotUndefinedAndNotNull(propertyOrName, "property");
            Pre.condition.assertTrue(propertyOrName instanceof JsonProperty, "property instanceof JsonProperty");
            Pre.condition.assertSame(propertyValue, undefined, "propertyValue");

            const property: JsonProperty = propertyOrName as JsonProperty;
            propertyValue = property.getValue();
            propertyName = property.getName();
        }
        else
        {
            propertyName = propertyOrName as string;
            
            Pre.condition.assertTrue(isString(propertyName), "isString(propertyName)");
            Pre.condition.assertNotUndefinedAndNotNull(propertyName, "propertyName");
            Pre.condition.assertNotEmpty(propertyName, "propertyName");
            Pre.condition.assertNotUndefinedAndNotNull(propertyValue, "propertyValue");

            propertyValue = JsonSegment.toJsonSegment(propertyValue);
        }

        return super.set(propertyName, propertyValue);
    }
}