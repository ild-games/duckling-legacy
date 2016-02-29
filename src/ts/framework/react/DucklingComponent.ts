import Context from "../context/Context";
import DucklingContext from "./DucklingContext";
import DucklingProps from "./DucklingProps";

/**
 * A wrapper around the React.Component class.  Used for type safe access
 * to the duckling context.
 * @type {[type]}
 */
export default class DucklingComponent<T, State> extends React.Component<DucklingProps<T>, State> {
    constructor(props : DucklingProps<T>) {
        super(props);
        this.onCreate();
    }

    protected onCreate() { }

    get ducklingContext() : Context {
        return this.props.context;
    }
}
