import RivetsViewModel from '../../../framework/RivetsViewModel';
import VMFactory from '../../../framework/VMFactory';
import {ObserveObject, ObservePrimitive} from '../../../framework/observe/ObserveDecorators';
import SimpleObservable from '../../../framework/observe/SimpleObservable';
import * as serialize from '../../../util/serialize/Decorators';
import Component from '../../core/Component';
import ComponentFactory from '../../core/ComponentFactory';
import * as map from '../../core/Map';

import Drawable from './Drawable';
import DrawableFactory from './DrawableFactory';
import DrawableType from './DrawableType';
import DrawableTypeControl from './DrawableTypeControl';
import DrawableTypeToFactory from './DrawableTypeToFactory';

export class DrawableComponent extends Component {
    @ObservePrimitive(String)
    private camEntity : string;

    @ObserveObject()
    topDrawable : Drawable = null;

    collectAssets() : Array<map.Asset> {
        var assets : Array<map.Asset> = [];
        if (this.topDrawable !== null) {
            assets = this.topDrawable.collectAssets();
        }
        return assets;
    }
}

class DrawableViewModel extends RivetsViewModel<DrawableComponent> {
    private drawableTypeControl : DrawableTypeControl;

    get viewFile() : string {
        return 'components/drawable';
    }

    constructor() {
        super();
    }

    onDataReady() {
        super.onDataReady();
    }

    onViewReady() {
        super.onViewReady();
        this.drawableTypeControl = new DrawableTypeControl(
            this,
            "selDrawableType",
            this.addDrawable);

            if (!this.data.topDrawable) {
                $(this.findById("divDrawableType")).removeClass("gone");
            } else {
                this.addTopDrawableVM(DrawableTypeToFactory[DrawableType[this.data.topDrawable.type]]);
            }
        }

    private addDrawable() {
        $(this.findById("divDrawableType")).addClass("gone");
        var drawableFactory = DrawableTypeToFactory[this.drawableTypeControl.pickedDrawable];
        if (drawableFactory) {
            this.data.topDrawable = drawableFactory.createDrawable("topDrawable");
            this.addTopDrawableVM(drawableFactory);
        }
    }

    private addTopDrawableVM(drawableFactory : VMFactory) {
        if (this.data.topDrawable) {
            this.addChildView(
                "drawableVM",
                drawableFactory.createFormVM(),
                this.data.topDrawable);
            }
        }
}

export class DrawableComponentFactory implements ComponentFactory {

    get displayName() {
        return "Drawable";
    }

    get name() {
        return "drawable";
    }

    createFormVM() : RivetsViewModel<any> {
        return new DrawableViewModel();
    }

    createComponent() : Component {
        return new DrawableComponent();
    }
}
