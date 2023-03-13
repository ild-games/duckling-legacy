/**
 * Rethrow the exception with some context added on.
 * @param  contextMessage  Text that gives the user more information about the error.
 * @param  exception Exception that will be rethrown.
 */
export function rethrow(contextMessage: string, exception: Error) {
    throw new Error(`${contextMessage}\n\n${exception.message}`);
}
