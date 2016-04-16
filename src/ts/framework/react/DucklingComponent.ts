import * as React from "react";

import Context from "../context/Context";
import DucklingContext from "./DucklingContext";
import DucklingProps from "./DucklingProps";
import DataObservations from "../observe/DataObservations";

/**
 * A wrapper around the React.Component class.  Used for type safe access
 * to the duckling context.
 */
export default class DucklingComponent<T, State> extends React.Component<DucklingProps<T>, State> {
    protected dataObservations : DataObservations = new DataObservations();

    constructor(props : DucklingProps<T>) {
        super(props);
        this.onCreate();
    }

    protected onCreate() { }

    componentWillUnmount() {
        this.dataObservations.removeChangeListeners();
    }

    get ducklingContext() : Context {
        return this.props.context;
    }
}
