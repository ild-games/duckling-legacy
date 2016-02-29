import SelectControl from '../../../controls/SelectControl';
import Command from '../../../framework/command/Command';
import DataChangeEvent from '../../../framework/observe/DataChangeEvent';
import {ObserveObject} from '../../../framework/observe/ObserveDecorators';
import {ObservableArray, ObservableArrayChanged} from '../../../framework/observe/ObservableArray';
import RivetsViewModel from '../../../framework/RivetsViewModel';
import * as serialize from '../../../util/serialize/Decorators';
import * as map from '../../core/Map';
import ResourceManager from '../../ResourceManager';
import BaseDrawableViewModel from './BaseDrawableViewModel';
import Drawable from './Drawable';
import DrawableFactory from './DrawableFactory';
import DrawableType from './DrawableType';
import DrawableTypeToFactory from './DrawableTypeToFactory';
import DrawableTypeControl from './DrawableTypeControl';
import {ShapeDrawableFactory} from './ShapeDrawable';
import {ImageDrawableFactory} from './ImageDrawable';

/**
 * Represents a drawable that can contain a collection of drawables.
 */
@serialize.ProvideClass(ContainerDrawable, "ild::ContainerDrawable")
export class ContainerDrawable extends Drawable {
    @ObserveObject()
    private drawables : ObservableArray<Drawable> = new ObservableArray<Drawable>();

    constructor(key : string) {
        super(key);
    }

    addDrawable(drawable : Drawable) {
        this.drawables.push(drawable);
    }

    removeDrawable(drawable : Drawable) {
        this.drawables.remove(drawable);
    }

    removeDrawableByKey(drawableKey : string) {
        var drawable = this.getDrawable(drawableKey);
        if (drawable) {
            this.removeDrawable(drawable);
        }
    }

    getDrawable(key : string) : Drawable {
        var toReturn = null;
        this.forEach((drawable) => {
            if (drawable.key === key) {
                toReturn = drawable;
            }
        });
        return toReturn;
    }

    forEach(func : (object : Drawable) => void) {
        this.drawables.forEach(func);
    }

    protected generateCanvasDisplayObject(resourceManager : ResourceManager) : createjs.DisplayObject {
        var container = null;
        if (this.drawables.length > 0) {
            container = new createjs.Container();
            this.forEach((drawable) => {
                container.addChild(drawable.getCanvasDisplayObject(resourceManager));
            });
        }
        return container;
    }

    collectAssets() : Array<map.Asset> {
        var assets : Array<map.Asset> = [];
        this.forEach((drawable) => {
            drawable.collectAssets().forEach((asset) => {
                assets.push(asset);
            });
        });
        return assets;
    }

    get length() : number {
        return this.drawables.length;
    }

    get type() : DrawableType {
        return DrawableType.Container;
    }

    @serialize.Ignore
    get factory() : DrawableFactory {
        return new ContainerDrawableFactory();
    }
}

export class ContainerDrawableViewModel extends BaseDrawableViewModel<ContainerDrawable> {
    private drawablePicker : SelectControl<Drawable>
    private drawableTypeControl : DrawableTypeControl;

    get viewFile() : string {
        return 'drawables/container_drawable';
    }

    constructor() {
        super();
        this.registerCallback("delete-drawable", this.deleteSelectedDrawable);
    }

    onViewReady() {
        super.onViewReady();

        this.drawableTypeControl = new DrawableTypeControl(
            this,
            "selDrawableType",
            this.addDrawable);
        this.drawablePicker = new SelectControl<Drawable>(this, "drawableSelect", this.getDrawables(), "");
        this.drawablePicker.callback = (drawable) => this.attachSelectedDrawableVM(drawable);

        if (this.isWhite) {
            var vmJqueryObject = $(this.findById("containerSelDrawableVM"));
            vmJqueryObject.removeClass("container-sel-drawable-vm");
            vmJqueryObject.addClass("non-white-container-sel-drawable-vm");
        }
    }

    onDataReady() {
        super.onDataReady();
        this.setChangeListener(this.data, (event) => {
            this.onDataObjChildModified(event);
        });
    }

