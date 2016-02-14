import {join} from '../../util/Path';
import ContextKey from '../context/ContextKey';
/**
* Project class represents an entire game.  It is used to find maps and other files that make up the project.
*/
@ContextKey("Project")
export default class Project {
    private _rootPath : string;
    private _projectName : string;

    /**
    * Create a new project with the given root.
    * @param rootPath The root path of the project.
    */
    constructor(projectName : string, rootPath : string) {
        this._rootPath = rootPath;
        this._projectName = projectName;
    }

    /**
    * Get a path that can be used to load the map.
    * @param mapName Name of the map that a path is needed for.
    */
    getMapPath(mapName : string) {
        return join(this.rootPath,"Maps",mapName + ".map");
    }

    //region Getters and Setters
    get rootPath() {
        return this._rootPath;
    }

    get projectName() {
        return this._projectName;
    }
    //endregion
}
