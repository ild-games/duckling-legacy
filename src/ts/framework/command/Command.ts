/**
 * An object implementing the Command interface describes an undoable task.
 */
interface Command {
    /**
    * Perform the action encapsulated by the command.
    */
    execute();
    /**
    * Undo the operation performed by the command.
    */
    undo();

    /**
    * When a command is added to the queue this is called on the new command
    * and the last added command is passed as an argument.  If a command is returned,
    * both commands will be removed from the queue and the new command will be
    * @param previousCmd The last command that was added to the queue.
    * @returns Null or a merged command.
    */
    merge?(previousCmd : Command) : Command;
}
export {Command as default}
