# Migration Engine

Your duckling project has a `project/version.json` file that describes the project's version, expected editor version, and migrations. An example might look like:

```
{
    projectVersion : "3.0",
    editorVersion : "0.1",
    migrations : [
        {
            "updateTo" : "2.0", // Run the migration when updating maps to project version "2.0"
            "path" : "migrations/make-collision100" // The migration script is {ProjectRoot}/project/migrations/make-collision100.js
        },
        {
            "updateTo" : "3.0",
            "path" : "migrations/add-drawable"
        }
    ]
}
```

# Entity Migration

Entity migrations run over every entity in the map. It can be used to add, remove, and modify the entity's attributes. The entity migration accepts an entity as the first argument and must return the migrated entity. The type of the entity argument and return value is:
```
interface Entity {
    [attributeName] : Attribute
}

// Example
let entity : Entity = {
    position : {
        x: 0,
        y: 0
    },
    drawable : ...,
    collision : ...
}
```

Here is an example migration that adds a drawable attribute to every entity that does not have a drawable with a topDrawable. In the sample project above this would be in `project/migrations/add-drawable.js`

```
var DRAWABLE = {
    "topDrawable": {
        "__cpp_type": "ild::ShapeDrawable",
        "key": "ShapeDrawable",
        "inactive": false,
        "renderPriority": 0,
        "scale": {
            "x": 1,
            "y": 1
        },
        "rotation": 0,
        "positionOffset": {
            "x": 0,
            "y": 0
        },
        "priorityOffset": 0,
        "shape": {
            "__cpp_type": "sf::RectangleShape",
            "fillColor": {
                "r": 100,
                "g": 200,
                "b": 0,
                "a": 255
            },
            "dimension": {
                "x": 100,
                "y": 100
            }
        }
    }
}

module.exports = function (tools) {
    return tools.entityMigration(function (entity) {
        if (entity.drawable && entity.drawable.topDrawable && entity.drawable.topDrawable.__cpp_type) {
            return entity;
        } else {
            return Object.assign({}, entity, {drawable : DRAWABLE});
        }
    });
}
```

# Attribute Migrations
Attribute migrations run over all the attributes in a system. You write a function that takes an attribute and returns a post migration attribute. It is possible to delete an attribute by returning null. Here is an example migration that changes the size of all collision attributes to 100. In the sample project above this would be in `project/migrations/make-collision100.js`

```
module.exports = function (tools) {
    /**
     * The "collision" string describes the system the migration is running over.
     */
    return tools.attributeMigration("collision", function (collisionAttribute) {
        return {
            dimension: {
                x: 100,
                y: 100
            },
            bodyType: collisionAttribute.bodyType,
            collisionType: collisionAttribute.collisionType,
            oneWayNormal: collisionAttribute.oneWayNormal
        };
    });
}
```

# Tips and Tricks

## Add New Migrations

You add new migrations by incrementing the projectVersion and adding a new entry to the migrations array.

## Debugging Migrations

When testing migrations, make sure all of your maps are committed into version control. You can debug the migration by placing `debugger;` statments in the code.

```
debugger; // Fires when the migration is loaded.
module.exports = function (tools) {
    debugger; // Fires when the migration is loaded.
    return tools.entityMigration(function (entity) {
        debugger; // Fires for each migrated entity.
    });
}
```
