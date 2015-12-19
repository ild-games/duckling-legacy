///<reference path="./Drawable.ts"/>
///<reference path="../../../util/JsonLoader.ts"/>
module entityframework.components.drawing {

    import observe = framework.observe;
    import serialize = util.serialize;

    /**
     * Represents a drawable that can draw an image.
     */
    @serialize.ProvideClass(ImageDrawable, "ild::ImageDrawable")
    export class ImageDrawable extends Drawable {
        @observe.Primitive(String)
        imageFile : string = "";

        image : HTMLImageElement = null;

        @observe.Primitive(Boolean)
        private loaded : boolean = false;

        protected generateCanvasDisplayObject(position : math.Vector) : createjs.DisplayObject {
            if (!this.imageFile) {
                return null;
            }

            var bitmap = null;
            if (this.loaded) {
                bitmap = new createjs.Bitmap(this.image);
                bitmap.x = -(this.image.width / 2);
                bitmap.y = -(this.image.height / 2);
            } else {
                this.loadImage();
            }
            return bitmap;
        }

        loadImage() {
            if (this.imageFile) {
                this.image = document.createElement("img");
                this.image.onload = () => { this.onImageLoaded(); }
                this.image.src = this.imageFile;
            }
        }

        onImageLoaded() {
            this.loaded = true;
        }

        get type() : DrawableType {
            return DrawableType.Image;
        }
    }

    export class ImageDrawableViewModel extends framework.ViewModel<ImageDrawable> {
        private fileDialog : util.FileDialog;

        get viewFile() : string {
            return 'drawables/image_drawable';
        }

        onDataReady() {
            this.registerCallback("open-image-file", this.openImageFile);
            this.data.loadImage();
            this.fileDialog = this._context.getSharedObjectByKey("FileDialog");
        }

        private openImageFile() {
            var startDir = this.getResourceDir();
            this.createResourcesDirectory(startDir);
            this.fileDialog.getFileName(startDir, [".png"])
                .then((fileName : string) => {
                    if (!this.isValidResourcePath(fileName)) {
                        throw Error("Assets must be opened from directory: " + startDir);
                    } else {
                        this.data.imageFile = fileName;
                        this.data.loadImage();
                    }
                }, framework.error.onPromiseError(this._context));
        }

        private isValidResourcePath(file : string) : boolean {
            var resourceDir = this.getResourceDir();
            return file.substring(0, resourceDir.length) === resourceDir;
        }

        private createResourcesDirectory(resDir : string) {
            util.path.makedirs(resDir);
        }

        private getResourceDir() : string {
            return this._context.getSharedObjectByKey("Project").rootPath + "/resources/";
        }
    }

    export class ImageDrawableFactory implements DrawableFactory {
        createFormVM() : framework.ViewModel<any> {
            return new ImageDrawableViewModel();
        }

        createDrawable(key : string) : Drawable {
            return new ImageDrawable(key);
        }
    }
}
