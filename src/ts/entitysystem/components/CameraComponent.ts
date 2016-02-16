import ViewModel from '../../framework/ViewModel';
import {ObserveObject, ObservePrimitive} from '../../framework/observe/ObserveDecorators';
import Vector from '../../math/Vector';
import Component from '../core/Component';
import ComponentFactory from '../core/ComponentFactory';

export class CameraComponent extends Component {
    @ObservePrimitive(Number)
    private renderPriority : number;

    @ObservePrimitive(Number)
    private scale : number;

    @ObserveObject()
    private size : Vector;

    @ObservePrimitive(Boolean)
    private default : boolean;

    constructor(size? : Vector, scale? : number, renderPriority? : number, def? : boolean) {
        super();

        this.size = size || new Vector(0, 0);
        this.scale = scale || 1;
        this.renderPriority = renderPriority || 0;
        this.default = def || false;
    }
}

class CameraViewModel extends ViewModel<CameraComponent> {
    get viewFile() : string {
        return "components/camera";
    }
}

export class CameraComponentFactory implements ComponentFactory {

    /**
     * Creates the view model associated with a CameraComponent
     *
     * @returns new instance of CameraViewModel
     */
    createFormVM() : ViewModel<any> {
        return new CameraViewModel();
    }

    /**
     * Creates the component object.
     *
     * @returns new instance of CameraComponent
     */
    createComponent() : Component {
        return new CameraComponent();
    }

    //region Getters and Setters
    get name() {
        return "camera";
    }

    get displayName() {
        return "Camera";
    }
    //endregion
}
