import {onPromiseError} from '../../../framework/error/ErrorHandler';
import {ObserveObject, ObservePrimitive} from '../../../framework/observe/ObserveDecorators';
import SimpleObservable from '../../../framework/observe/SimpleObservable';
import RivetsViewModel from '../../../framework/RivetsViewModel';
import Vector from '../../../math/Vector';
import Rectangle from '../../../math/Rectangle';
import * as serialize from '../../../util/serialize/Decorators';
import {makedirs, isSubOfDir} from '../../../util/Path';
import FileDialog from '../../../util/FileDialog';
import * as map from '../../core/Map';
import ResourceManager from '../../ResourceManager';
import Drawable from './Drawable';
import DrawableType from './DrawableType';
import DrawableFactory from './DrawableFactory';


/**
 * Represents a drawable that can draw an image.
 */
@serialize.ProvideClass(ImageDrawable, "ild::ImageDrawable")
export class ImageDrawable extends Drawable {
    @ObserveObject()
    textureRect : Rectangle = new Rectangle(0, 0, -1, -1);

    @ObservePrimitive(String)
    textureKey : string = "";

    @ObservePrimitive(Boolean)
    isWholeImage : boolean = true;

    constructor(key : string = "") {
        super(key);
    }

    protected generateCanvasDisplayObject(resourceManager : ResourceManager) : createjs.DisplayObject {
        var bitmap = null;
        if (resourceManager.hasAsset(new map.PNGAsset(this.textureKey))) {
            bitmap = new createjs.Bitmap(resourceManager.getResource(new map.PNGAsset(this.textureKey)));

            var dimensions = new Vector(0, 0);
            if (!this.isWholeImage) {
                dimensions.x = this.textureRect.width;
                dimensions.y = this.textureRect.height;
                bitmap.sourceRect = new createjs.Rectangle(
                    this.textureRect.left, this.textureRect.top,
                    this.textureRect.width, this.textureRect.height);
            } else {
                dimensions.x = bitmap.image.width;
                dimensions.y = bitmap.image.height;
            }
            bitmap.regX = dimensions.x / 2;
            bitmap.regY = dimensions.y / 2;
        }
        return bitmap;
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
    get factory() : DrawableFactory {
        return new ImageDrawableFactory();
    }
}

export class ImageDrawableViewModel extends RivetsViewModel<ImageDrawable> {
    private fileDialog : FileDialog;

    get viewFile() : string {
        return 'drawables/image_drawable';
    }

    constructor() {
        super();
        this.registerCallback("partial-header-click", () => this.data.isWholeImage = !this.data.isWholeImage);
    }

    onDataReady() {
        this.registerCallback("open-image-file", this.openImageFile);
        this.loadImage();
        this.fileDialog = this._context.getSharedObjectByKey("FileDialog");

        this.setChangeListener(this.data, (event) => {
            this.togglePartialImgPanel(
                this._context.getSharedObject(ResourceManager).hasAsset(new map.PNGAsset(this.data.textureKey)),
                !this.data.isWholeImage);
        });
    }

    onViewReady() {
        this.togglePartialImgPanel(
            this._context.getSharedObject(ResourceManager).hasAsset(new map.PNGAsset(this.data.textureKey)),
            !this.data.isWholeImage);
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
        makedirs(startDir);
        this.fileDialog.getFileName(startDir, [".png"])
            .then((fileName : string) => {
                if (!isSubOfDir(fileName, this.getResourceDir())) {
                    throw Error("Assets must be opened from directory: " + startDir);
                } else {
                    var trimmedFileName = fileName.replace(startDir, "");
                    trimmedFileName = trimmedFileName.substring(0, trimmedFileName.length - ".png".length);
                    this.data.textureKey = trimmedFileName;
                    this.loadImage(fileName);
                    this.fileDialog.clearFile();
                }
            }, onPromiseError(this._context));
    }

    private loadImage(imageFile? : string) {
        var asset = new map.PNGAsset(this.data.textureKey);
        var resourceManager = this._context.getSharedObject(ResourceManager);
        if (resourceManager.hasAsset(asset)) {
            this.onImageLoaded(asset, new Vector(
                resourceManager.getResource(asset).width,
                resourceManager.getResource(asset).height));
        }

        if (imageFile) {
            var image = <HTMLImageElement>asset.createDOMElement(imageFile);
            image.onload = (() => {
                resourceManager.addResource(asset, image);
                this.onImageLoaded(asset, new Vector(image.width, image.height));
            });
        }
    }

    private onImageLoaded(asset : map.PNGAsset, dimensions : Vector) {
        if (this.data.isWholeImage && this.data.textureRect.width === -1) {
            this.data.textureRect.width = dimensions.x;
            this.data.textureRect.height = dimensions.y;
        }
    }

    private getResourceDir() : string {
        return this._context.getSharedObjectByKey("Project").rootPath + "/resources/";
    }
}

export class ImageDrawableFactory implements DrawableFactory {
    createFormVM() {
        return new ImageDrawableViewModel();
    }

    createDrawable(key : string) {
        return new ImageDrawable(key);
    }
}
