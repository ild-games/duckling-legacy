import {
  Component,
  Input,
  Output,
  EventEmitter,
  SimpleChange,
  OnChanges,
} from '@angular/core';

import { EntitySystemService, EntityKey } from '../entitysystem';
import { DeleteButtonComponent } from '../controls/delete-button.component';
import { InputComponent } from '../controls/input.component';
import { Validator } from '../controls/validated-input.component';

/**
 * Component that allows the user to modify an entity.
 */
@Component({
  selector: 'dk-entity-name',
  styleUrls: ['./entity-name.component.scss'],
  template: `
    <div class="entity-name-row">
      <dk-edit-input
        [value]="currentSelectedEntity"
        [validator]="nameValidator"
        label="Entity"
        editTooltip="Edit entity name"
        validTooltip="Save entity name"
        invalidTooltip="Entity name cannot be a duplicate or blank"
        (onValueSaved)="onSaveEntityName($event)"
      >
      </dk-edit-input>
      <dk-delete-button (deleteClick)="onDeleteClicked()"></dk-delete-button>
    </div>
  `,
})
export class EntityNameComponent {
  @Input() currentSelectedEntity: EntityKey;
  @Output() deleteEntity = new EventEmitter<any>();
  @Output() renameEntity = new EventEmitter<any>();

  constructor(private _entitySystem: EntitySystemService) {}

  onSaveEntityName(newEntityName: string) {
    this.renameEntity.emit(newEntityName);
  }

  onDeleteClicked() {
    this.deleteEntity.emit(true);
  }

  get nameValidator(): Validator {
    return (value: string) => {
      if (!value || value === '') {
        return false;
      }
      if (value === this.currentSelectedEntity) {
        return true;
      }

      let currentEntity = this._entitySystem.getEntity(value);
      if (currentEntity) {
        return false;
      }

      return true;
    };
  }
}
