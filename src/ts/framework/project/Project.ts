///<reference path="../Context.ts"/>
module framework {
    /**
     * Project class represents an entire game.  It is used to find maps and other files that make up the project.
     */
    @ContextKey("Project")
    export class Project {
        private _rootPath : string;

        /**
         * Create a new project with the given root.
         * @param rootPath The root path of the project.
         */
        constructor(rootPath : string) {
            this._rootPath = rootPath;
        }

        /**
         * Get a path that can be used to load the map.
         * @param mapName Name of the map that a path is needed for.
         */
        getMapPath(mapName : string) {
            return util.path.join(this.getRootPath(),"maps",mapName + ".map");
        }

        //region Getters and Setters
        getRootPath() {
            return this._rootPath;
        }
        //endregion
    }
}
