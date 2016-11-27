export const VERSION = "0.0.1";
export const MAP_VERSION = "0.1";


type MapVersion = {
    major : number,
    minor : number
};

export enum VersionCompatibility {
    Compatible,
    MinorIncompatible,
    MajorIncompatible,
    NoVersionGiven
}

/**
 * Compares two versions and determines their compatibility to each other
 * @param  actualVersion   Version to compare to the expected version
 * @param  expectedVersion Version to compare against, defaults to version.ts::MAP_VERSION constant
 * @return VersinoCompatibility describing the two versions compatibility to each other
 */
export function compareVersions(actualVersion : string, expectedVersion? : string) : VersionCompatibility {
    expectedVersion = expectedVersion || MAP_VERSION;
    if (actualVersion === null || actualVersion === undefined) {
        return VersionCompatibility.NoVersionGiven;
    }

    let actualVersionParts = _mapVersionParts(actualVersion);
    let expectedVersionParts = _mapVersionParts(expectedVersion);

    if (actualVersionParts.major !== expectedVersionParts.major) {
        return VersionCompatibility.MajorIncompatible;
    }
    if (actualVersionParts.minor > expectedVersionParts.minor) {
        return VersionCompatibility.MinorIncompatible;
    }
    return VersionCompatibility.Compatible;
}

/**
 * Gives a message describing any incompatibilites in the version number
 * @param  versionCompatibility VersionCompatibility object that describes the compatibility
 * @return Brief message explaining the incompatibility or simply describing the versions as compatible
 */
export function incompatibleReason(versionCompatibility : VersionCompatibility) : string {
    switch (versionCompatibility) {
        case VersionCompatibility.Compatible:
            return "Versions are compatible";
        case VersionCompatibility.MajorIncompatible:
            return "Incompatible map version! Major version mismatch";
        case VersionCompatibility.MinorIncompatible:
            return "Incompatible map version! Map minor version is greater than editor expected minor version";
        case VersionCompatibility.NoVersionGiven:
            return `Incompatible map version! Editor expects ${MAP_VERSION} but map has no version`;
    }
    return "";
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
        major: parseInt(mapVersionParts[0]),
        minor: parseInt(mapVersionParts[1])
    };
}

function _isInteger(input : string) : boolean {
    return /^\d+$/.test(input);
}
