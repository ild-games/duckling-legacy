module entityframework {
    export class Component extends framework.observe.Observable {
        get formViewModel() {
            throw "formViewModel is an abstract getter";
        }
    }
}