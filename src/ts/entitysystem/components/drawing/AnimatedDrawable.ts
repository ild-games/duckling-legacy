///<reference path="./Drawable.ts"/>
///<reference path="./ContainerDrawable.ts"/>
///<reference path="../../../util/JsonLoader.ts"/>
module entityframework.components.drawing {

    import observe = framework.observe;
    import serialize = util.serialize;

    /**
     * Represents a drawable that uses other drawables to create an animation.
     */
    @serialize.ProvideClass(AnimatedDrawable, "ild::AnimatedDrawable")
    export class AnimatedDrawable extends ContainerDrawable {
        @observe.Object()
        @serialize.Key("frames")
        protected drawables : observe.ObservableArray<Drawable> =
            new observe.ObservableArray<Drawable>();

        @observe.Primitive(Number)
        private duration : number = 1.0;

        @serialize.Ignore
        private timeUntilChange : number = this.duration;

        @observe.Primitive(Number)
        @serialize.Ignore
        private curFrame : number = 0;

        protected generateCanvasDisplayObject(resourceManager : util.resource.ResourceManager) : createjs.DisplayObject {
            this.checkFrameSafety();
            return this.drawables.at(this.curFrame).getCanvasDisplayObject(resourceManager);
        }

        tick(delta : number) {
            super.tick(delta);
            this.timeUntilChange -= delta;
            if (this.timeUntilChange <= 0) {
                this.timeUntilChange += this.duration;
                this.advanceFrame();
            }
        }

        private advanceFrame() {
            this.curFrame++;
            this.checkFrameSafety();
        }

        private checkFrameSafety() {
            if (this.curFrame === this.drawables.length) {
                this.curFrame = 0;
            }
        }

        set frames(frames : observe.ObservableArray<Drawable>) {
            this.drawables = frames;
        }

        get frames() : observe.ObservableArray<Drawable> {
            return this.drawables;
        }

        get type() : DrawableType {
            return DrawableType.Animated;
        }
    }

    export class AnimatedDrawableViewModel extends ContainerDrawableViewModel<AnimatedDrawable> {
        get viewFile() : string {
            return 'drawables/animated_drawable';
        }
    }

    export class AnimatedDrawableFactory implements DrawableFactory {
        createFormVM() : framework.ViewModel<any> {
            return new AnimatedDrawableViewModel();
        }

        createDrawable(key : string) : Drawable {
            return new AnimatedDrawable(key);
        }
    }
}
