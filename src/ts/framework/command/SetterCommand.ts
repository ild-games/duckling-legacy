module framework {

    interface Setter<T> {
        (value : T) : any;
    }

    export class SetterCommand<T> implements command.Command {
        setter : Setter<T>;
        newValue : T;
        oldValue : T;

        constructor(setter : Setter<T>, newValue : T, oldValue : T) {
            this.setter = setter;
            this.newValue = newValue;
            this.oldValue = oldValue;
        }

        execute() {
            this.setter(this.newValue);
        }

        undo() {
            this.setter(this.oldValue);
        }
    }

    export function setter<T>(newValue : T, oldValue : T, setter : Setter<T>) : framework.command.Command {
        return new SetterCommand(setter, newValue, oldValue);
    }
}
