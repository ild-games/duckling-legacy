import {Component, ElementRef, DynamicComponentLoader, ComponentRef, Input, SimpleChange} from 'angular2/core';
import {Attribute, AttributeKey} from './entity';
import {AttributeComponentService} from './attribute-component.service';

var logcount = 0;

@Component({
    selector: "attribute-component",
    template: ""
})
export class AttributeComponent {
    private _childComponent : ComponentRef;

    @Input() key: AttributeKey;
    @Input() attribute: Attribute;

    constructor(private _attributeComponentService : AttributeComponentService,
                private _dcl : DynamicComponentLoader,
                private _elementRef : ElementRef) {

    }

    ngOnChanges(changes: {[propertyName: string]: SimpleChange}) {
        if (changes["key"]) {
            this.switchToType(changes["key"].currentValue);
        }
    }

    switchToType(key : AttributeKey) {
        console.log(`Switched ${logcount++}`);
        this._dcl.loadNextToLocation(
            this._attributeComponentService.getComponentType(key),
            this._elementRef
        ).then((ref: ComponentRef) =>  {
            this._childComponent = ref;
            this._childComponent.instance.attribute = this.attribute;
        });
    }
}
