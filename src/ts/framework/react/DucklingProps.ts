import Context from "../context/Context";

/**
 * Default props used by controller components.
 */
interface DucklingProps<T> {
    context : Context;
    data? : T;
}

export {DucklingProps as default}
