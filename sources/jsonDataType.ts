import { JsonDataValue } from "./jsonDataValue";

/**
 * The type of values that can be used as a JSON data value.
 */
export type JsonDataType = JsonDataValue | { [propertyName: string]: JsonDataType } | JsonDataType[] | number | boolean | string | null;
