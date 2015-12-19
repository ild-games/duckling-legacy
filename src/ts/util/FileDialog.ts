module util {

    const FILE_ELEMENT_ID = "hidden-input-for-file-dialog";
    const DIR_ELEMENT_ID = "hidden-input-for-dir-dialog";

    /**
     * Class that is used to start system dialogs for file and directory selection.
     */
    export class FileDialog {
        private fileInputElement : HTMLInputElement;
        private dirInputElement : HTMLInputElement;

        /**
         * Initialize the FileDialog for a specific window.
         * @param window HTML window the file dialog can be used for.
         * @param fileInputElementInput element that is used for triggering the dialog.
         * @param dirInputElementInput element that is used for triggering the dialog.
         */
        constructor(window : Window, fileInputElement? : HTMLInputElement, dirInputElement? : HTMLInputElement) {
            this.fileInputElement = fileInputElement || <HTMLInputElement>window.document.getElementById(FILE_ELEMENT_ID);
            this.dirInputElement = dirInputElement || <HTMLInputElement>window.document.getElementById(DIR_ELEMENT_ID);
        }

        /**
         * Open a file dialog and have the user select a filename.
         * @param fileTypes List of file extensions the user can select.
         * @returns A promise that evaluates to the file's path.
         */
        getFileName(startDir? : string, fileTypes? : string []) {
            this.clearStartDir(this.fileInputElement);
            if (startDir) {
                this.setStartDir(this.fileInputElement, startDir);
            }

            this.clearElementSelectors(this.fileInputElement);

            if (fileTypes) {
                this.attachFileTypesToElement(this.fileInputElement, fileTypes);
            }

            return this.getSelectionPromise(this.fileInputElement);
        }

        clearStartDir(element : HTMLInputElement) {
            element.setAttribute("nwworkingdir", "");
        }

        setStartDir(element : HTMLInputElement, startDir : string) {
            element.setAttribute("nwworkingdir", startDir);
        }

        /**
         * Open a file dialog and have the user select a directory.
         * @returns A promise that evaluates to the directory's path.
         */
        getDirName() {
            return this.getSelectionPromise(this.dirInputElement);
        }

        private attachFileTypesToElement(element : HTMLInputElement, filters : string []) {
            element.setAttribute("accept", filters.join(","));
        }

        private clearElementSelectors(element : HTMLInputElement) {
            element.setAttribute("accept", "");
        }

        private getSelectionPromise(inputElement : HTMLInputElement) : Promise<string> {
            return new Promise(function(resolve, reject) {
                var callback = function() {
                    inputElement.removeEventListener("change", callback);
                    if (inputElement.value) {
                        resolve(inputElement.value.replace("\\","/"));
                    } else {
                        reject();
                    }
                };
                inputElement.addEventListener("change", callback);
                inputElement.click();
            });
        }
    }
}
