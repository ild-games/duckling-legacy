///<reference path="../core/Component.ts"/>
declare var $;

module entityframework.components {

    import serialize = util.serialize;
    import observe = framework.observe;

    /**
     * The body types for a CollisionComponent.
     */
    export enum CollisionBodyType {
        /**
         * The entity doesn't have an automatic response to the collision.
         */
        None,

        /**
         * The entity doesn't let other entities pass through it. And isn't moved by other
         * entities.
         */
        Environment,

        /**
         * The entity doesn't let other entities pass through it, but can be moved by other
         * entities.
         */
        Solid
    }

    /**
     * The possible collision types for the game.
     */
    export enum CollisionType {
        None,
        Player,
        Ground
    }

    /**
     * Holds the bindable info for a CollisionComponent.
     */
    class CollisionShapeInfo extends observe.Observable {
        /**
         * Width and height for the collision's bounding box.
         */
        @observe.Object()
        dimension : math.Vector;

        /**
         * Constructs a new CollisionInfo object.
         *
         * @param dimensions Width and height for the collision's bounding box, default value is {0,0}
         */
        constructor(dimensions? : math.Vector) {
            super();

            this.dimension = dimensions || new math.Vector();
        }
    }

    /**
     * Component class for an entity's collision information.
     */
    @serialize.ProvideClass(CollisionComponent, "ild::CollisionComponent")
    export class CollisionComponent extends Component {
        /**
         * Info instance holding the bindable properties.
         */
        @serialize.Key("dimension")
        @observe.Object()
        info : CollisionShapeInfo;

        /**
         * CollisionBodyType for the component.
         */
        @observe.Primitive()
        bodyType : CollisionBodyType;

        /**
         * CollisionType for the component.
         */
        @observe.Primitive()
        collisionType : CollisionType;

        /**
         * Constructs a new CollisionComponent.
         *
         * @param dimensions Width and height of the bounding box, defaults to {0,0}
         * @param bodyType CollisionBodyType for the component, default value is CollisionBodyType.None
         * @param type CollisionType for the component, default value is CollisionType.None
         */
        constructor (dimensions? : math.Vector, bodyType? : CollisionBodyType, type? : CollisionType) {
            super();

            this.info = new CollisionShapeInfo(dimensions);
            this.bodyType = bodyType || CollisionBodyType.None;
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
    class CollisionViewModel extends framework.ViewModel<CollisionComponent> {
        /**
         * Holds the values stored in entityframework.components.CollisionBodyType for binding purposes.
         */
        private bodyTypeVals : Array<number> = [];
        /**
         * Holds the values stored in entityframework.components.CollisionType for binding purposes.
         */
        private typeVals : Array<number> = [];

        /**
         * Called by the view model when the data has been loaded.
         */
        onDataReady() {
            super.onDataReady();

            this.bodyTypeVals = this.ValuesFromEnum(CollisionBodyType);
            this.typeVals = this.ValuesFromEnum(CollisionType);
        }

        /**
         * Call by the view model when the view is ready to be shown.
         */
        onViewReady() {
            super.onViewReady();
            this.initializeSelectPicker();
        }

        /**
         * Pulls out the number values from an enum into an array.
         * @param enumType Enum to get values from.
         * @returns Number values for the enum in an array
         */
        private ValuesFromEnum(enumType) : Array<number> {
            var values = [];
            for (var val in enumType) {
                if (!isNaN(val)) {
                    values.push(val);
                }
            }
            return values;
        }

        /**
         * Sets up the select html tags.
         */
        private initializeSelectPicker() {
            $(this._htmlRoot).find(".selectpicker").selectpicker();
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
        createFormVM() : framework.ViewModel<any> {
            return new CollisionViewModel();
        }

        /**
         * Creates the component object.
         *
         * @returns new instance of CollisionComponent
         */
        createComponent() : entityframework.Component {
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
}
