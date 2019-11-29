import { AttributeKey } from "../entitysystem/entity";

import {
    JsonSchema,
    JsonSchemaValue,
    getDefaultForSchema,
} from "../util/json-schema";

export interface CustomAttribute {
    key: AttributeKey;
    content: JsonSchema;
}

export function getDefaultCustomAttributeValue(
    attribute: CustomAttribute
): any {
    return getDefaultForSchema(attribute.content);
}
