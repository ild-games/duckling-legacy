
export type MapVersion = string;
export type EditorVersion = string;

export const EDITOR_VERSION : EditorVersion = "0.4";

export interface ParsedVersion {
    major : number,
    minor : number
}

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
export function compareVersions(actualVersion : string, expectedVersion : string) : VersionCompatibility {
    expectedVersion = expectedVersion;
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
 * @param  expectedVersion Version to compare against.
 * @return Brief message explaining the incompatibility or simply describing the versions as compatible
 */
export function incompatibleReason(versionCompatibility : VersionCompatibility, expectedVersion : string) : string {
    switch (versionCompatibility) {
        case VersionCompatibility.Compatible:
            return "Versions are compatible";
        case VersionCompatibility.MajorIncompatible:
        case VersionCompatibility.MinorIncompatible:
            return "Incompatible map version! Map version is greater than the project's version";
        case VersionCompatibility.NoVersionGiven:
            return `Incompatible map version! Editor expects ${expectedVersion} but map has no version`;
    }
    return "";
}

/**
 * Comparator used to sort versions.
 * @return -1 if the leftVersion sorts before the rightVersion, 0 if they are equal, and 1 if the leftVersion sorts to the right of the rightVersion.
 */
export function versionCompareFunction(leftVersion : string, rightVersion : string) {
    let left = _mapVersionParts(leftVersion);
    let right = _mapVersionParts(rightVersion);

    if (left.major < right.major) {
        return -1;
    } else if (right.major < left.major) {
        return 1;
    } else if (left.minor < right.minor) {
        return -1;
    } else if (right.minor < left.minor) {
        return 1;
    } else {
        return 0;
    }
}

export function incrementMajorVersion(mapVersion : string) : MapVersion {
    let versionParts = _mapVersionParts(mapVersion);
    return (versionParts.major + 1) + "." + versionParts.minor;
}

function _mapVersionParts(mapVersion : string) : ParsedVersion {
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
