import {
    Component,
    Input,
    Output,
    EventEmitter,
    OnChanges
} from 'angular2/core';
import {MD_CARD_DIRECTIVES} from '@angular2-material/card';

import {immutableAssign} from '../util/model';
import {Entity, AttributeKey, Attribute, TaggedAttribute} from './entity';
import {AttributeComponent} from './attribute.component';

/**
 * Display a form that allows for editting the attributes attached to a component.
 */
@Component({
    selector: "dk-entity-component",
    directives: [AttributeComponent, MD_CARD_DIRECTIVES],
    styleUrls: ['./duckling/entitysystem/entity.component.css'],
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
        this.entityChanged.emit(immutableAssign(this.entity, entityPatch));
    }
}
