import {
    Input,
    EventEmitter,
    TemplateRef,
    Directive,
    ViewContainerRef,
    EmbeddedViewRef,
    OnChanges,
    SimpleChange
} from '@angular/core';

/**
 * Wraps a template to be used in a list of templates. Exposes the wrapped element used as the
 * template and the index of the template in the list. See accordian.component.ts for an example.
 */
@Directive({
    selector: '[templateWrapper]'
})
export class TemplateWrapper implements OnChanges {
    private _embeddedViewRef : EmbeddedViewRef<any>

    @Input() wrappedElement : any;
    @Input() index : any;
    @Input() templateWrapper : TemplateRef<any>;

    constructor(private _viewContainer : ViewContainerRef) {
    }

    ngOnChanges(changes : {[key : string] : SimpleChange}) {
        if (changes['templateWrapper']) {
            if (this._embeddedViewRef) {
                this._embeddedViewRef.destroy();
            }
            this._embeddedViewRef = this._viewContainer.createEmbeddedView(this.templateWrapper, {
                element: this.wrappedElement,
                index: this.index
            });
        }

        if (this._embeddedViewRef) {
            this._embeddedViewRef.context.element = this.wrappedElement;
            this._embeddedViewRef.context.index = this.index;
        }
    }
}
