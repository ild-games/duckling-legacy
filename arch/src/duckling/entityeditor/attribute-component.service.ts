import { Component, Injectable } from "@angular/core";

import { AttributeKey, BaseAttributeService } from "../entitysystem";
import { ProjectService } from "../project/project.service";
import { CustomAttributeComponent } from "../project/custom-attribute.component";

import { DefaultAttributeComponent } from "./_default-attribute.component";

/**
 * The AttributeComponentService is used to find and instantiate a component class
 * for an attribute.
 */
@Injectable()
export class AttributeComponentService extends BaseAttributeService<any> {
    constructor(private _projectService: ProjectService) {
        super();
    }

    /**
     * Get the component class for the attribute.
     * @param  key The key of the attribute the component will be retrieved for.
     * @return The component class to use for the attribute.
     */
    getComponentType(key: AttributeKey): any {
        let implementation = this.getImplementation(key);

        if (implementation) {
            return implementation;
        }

        if (this._projectService.isCustomAttribute(key)) {
            return CustomAttributeComponent;
        }

        return DefaultAttributeComponent;
    }
}
