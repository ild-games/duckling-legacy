export type ActionName = string;

export interface Action {
    name : ActionName,
    mergeKey? : any
}