    onDataObjChildModified(event : DataChangeEvent) {
        if (!event.child) {
            return;
        }

        var drawablesEvent = <ObservableArrayChanged<Drawable>>event.child;
        if (drawablesEvent.isItemRemoved) {
            this.onDrawableRemoved(this.drawablePicker.value);
        }
        if (drawablesEvent.isItemAdded) {
            this.onDrawableAdded(drawablesEvent.item.key);
        }
    }

    onDrawableRemoved(removedDrawableKey : string) {
        this.removeChildViews();
        this.updateDrawablePicker();
        $(this.findById("sectionSelDrawableVM")).addClass("gone");
    }

    onDrawableAdded(addedDrawableKey : string) {
        this.removeChildViews();
        if (this.data.getDrawable(addedDrawableKey)) {
            this.updateDrawablePicker();
            this.attachSelectedDrawableVM(this.data.getDrawable(addedDrawableKey));
            this.drawablePicker.value = addedDrawableKey;
        }
    }

    deleteSelectedDrawable() {
        if (this.data.getDrawable(this.drawablePicker.value)) {
            this._context.commandQueue.pushCommand(
                new DeleteDrawableCommand(this.data, this.drawablePicker.value));
        }
    }

    addDrawable() {
        var drawableFactory = DrawableTypeToFactory[this.drawableTypeControl.pickedDrawable];
        if (drawableFactory) {
            var nextKey = this.nextKey(this.drawableTypeControl.pickedDrawable);
            this._context.commandQueue.pushCommand(
                new AddDrawableCommand(
                    this.data,
                    nextKey,
                    drawableFactory.createDrawable(nextKey)));
        }
    }

    private attachSelectedDrawableVM(drawable : Drawable) {
        var drawableVM : BaseDrawableViewModel<any> = <BaseDrawableViewModel<any>>drawable.factory.createFormVM();
        drawableVM.isWhite = !this.isWhite;
        $(this.findById("sectionSelDrawableVM")).removeClass("gone");
        this.removeChildViews();
        this.addChildView(
            "selDrawableVM",
            drawableVM,
            drawable);
    }

    private nextKey(drawableType : string) : string {
        var key = 0;
        while (this.data.getDrawable(drawableType + key)) key++;
        return drawableType + key;
    }

    private updateDrawablePicker() {
        this.drawablePicker.values = this.getDrawables();
    }

    private getDrawables() {
        var drawables : {[s:string] : Drawable} = {};
        this.data.forEach((drawable) => {
            drawables[drawable.key] = drawable;
        });
        return drawables;
    }
}

class DeleteDrawableCommand implements Command {
    private _containerDrawable: ContainerDrawable;
    private _drawableName: string;
    private _drawable: Drawable;

    constructor(containerDrawable : ContainerDrawable, drawableName : string) {
        this._containerDrawable = containerDrawable;
        this._drawableName = drawableName;
    }

    execute() {
        this._drawable = this._containerDrawable.getDrawable(this._drawableName);
        if (this._drawable) {
            this._containerDrawable.removeDrawable(this._drawable);
        }
    }

    undo() {
        this._containerDrawable.addDrawable(this._drawable);
    }
}

class AddDrawableCommand implements Command {
    private _containerDrawable: ContainerDrawable;
    private _drawableName: string;
    private _drawableToAdd : Drawable;

    constructor(containerDrawable : ContainerDrawable, drawableName : string, drawableToAdd : Drawable) {
        this._containerDrawable = containerDrawable;
        this._drawableName = drawableName;
        this._drawableToAdd = drawableToAdd;
    }

    execute() {
        this._containerDrawable.addDrawable(this._drawableToAdd);
    }

    undo() {
        this._containerDrawable.removeDrawableByKey(this._drawableName);
    }
}

export class ContainerDrawableFactory implements DrawableFactory {
    createFormVM() {
        return new ContainerDrawableViewModel();
    }

    createDrawable(key : string) {
        return new ContainerDrawable(key);
    }
}
