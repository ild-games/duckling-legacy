import {
    Component,
    Input,
    Output,
    EventEmitter,
    ViewContainerRef,
    OnDestroy,
    ChangeDetectorRef,
} from "@angular/core";
import { MatDialog } from "@angular/material";
import { Subscriber } from "rxjs";

import { VectorInputComponent, FormLabelComponent } from "../../controls";
import {
    SelectOption,
    ArraySelectComponent,
} from "../../controls/array-select.component";
import { EnumSelectComponent } from "../../controls/enum-select.component";
import { Vector } from "../../math/vector";
import { immutableAssign } from "../../util/model";
import { ProjectService } from "../../project/project.service";

import { CollisionAttribute, BodyTypeSelect } from "./collision-attribute";
import { EditCollisionTypesComponent } from "./edit-collision-types.component";
import { CollisionTypesService } from "./collision-types.service";

/**
 * Implementation that will be registered with the AttributeComponentService.
 * @see AttributeComponentService
 * @see AttributeComponent
 */
@Component({
    selector: "dk-collision",
    styleUrls: ["./duckling/game/collision/collision.component.css"],
    template: `
        <dk-vector-input
            xLabel="Width"
            yLabel="Height"
            [value]="attribute.dimension.dimension"
            (validInput)="onDimensionInput($event)">
        </dk-vector-input>
        <dk-vector-input
            xLabel="Relative Anchor X %"
            yLabel="Relative Anchor Y %"
            [value]="attribute.anchor"
            (validInput)="onAnchorInput($event)">
        </dk-vector-input>
        <dk-vector-input
            xLabel="One Way Normal X"
            yLabel="One Way Normal Y"
            [value]="attribute.oneWayNormal"
            (validInput)="onOneWayNormalInput($event)">
        </dk-vector-input>

        <div class="form-label">Body Type</div>
        <dk-array-select
            [value]="attribute.bodyType"
            [options]="bodyTypes"
            (selection)="onBodyTypeInput($event)">
        </dk-array-select>

        <div class="form-label">Collision Type</div>
        <dk-array-select
            [value]="attribute.collisionType"
            [options]="collisionTypeOptions"
            (selection)="onCollisionTypeInput($event)">
        </dk-array-select>
        <button
            mat-icon-button
            [disableRipple]="true"
            (click)="onEditCollisionTypesClicked()">
            <dk-icon iconClass="pencil"></dk-icon>
        </button>
    `,
})
export class CollisionComponent implements OnDestroy {
    @Input() attribute: CollisionAttribute;
    @Output() attributeChanged = new EventEmitter<CollisionAttribute>();

    bodyTypes = BodyTypeSelect;
    collisionTypeOptions: SelectOption[] = [];

    private _collisionTypeSubscription: Subscriber<any>;

    constructor(
        private _viewContainer: ViewContainerRef,
        private _collisionTypes: CollisionTypesService,
        private _changeDetector: ChangeDetectorRef,
        private _dialog: MatDialog
    ) {
        this.collisionTypeOptions = this._buildCollisionTypeOptions();

        this._collisionTypeSubscription = this._collisionTypes.collisionTypes.subscribe(
            () => {
                this.collisionTypeOptions = this._buildCollisionTypeOptions();
                this._changeDetector.markForCheck();
            }
        ) as Subscriber<any>;
    }

    ngOnDestroy() {
        this._collisionTypeSubscription.unsubscribe();
    }

    onOneWayNormalInput(oneWayNormal: Vector) {
        this.attributeChanged.emit(
            immutableAssign(this.attribute, { oneWayNormal })
        );
    }

    onDimensionInput(dimension: Vector) {
        let newBox = immutableAssign(this.attribute.dimension, { dimension });
        this.attributeChanged.emit(
            immutableAssign(this.attribute, { dimension: newBox })
        );
    }

    onAnchorInput(newAnchor: Vector) {
        this.attributeChanged.emit(
            immutableAssign(this.attribute, { anchor: newAnchor })
        );
    }

    onBodyTypeInput(bodyType: string) {
        this.attributeChanged.emit(
            immutableAssign(this.attribute, { bodyType })
        );
    }

    onEditCollisionTypesClicked() {
        this._dialog.open(EditCollisionTypesComponent);
    }

    onCollisionTypeInput(collisionType: string) {
        this.attributeChanged.emit(
            immutableAssign(this.attribute, { collisionType })
        );
    }

    private _buildCollisionTypeOptions(): SelectOption[] {
        return Array.from(
            this._collisionTypes.collisionTypes.getValue().values()
        ).map((collisionType) => {
            return { value: collisionType, title: collisionType };
        });
    }
}
