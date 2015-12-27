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

        @observe.Primitive(String)
        imageKey : string = "";

        @observe.Primitive(Boolean)
        private loaded : boolean = false;

        @observe.Primitive(Boolean)
        isPartialImage : boolean = false;

        @observe.Object()
        private partialImageCoords : math.Vector = new math.Vector(0, 0);

        @observe.Object()
        private partialImageDimensions : math.Vector = new math.Vector(-1, -1);

        private image : HTMLImageElement = null;

        protected generateCanvasDisplayObject(position : math.Vector) : createjs.DisplayObject {
            if (!this.imageFile) {
                return null;
            }

            var bitmap = null;
            if (this.loaded) {
                bitmap = new createjs.Bitmap(this.image);

                if (this.isPartialImage) {
                    bitmap.x = -(this.partialImageDimensions.x * this.scale.x / 2);
                    bitmap.y = -(this.partialImageDimensions.y * this.scale.y / 2);
                    bitmap.sourceRect = new createjs.Rectangle(
                        this.partialImageCoords.x, this.partialImageCoords.y,
                        this.partialImageDimensions.x, this.partialImageDimensions.y);
                } else {
                    bitmap.x = -(this.image.width * this.scale.x / 2);
                    bitmap.y = -(this.image.height * this.scale.y / 2);
                }
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
            if (!this.isPartialImage && this.partialImageDimensions.x === -1) {
                this.partialImageDimensions.x = this.image.width;
                this.partialImageDimensions.y = this.image.height;
            }
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

            this.setChangeListener(this.data, (event) => {
                this.togglePartialImgPanel(this.data.imageKey !== "", this.data.isPartialImage);
            });

        }

        onViewReady() {
            $(this.findById("partialImgPanelHeader")).click((event) => {
                this.data.isPartialImage = !this.data.isPartialImage;
            });
        }

        private togglePartialImgPanel(visible : boolean, bodyVisible : boolean) {
            if (visible) {
                $(this.findById("partialImgPanel")).removeClass("gone");
            } else {
                $(this.findById("partialImgPanel")).addClass("gone");
            }


            if (bodyVisible) {
                $(this.findById("partialImgPanelBody")).removeClass("gone");
            } else {
                $(this.findById("partialImgPanelBody")).addClass("gone");
            }
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
                        this.data.imageKey = fileName.replace(startDir, "");
                        this.data.loadImage();
                    }
                }, framework.error.onPromiseError(this._context));
        }

        private isValidResourcePath(file : string) : boolean {
            var resourceDir = this.getResourceDir();
            return file.length >= resourceDir.length && file.substring(0, resourceDir.length) === resourceDir;
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
