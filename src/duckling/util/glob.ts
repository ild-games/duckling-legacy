import * as libGlob from "glob";

export function glob(
    globStr: string,
    options?: any//libGlob.IOptions
): Promise<string[]> {
    return new Promise((resolve, reject) => {resolve(["NOT IMPLEMENTED"])});
    // return new Promise((resolve, reject) => {
    //     libGlob(globStr, null, (error, files) => {
    //         if (error) {
    //             reject(error);
    //         }
    //         resolve(files);
    //     });
    // });
}
