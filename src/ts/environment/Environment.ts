module environment {
    /**
     * Model class that contains machine wide information about duckling.
     */
    export class Environment extends framework.observe.SimpleObservable {
        _projects : framework.Project[];

        constructor() {
            super();
        }

    }
}
