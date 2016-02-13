import Command from '../command/Command';

/**
 * A command that allows changes made by rivets two-way binding to be undone using the
 * command queue.
 */
export default class RivetInputCommand implements Command {
    private _object : any;
    private _keypath : string;
    private _value : any;
    private _oldValue : any;

    /**
     * Construct a command that is used to update an object bound to a rivets input
     * control.
     * @param object The object the input control is bound to.
     * @param keypath The keypath describing the object to be set.
     * @param value The value the object is being set to.
     */
    constructor(object : any, keypath : string, value : any) {
        this._object = object;
        this._keypath = keypath;

        this._value = value;
        this._oldValue = this._object[this._keypath];
    }

    execute() {
        this._object[this._keypath] = this._value;
    }

    undo() {
        this._object[this._keypath] = this._oldValue;
    }

    /**
     * Used to merge a new RivetInputCommand into a previous command in order to allow
     * both commands to be undone with a single ctrl+z.  This prevents users from needing
     * to undo each typed character.
     * @param command The command on the back of the commandQueue.
     * @returns True if the commands were merged.  If they were not merged then the command
     * should be added to the command queue.
     */
    tryMerge(command : Command) {
        if(command instanceof RivetInputCommand) {
           var inputCommand : RivetInputCommand = command;
           if (inputCommand._object === this._object &&
               inputCommand._keypath == this._keypath) {

               inputCommand._value = this._value;
               inputCommand.execute();

               return true;
           }
        }
        return false;
    }

}
