import * as libGlob from "glob";

export function glob(
    globStr: string,
    options?: libGlob.IOptions
): Promise<string[]> {
    return new Promise((resolve, reject) => {
        libGlob(globStr, null, (error, files) => {
            if (error) {
                reject(error);
            }
            resolve(files);
        });
    });
}
