/**
 * Module used to perform operations on paths.
 */
module util.Path {
    /**
     * Join an array of paths into a single path.
     * @param pathSegments Array of paths.
     */
    export function join(...pathSegments : string[]) {
        return pathSegments.join("/");
    }
}
