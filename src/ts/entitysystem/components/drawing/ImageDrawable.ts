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
        @serialize.Ignore
        _imageFile : string = "";

        @observe.Primitive(String)
        textureKey : string = "";

        @observe.Primitive(Boolean)
        @serialize.Ignore
        private loaded : boolean = false;

        @observe.Primitive(Boolean)
        isWholeImage : boolean = true;

        @observe.Object()
        private textureRect : math.Rectangle = new math.Rectangle(0, 0, -1, -1);

        @serialize.Ignore
        private _image : HTMLImageElement = null;

        protected generateCanvasDisplayObject(position : math.Vector) : createjs.DisplayObject {
            var bitmap = null;
            if (this.loaded) {
                bitmap = new createjs.Bitmap(this._image);

                var dimensions = new math.Vector(0, 0);
                if (!this.isWholeImage) {
                    dimensions.x = this.textureRect.width;
                    dimensions.y = this.textureRect.height;
                    bitmap.sourceRect = new createjs.Rectangle(
                        this.textureRect.left, this.textureRect.top,
                        this.textureRect.width, this.textureRect.height);
                } else {
                    dimensions.x = this._image.width;
                    dimensions.y = this._image.height;
                }
                bitmap.regX = dimensions.x / 2;
                bitmap.regY = dimensions.y / 2;
            } else {
                this.loadImage();
            }
            return bitmap;
        }

        loadImage() {
            var asset = new map.PNGAsset(this.textureKey);
            if (util.resource.hasAsset(asset)) {
                this._image = <HTMLImageElement>util.resource.getResource(asset);
                this.loaded = true;
            }

            if (this.imageFile && !this._image) {
                this._image = <HTMLImageElement>asset.createDOMElement(this.imageFile);
                this._image.onload = () => { this.onImageLoaded(asset); }
            }
        }

        onImageLoaded(asset : map.PNGAsset) {
            this.loaded = true;
            util.resource.addAsset(asset, this._image);
            if (this.isWholeImage && this.textureRect.width === -1) {
                this.textureRect.width = this._image.width;
                this.textureRect.height = this._image.height;
            }
        }

        collectAssets() : Array<map.Asset> {
            var assets : Array<map.Asset> = [];
            if (this.textureKey !== "") {
                assets.push(new map.PNGAsset(this.textureKey));
            }
            return assets;
        }

        get type() : DrawableType {
            return DrawableType.Image;
        }

        @serialize.Ignore
        get image() : HTMLImageElement {
            return this._image;
        }

        set imageFile(imageFile : string) {
            this._imageFile = imageFile;
            this.loaded = false;
            this._image = null;
        }

        get imageFile() : string {
            return this._imageFile;
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
                this.togglePartialImgPanel(this.data.image !== null, !this.data.isWholeImage);
            });
        }

        onViewReady() {
            this.togglePartialImgPanel(this.data.image !== null, !this.data.isWholeImage);
            $(this.findById("partialImgPanelHeader")).click((event) => {
                this.data.isWholeImage = !this.data.isWholeImage;
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
                        var trimmedFileName = fileName.replace(startDir, "");
                        trimmedFileName = trimmedFileName.substring(0, trimmedFileName.length - ".png".length);
                        this.data.textureKey = trimmedFileName;
                        this.data.imageFile = fileName;
                        this.data.loadImage();
                        this.fileDialog.clearFile();
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
