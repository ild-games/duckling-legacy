import * as React from "react";
import * as ReactDOM from "react-dom";
import {TextField} from "material-ui";

import DucklingComponent from '../../framework/react/DucklingComponent';
import ReactViewModel from '../../framework/react/ReactViewModel';
import {ObserveObject} from '../../framework/observe/ObserveDecorators';
import Vector from '../../math/Vector';
import Component from '../core/Component';
import ComponentFactory from '../core/ComponentFactory';

export class PositionComponent extends Component {
    @ObserveObject()
    position : Vector;

    @ObserveObject()
    velocity : Vector;

    constructor (position? : Vector, velocity? : Vector) {
        super();
        this.position = position || new Vector();
        this.velocity = velocity || new Vector();
    }
}

class PositionView extends DucklingComponent<PositionComponent, any> {
    onCreate() {
        this.props.data.addChangeListener(() => {
            this.forceUpdate();
        });
    }

    render() {
        return (
            <div>
                <TextField
                    hintText="Position's x coordinate"
                    floatingLabelText="X Position"
                    defaultValue={this.props.data.position.x}
                    onChange={(event) => this.props.data.position.x = (event.target as any).value }
                />
            </div>
        );
    }
}

export class PositionComponentFactory implements ComponentFactory {

    get displayName() {
        return "Position";
    }

    get name() {
        return "position";
    }

    createFormVM() {
        return new ReactViewModel(PositionView);
    }

    createComponent() {
        return new PositionComponent();
    }
}
