module framework {

    interface Setter<T> {
        (value : T) : any;
    }

    class SetterCommand<T> implements command.Command {
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

    /**
     * Create a command that can be used to set and unset a value.
     * Example Use:
     * pushCommand(setter(newName, player.name, (name) => player.name = name));
     *
     * @param newValue The value that is being set.
     * @param oldValue The value that was set.
     * @param setter A function that will take a value and set a value.
     */
    export function setter<T>(newValue : T, oldValue : T, setter : Setter<T>) : framework.command.Command {
        return new SetterCommand(setter, newValue, oldValue);
    }
}
