import * as React from "react";
import * as ReactDOM from "react-dom";

import VectorInputComponent from '../../controls/VectorInputComponent';
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
    componentWillMount() {
        this.dataObservations.setChangeListener(this.props.data, () => {
            this.forceUpdate();
        });
    }

    render() {
        var data = this.props.data;
        var cmdQueue = this.props.context.commandQueue;
        return (
            <div>
                <VectorInputComponent
                    value={data.position}
                    name="Position"
                    onInput={data.position.createSetter(cmdQueue)} />
                <VectorInputComponent
                    value={data.velocity}
                    name="Velocity"
                    onInput={data.velocity.createSetter(cmdQueue)} />
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
