import Command from './Command';

export interface Setter<T> {
    (value : T) : any;
}

/**
 * Create a command that can be used to set and unset a value.
 * Example Use:
 * pushCommand(setter(newName, player.name, (name) => player.name = name));
 *
 * @param newValue The value that is being set.
 * @param oldValue The value that was set.
 * @param setter A function that will take a value and set a value.
 * @param ids An optional array ids used to merge related commands. Two ids are considered equal if they return true for ===.
 */
export function setter<T>(newValue : T, oldValue : T, setter : Setter<T>, ids? : any[]) : Command {
    return new SetterCommand(setter, newValue, oldValue, ids);
}

class SetterCommand<T> implements Command {
    private setter : Setter<T>;
    private newValue : T;
    private oldValue : T;
    ids : any[];

    constructor(setter : Setter<T>, newValue : T, oldValue : T, ids : any[] = []) {
        this.setter = setter;
        this.newValue = newValue;
        this.oldValue = oldValue;
        this.ids = ids;
    }

    execute() {
        this.setter(this.newValue);
    }

    undo() {
        this.setter(this.oldValue);
    }

    merge(previousCmd : SetterCommand<T>) {
        var prevIds = previousCmd.ids;
        var ids = this.ids;

        if (this.isEmpty(prevIds) ||
            prevIds.length !== ids.length ||
            previousCmd.newValue !== this.oldValue) {

            return null;
        }

        for (var i = 0; i < ids.length; i++) {
            if (prevIds[i] !== ids[i]) {
                return null;
            }
        }

        return new SetterCommand(this.setter, this.newValue, previousCmd.oldValue, this.ids);
    }

    private isEmpty(ids : any[]) : boolean {
        return !ids || ids.length === 0;
    }

}
