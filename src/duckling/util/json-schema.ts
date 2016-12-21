export type JsonSchemaValue  = "number" | "string" | "boolean" | JsonSchema | JsonSchema[];
export type JsonSchema = {[key : string] : JsonSchemaValue};

export function getDefaultForSchema(schema : JsonSchema) : any {
    let value : any = {};
    for (let key in schema) {
        value[key] = _defaultValueForType(schema[key]);
    }
    return value;
}

function _defaultValueForType(type : JsonSchemaValue) : any {
    if (type === "number") {
        return 0;
    } else if (type === "string") {
        return "";
    } else if (type === "boolean") {
        return false;
    } else if (Array.isArray(type)) {
        return [];
    } else if (typeof type === "object") {
        return getDefaultForSchema(type);
    }
}