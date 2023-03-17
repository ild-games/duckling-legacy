import {
  Component,
  Input,
  Output,
  EventEmitter,
  ChangeDetectorRef,
} from '@angular/core';

import { immutableAssign, DialogService, PathService } from '../util';
import { ProjectService } from './project.service';
import { AssetService } from './asset.service';
import { OpenDialogReturnValue } from 'electron';

/**
 * Component for loading asset files.
 */
@Component({
  selector: 'dk-browse-asset',
  styleUrls: ['./browse-asset.component.scss'],
  template: `
    <div class="wrapper">
      <button
        mat-raised-button
        disableRipple="true"
        [title]="buttonText"
        (click)="onBrowseClicked()"
      >
        {{ buttonText }}
      </button>
      <dk-input [disabled]="true" placeholder="File" [value]="fileName">
      </dk-input>
    </div>
  `,
})
export class BrowseAssetComponent {
  @Input() buttonText: string = 'Browse';

  @Input() dialogOptions: any = {};

  @Input() selectedFile = '';

  @Output() filePicked = new EventEmitter<string>();

  private static _lastFilePath: string = '';

  constructor(
    private _path: PathService,
    private _project: ProjectService,
    private _assets: AssetService,
    private _dialog: DialogService
  ) {}

  onBrowseClicked() {
    // This option forces macOS to not resolve an symlink in the path from the file
    // picked in the dialog. This is necessary because we typically have the resources/
    // folder setup as a symlink and if the path is resolved then it fails validation
    // of making sure the resource chosen is within the project folder. See this issue
    // for more information: https://github.com/electron/electron/issues/8601
    //
    // NOTE: This currently does not work unless the symlink is the leaf of the path,
    // this is because of a macOS bug: http://www.openradar.me/11398659
    this.dialogOptions.properties.push('noResolveAliases');

    this.dialogOptions.defaultPath =
      this.dialogOptions.defaultPath || this._openDialogPath;

    this._dialog.showOpenDialog(
      this.dialogOptions,
      (openDialogReturnValue: OpenDialogReturnValue) => {
        if (!openDialogReturnValue.canceled) {
          this.onFilePicked(openDialogReturnValue.filePaths[0]);
        }
      }
    );
  }

  onFilePicked(file: string) {
    if (!file) {
      return;
    }
    file = this._path.normalize(file);

    let resourceDirectory = this._path.join(
      this._project.home,
      this._assets.resourceFolderName
    );
    BrowseAssetComponent._lastFilePath = this._path.dirname(file);
    if (!this._path.isSubOfDir(file, resourceDirectory)) {
      this._dialog.showErrorDialog(
        'Unable to load asset',
        'You must select assets from the resources/ folder in the root of your project'
      );
      return;
    }

    this.filePicked.emit(this._path.toKey(resourceDirectory, file));
  }

  get fileName(): string {
    if (this.selectedFile) {
      return this.selectedFile;
    } else {
      return 'No file selected';
    }
  }

  private get _openDialogPath(): string {
    let openDialogPath = this._path.join(
      this._project.home,
      this._assets.resourceFolderName
    );

    if (this.selectedFile) {
      return this._path.join(
        openDialogPath,
        this._path.dirname(this.selectedFile)
      );
    } else if (BrowseAssetComponent._lastFilePath) {
      return BrowseAssetComponent._lastFilePath;
    } else {
      return openDialogPath;
    }
  }
}
