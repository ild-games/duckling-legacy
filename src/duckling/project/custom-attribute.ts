import {AttributeKey} from '../entitysystem/entity';

export type CustomAttributeValueType = "number" | "string" | "boolean" | CustomAttributeContent | CustomAttributeContent[];
type CustomAttributeContent = {[key : string] : CustomAttributeValueType};

export interface CustomAttribute {
    key: AttributeKey,
    content: CustomAttributeContent
}