import {EntitySystemService, mergeEntityAction} from '../../duckling/entitysystem';
import {StoreService} from '../../duckling/state';
import {mainReducer} from '../../duckling/main.reducer';

export function createStoreService() : StoreService {
    return new StoreService(mainReducer, () => false);
}

export function createEntityService(store : StoreService) : EntitySystemService {
    return new EntitySystemService(store);
}
