import {
  EntitySystemService,
  mergeEntityAction,
  EntityPositionService,
} from '../../duckling/entitysystem';
import { EntityBoxService } from '../../duckling/entitysystem/services/entity-box.service';
import { AssetService } from '../../duckling/project/asset.service';

import { StoreService } from '../../duckling/state';
import { mainReducer } from '../../duckling/duckling.reducer';

export function createStoreService(): StoreService {
  return new StoreService(mainReducer, () => false);
}

export function createEntityService(store: StoreService): EntitySystemService {
  return new EntitySystemService(store);
}

export function createEntityBoxService(
  assetService: AssetService,
  entityPositionService: EntityPositionService,
  entitySystemService: EntitySystemService
): EntityBoxService {
  return new EntityBoxService(
    assetService,
    entityPositionService,
    entitySystemService,
    null
  );
}
