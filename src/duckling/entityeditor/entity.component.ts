import {
    Component,
    Input,
    Output,
    EventEmitter,
    OnChanges,
    ChangeDetectionStrategy
} from '@angular/core';

import {Entity, AttributeKey, Attribute, TaggedAttribute}  from '../entitysystem';
import {immutableAssign, immutableDelete, toTitleCase} from '../util';

import {AttributeComponent} from '../entityeditor';

/**
 * Display a form that allows for editting the attributes attached to a component.
 */
@Component({
    selector: "dk-entity-component",
    directives: [AttributeComponent],
    styleUrls: ['./duckling/entityeditor/entity.component.css'],
    template: `
        <div *ngFor="let key of keys()">
            <md-card>
                <md-card-title>
                    <div>
                        {{formatCardTitle(key)}}
                        <button
                            md-button
                            title="Delete Attribute"
                            [disableRipple]=true
                            (click)="deleteAttribute(key)">
                            Delete
                        </button>
                    </div>
                </md-card-title>
                <md-card-content>
                    <attribute-component
                        [key]="key"
                        [attribute]="entity[key]"
                        (attributeChanged)="onAttributeChanged(key, $event)">
                    </attribute-component>
                </md-card-content>
            </md-card>
        </div>
    `,
    changeDetection : ChangeDetectionStrategy.OnPush
})
export class EntityComponent {
    /**
     * The entity to display.
     */
    @Input() entity : Entity;

    /**
     * Output when the entity is changed.
     */
    @Output() entityChanged = new EventEmitter<Entity>();

    keys() {
        return Object.keys(this.entity);
    }

    deleteAttribute(key : AttributeKey) {
        this.entityChanged.emit(immutableDelete(this.entity, key));
    }

    onAttributeChanged(key : AttributeKey, attribute : Attribute) {
        var entityPatch : any = {};
        entityPatch[key] = attribute;
        this.entityChanged.emit(immutableAssign(this.entity, entityPatch));
    }

    formatCardTitle(title : string) : string {
        return toTitleCase(title);
    }
}
