import * as React from "react";
import * as ReactDOM from "react-dom";

import Observable from "../observe/Observable";
import ViewModel from "../ViewModel";
import DucklingProps from "./DucklingProps";

export default class ReactViewModel<T> extends ViewModel<T> {
    private reactComponent : React.ComponentClass<DucklingProps<T>>;

    constructor(reactComponent : React.ComponentClass<DucklingProps<T>>) {
        super();
        this.reactComponent = reactComponent;
    }

    onDataReady() {
        if (this.data instanceof Observable) {
            this.setChangeListener(<any>this.data, () => {
                if (this._attached) {
                    this.render();
                }
            });
        }
    }

    render() {
        var component = React.createElement(this.reactComponent, {context: this._context, data: this.data});
        ReactDOM.render(
            component,
            this._htmlRoot
        );
    }

    detach() {
        ReactDOM.unmountComponentAtNode(this._htmlRoot);
    }
}
