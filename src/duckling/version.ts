export const VERSION = "0.0.1";
export const MAP_VERSION = "1.1";


type MapVersion = {
    major : string,
    minor : string
};

/**
 * Get the major version for the given map version.
 * @param mapVersion Map version to check, MAP_VERSION will be used if not supplied
 * @return The major version for the given map version
 */
export function majorMapVersion(mapVersion? : string) : string {
    if (mapVersion === null || mapVersion === undefined) {
        mapVersion = MAP_VERSION;
    }

    return _mapVersionParts(mapVersion).major;
}

/**
 * Get the minor version for the given map version.
 * @param mapVersion Map version to check, MAP_VERSION will be used if not supplied
 * @return The minor version for the given map version
 */
export function minorMapVersion(mapVersion? : string) : string {
    if (mapVersion === null || mapVersion === undefined) {
        mapVersion = MAP_VERSION;
    }

    return _mapVersionParts(mapVersion).minor;
}

function _mapVersionParts(mapVersion : string) : MapVersion {
    if (mapVersion === "") {
        throw new Error("map version cannot be blank")
    }

    let mapVersionParts = mapVersion.split(".");
    if (mapVersionParts.length !== 2) {
        throw new Error("map version format must be {MAJOR_NUMBER}.{MINOR_NUMBER}");
    }

    if (!mapVersionParts.every(_isInteger)) {
        throw new Error("Each version portion must be an integer with only digit characters");
    }

    return {
        major: mapVersionParts[0],
        minor: mapVersionParts[1]
    };
}

function _isInteger(input : string) : boolean {
    return /^\d+$/.test(input);
}
