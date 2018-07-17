import {
  Component,
  EventEmitter,
  Input,
  Output,
  OnChanges,
  AfterViewInit,
  OnInit,
  OnDestroy
} from "@angular/core";
import { Subscriber } from "rxjs";

import { ArrayChoiceComponent, SelectOption } from "../controls";
import {
  Entity,
  AvailableAttributeService,
  AttributeKey,
  attributeDisplayName
} from "../entitysystem";
import { changeType, ChangeType } from "../state";
import { ProjectService } from "../project/project.service";

/**
 * Allows the user to add attributes to an entity.
 */
@Component({
  selector: "dk-attribute-selector",
  template: `
        <div *ngIf="options.length">
            <dk-array-choice
                [options]="options"
                [selected]="selection"
                (addClicked)="onAddClicked($event)">
            </dk-array-choice>
        </div>
    `
})
export class AttributeSelectorComponent
  implements OnChanges, AfterViewInit, OnInit, OnDestroy {
  /**
   * The entity the user will add attributes to.
   */
  @Input() entity: Entity;

  /**
   * Fired when the user clicks on the add button and the attribute should be added.
   */
  @Output() addAttribute = new EventEmitter<AttributeKey>();

  selection: string;
  options: SelectOption[] = [];
  private _projectSubscription: Subscriber<any>;

  constructor(
    private _availableAttribute: AvailableAttributeService,
    private _projectService: ProjectService
  ) {}

  ngOnInit() {
    this._projectSubscription = this._projectService.project.subscribe(() => {
      this._rebuildOptions();
    }) as Subscriber<any>;
  }

  ngAfterViewInit() {
    if (this.options[0]) {
      this.selection = this.options[0].value;
    }
  }

  ngOnDestroy() {
    this._projectSubscription.unsubscribe();
  }

  ngOnChanges() {
    this._rebuildOptions();
  }

  onAddClicked(selection: string) {
    this.selection = selection;
    this.addAttribute.emit(this.selection);
  }

  newOptions(): SelectOption[] {
    return this._availableAttribute
      .availableAttributes(this.entity)
      .map(key => {
        return { title: attributeDisplayName(key), value: key };
      });
  }

  private _rebuildOptions() {
    let newOptions = this.newOptions();
    newOptions.sort((left, right) => left.title.localeCompare(right.title));
    if (changeType(newOptions, this.options) !== ChangeType.Equal) {
      this.options = newOptions;
      this.selection = this._getDefaultSelection(this.options);
    }
  }

  private _getDefaultSelection(options: SelectOption[]) {
    if (options.length > 0) {
      return options[0].value;
    } else {
      return "";
    }
  }
}
