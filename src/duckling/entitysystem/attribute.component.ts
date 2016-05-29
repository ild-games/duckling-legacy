import {
    Component,
    ElementRef,
    EventEmitter,
    DynamicComponentLoader,
    ComponentRef,
    Input,
    Output,
    SimpleChange,
    ChangeDetectionStrategy,
    ChangeDetectorRef
} from 'angular2/core';
import {Attribute, AttributeKey} from './entity';
import {AttributeComponentService} from './attribute-component.service';

var logcount = 0;

/**
 * Each attribute has its own component implementation.  This Component is a
 * wrapper that will dynamically instantiate the correct attribute type.
 */
@Component({
    selector: "attribute-component",
    template: "",
    changeDetection : ChangeDetectionStrategy.OnPush,
})
export class AttributeComponent {
    private _childComponent : ComponentRef;

    @Input() key: AttributeKey;
    @Input() attribute: Attribute;

    @Output() attributeChanged : EventEmitter<Attribute> = new EventEmitter();

    constructor(private _attributeComponentService : AttributeComponentService,
                private _dcl : DynamicComponentLoader,
                private _elementRef : ElementRef,
                private _changeDetector : ChangeDetectorRef) {
    }

    ngOnChanges(changes: {[propertyName: string]: SimpleChange}) {
        if (changes["key"]) {
            this.switchToType(changes["key"].currentValue);
        } else if (changes["attribute"] && this._childComponent) {
            this._childComponent.instance.attribute = changes["attribute"].currentValue;
        }
    }

    switchToType(key : AttributeKey) {
        console.log(`Switched ${logcount++}`);
        this._dcl.loadNextToLocation(
            this._attributeComponentService.getComponentType(key),
            this._elementRef
        ).then((ref: ComponentRef) =>  {
            this._childComponent = ref;
            var childInstance : AttributeComponent = this._childComponent.instance;
            childInstance.attribute = this.attribute;
            childInstance.attributeChanged.subscribe((event : Attribute) => this.attributeChanged.emit(event));
            this._detectChanges();
        });
    }

    private _detectChanges() {
        this._changeDetector.markForCheck();
    }
}
