import { JsonProperty } from "./jsonProperty";
import { JsonSegment } from "./jsonSegment";
import { JsonSegmentType } from "./jsonSegmentType";
import { List } from "./list";
import { ListDecorator } from "./listDecorator";
import { Pre } from "./pre";
import { join } from "./strings";
import { isString } from "./types";

export class JsonObject extends ListDecorator<JsonProperty> implements JsonSegment
{
    private constructor()
    {
        super(List.create());
    }

    public static create(): JsonObject
    {
        return new JsonObject();
    }

    public getType(): JsonSegmentType.Object
    {
        return JsonSegmentType.Object;
    }

    public override toString(): string
    {
        return `{${join(",", this.map(p => p.toString()).toArray())}}`;
    }

    public override add(propertyName: string, propertyValue: JsonSegment): this;
    public override add(property: JsonProperty): this;
    public override add(propertyOrName: string|JsonProperty, propertyValue?: JsonSegment): this
    {
        if (isString(propertyOrName))
        {
            Pre.condition.assertNotEmpty(propertyOrName, "propertyName");
            Pre.condition.assertNotUndefinedAndNotNull(propertyValue, "propertyValue");

            propertyOrName = JsonProperty.create(propertyOrName, propertyValue);
        }
        else
        {
            Pre.condition.assertNotUndefinedAndNotNull(propertyOrName, "property");
        }

        super.add(propertyOrName);

        return this;
    }
}