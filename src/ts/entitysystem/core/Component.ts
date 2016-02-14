import SimpleObservable from '../../framework/observe/SimpleObservable';
import {Asset} from './Map';

export default class Component extends SimpleObservable {
    collectAssets() : Array<Asset> {
        return [];
    }
}
