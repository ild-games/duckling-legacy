///<reference path="../../../util/JsonLoader.ts"/>
///<reference path="Drawable.ts"/>
module entityframework.components.drawing {

    import observe = framework.observe;
    import serialize = util.serialize;

    /**
     * Represents a drawable that can contain a collection of drawables.
     */
    @serialize.ProvideClass(Drawable, "ild::ContainerDrawable")
    export class ContainerDrawable extends Drawable {
        @observe.Object()
        private drawables : observe.ObservableArray<Drawable> = new observe.ObservableArray<Drawable>();

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
    }
}
