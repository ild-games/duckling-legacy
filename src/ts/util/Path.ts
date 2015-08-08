/**
 * Module used to perform operations on paths.
 */
module util.Path {
    /**
     *
     * @param pathSegments
     */
    export function join(...pathSegments : string[]) {
        return pathSegments.join("/");
    }
}
