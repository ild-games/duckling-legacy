import RivetsViewModel from '../../framework/RivetsViewModel';
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

class PositionViewModel extends RivetsViewModel<PositionComponent> {
    get viewFile() : string {
        return "components/position";
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
        return new PositionViewModel();
    }

    createComponent() {
        return new PositionComponent();
    }
}
