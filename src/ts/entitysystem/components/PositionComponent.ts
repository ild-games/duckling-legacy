///<reference path="../core/Component.ts"/>
module entityframework.components {

    import observe = framework.observe;
    import serialize = util.serialize;

    export class PositionComponent extends Component {
        @observe.Object()
        position : math.Vector;

        @observe.Object()
        velocity : math.Vector;

        constructor (position? : math.Vector, velocity? : math.Vector) {
            super();
            this.position = position || new math.Vector();
            this.velocity = velocity || new math.Vector();
        }
    }

    class PositionViewModel extends framework.ViewModel<PositionComponent> {
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

        createFormVM():framework.ViewModel<any> {
            return new PositionViewModel();
        }

        createComponent():entityframework.Component {
            return new PositionComponent();
        }
    }
}
