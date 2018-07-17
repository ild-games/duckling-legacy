/**
 * Interface describing the structure of an attribute in the map file.
 */
export type Attribute = any;

/**
 * Interface describing the structure of a system in a map file.
 */
export interface System {
  components: { [entityName: string]: Attribute };
}

/**
 * How components are stored on the system.
 */
export interface Components {
  [key: string]: Attribute;
}

/**
 * Interface describing the structure of a map file.
 */
export interface Map {
  key: string;
  entities: string[];
  assets: Asset[];
  systems: { [systemName: string]: System };
  version: string;
  dimension: Vector;
  gridSize: number;
}

/**
 * Structure of an asset in the map file.
 */
export interface Asset {
  type: string;
  key: string;
}

/**
 * The structure of a vector in the map file.
 */
export interface Vector {
  x: number;
  y: number;
}

type Entity = any;
