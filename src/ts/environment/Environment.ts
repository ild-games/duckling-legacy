module environment {
    /**
     * Model class that contains machine wide information about duckling.
     */
    export class Environment extends framework.observe.Observable {
        _projects : framework.Project[];

        constructor() {
            super();
        }

    }
}
