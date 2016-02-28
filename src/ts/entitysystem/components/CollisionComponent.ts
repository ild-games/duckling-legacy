import SelectControl from '../../controls/SelectControl';
import {setter} from '../../framework/command/SetterCommand';
import ViewModel from '../../framework/ViewModel';
import {ObserveObject, ObservePrimitive} from '../../framework/observe/ObserveDecorators';
import SimpleObservable from '../../framework/observe/SimpleObservable';
import * as serialize from '../../util/serialize/Decorators';
import {formatToTitleCase, valuesFromEnum} from '../../util/Formatters';
import Vector from '../../math/Vector';
import Component from '../core/Component';
import ComponentFactory from '../core/ComponentFactory';

/**
 * The possible collision types for the game.
 */
export enum CollisionType {
    None,
    Player,
    Ground
}

/**
 * The body types used for collision.
 */
export var BodyType = {
    /**
     * The entity doesn't have an automatic response to the collision.
     */
    NONE: "none",

    /**
     * The entity doesn't let other entities pass through it. And isn't moved by other
     * entities.
     */
    ENVIRONMENT: "environment",

    /**
     * The entity doesn't let other entities pass through it, but can be moved by other
     * entities.
     */
    SOLID: "solid"
}


/**
 * Holds the bindable info for a CollisionComponent.
 */
export class CollisionShapeInfo extends SimpleObservable {
    /**
     * Width and height for the collision's bounding box.
     */
    @ObserveObject()
    dimension : Vector;

    /**
     * Constructs a new CollisionInfo object.
     *
     * @param dimensions Width and height for the collision's bounding box, default value is {0,0}
     */
    constructor(dimensions? : Vector) {
        super();

        this.dimension = dimensions || new Vector();
    }
}

/**
 * Component class for an entity's collision information.
 */
export class CollisionComponent extends Component {

    /**
     * Info instance holding the bindable properties.
     */
    @serialize.Key("dimension")
    @ObserveObject()
    info : CollisionShapeInfo;

    /**
     * CollisionBodyType for the component.
     */
    @ObservePrimitive(String)
    bodyType : string;

    /**
     * CollisionType for the component.
     */
    @ObservePrimitive()
    collisionType : CollisionType;

    /**
     * Constructs a new CollisionComponent.
     *
     * @param dimensions Width and height of the bounding box, defaults to {0,0}
     * @param bodyType Collision body type for the component, default value is "none"
     * @param type CollisionType for the component, default value is CollisionType.None
     */
    constructor (dimensions? : Vector, bodyType? : string, type? : CollisionType) {
        super();

        this.info = new CollisionShapeInfo(dimensions);
        this.bodyType = bodyType || "none";
        this.collisionType = type || CollisionType.None;
    }

    //region Getters and Setters
    set dimension(value) {
        this.info = value;
    }
    get dimension() {
        return this.info;
    }
    //endregion
}

/**
 * View Model for the collision component.
 */
class CollisionViewModel extends ViewModel<CollisionComponent> {
    private typeVals : Array<number> = [];
    private bodyPicker : SelectControl<string>;
    private collisionTypePicker : SelectControl<CollisionType>;

    /**
     * Called by the view model when the data has been loaded.
     */
    onDataReady() {
        super.onDataReady();
        this.setChangeListener(this.data, () => {
            this.updateCollisionType();
        });
    }

    /**
     * Call by the view model when the view is ready to be shown.
     */
    onViewReady() {
        super.onViewReady();

        var typeVals = valuesFromEnum(CollisionType);

        this.collisionTypePicker = new SelectControl<CollisionType>(
            this,
            "collisionPicker",
            typeVals,
            CollisionType[this.data.collisionType]);

        this.collisionTypePicker.callback = (collisionType) => this.onCollisionTypeSelected(this.data, collisionType);

        this.bodyPicker = new SelectControl<string>(
            this,
            "bodyPicker",
            this.generateFormattedBodyTypes(),
            this.formatBodyType(this.data.bodyType));

        this.bodyPicker.callback = (bodyType) => this.onBodySelected(this.data, bodyType);
    }

    updateCollisionType() {
        var pickerValue = this.collisionTypePicker.value;
        var compValue = CollisionType[this.data.collisionType];
        if (pickerValue !== compValue) {
            this.collisionTypePicker.value = compValue;
        }
    }

    private formatBodyType(internal : string) : string {
        return formatToTitleCase(internal);
    }

    private generateFormattedBodyTypes() : { [ s : string ] : string } {
        var bodyTypes : { [ s : string ] : string } = {};
        for (var key in BodyType) {
            var external = this.formatBodyType(BodyType[key]);
            bodyTypes[external] = BodyType[key];
        }
        return bodyTypes;
    }

    private onBodySelected(component : CollisionComponent, bodyType : string) {
        this.pushCommand(setter(
            bodyType,
            component.bodyType,
            (bodyType) => component.bodyType = bodyType));
    }

    private onCollisionTypeSelected(component : CollisionComponent, collisionType : CollisionType) {
        this.pushCommand(setter(
            collisionType,
            component.collisionType,
            (collisionType) => component.collisionType = collisionType));
    }

    //region Getters and Setters
    get viewFile() : string {
        return "components/collision";
    }
    //endregion
}

/**
 * Used to create CollisionComponents
 */
export class CollisionComponentFactory implements ComponentFactory {

    /**
     * Creates the view model associated with a CollisionControl
     *
     * @returns new instance of CollisionViewModel
     */
    createFormVM() : ViewModel<any> {
        return new CollisionViewModel();
    }

    /**
     * Creates the component object.
     *
     * @returns new instance of CollisionComponent
     */
    createComponent() : Component {
        return new CollisionComponent();
    }

    //region Getters and Setters
    get name() {
        return "collision";
    }

    get displayName() {
        return "Collision";
    }
    //endregion
}
