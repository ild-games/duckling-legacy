import {
    Component,
    Input,
    Output,
    EventEmitter
} from 'angular2/core';
import {MD_CARD_DIRECTIVES} from '@angular2-material/card';

import {Entity, AttributeKey, Attribute, KeyedAttribute} from './entity';
import {AttributeComponent} from './attribute.component';


@Component({
    selector: "entity-component",
    directives: [AttributeComponent, MD_CARD_DIRECTIVES],
    template: `
        <div *ngFor="#key of keys()">
            <md-card>
                <md-card-title>{{key}} attribute</md-card-title>
                <md-card-content>
                    <attribute-component
                        [key]="key"
                        [attribute]="entity[key]"
                        (attributeChanged)="onAttributeChanged(key, $event)">
                    </attribute-component>
                </md-card-content>
            </md-card>
        </div>
    `
})
export class EntityComponent {
    @Input() entity : Entity;

    @Output() entityChanged : EventEmitter<Entity> = new EventEmitter();

    keys() {
        return Object.keys(this.entity);
    }

    onAttributeChanged(key : AttributeKey, attribute : Attribute) {
        var entityPatch : any = {};
        entityPatch[key] = attribute;
        this.entityChanged.emit(Object.assign(this.entity, entityPatch));
    }
}
