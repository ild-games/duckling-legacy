import { Injectable } from '@angular/core';

import { WindowService } from '../../duckling/util/window.service';
/**
 * Service to manage the Electron window that Duckling is running in.
 */
@Injectable()
export class ElectronWindowService extends WindowService {
  override get width(): Promise<number> {
    return this.getWidth();
  }
  async getWidth(): Promise<number> {
    const res = await electron_api.window.getSize();
    return res[0];
  }

  override get height(): Promise<number> {
    return this.getHeight();
  }

  async getHeight(): Promise<number> {
    const res = await electron_api.window.getSize();
    return res[1];
  }

  onResize(handler: Function) {
    window.onresize = () => handler();
  }

  removeResizeEvent() {
    window.onresize = null;
  }

  onKeyDown(handler: Function) {
    window.onkeydown = (event: KeyboardEvent) => handler(event);
  }

  onKeyUp(handler: Function) {
    window.onkeyup = (event: KeyboardEvent) => handler(event);
  }

  removeKeyDownEvent() {
    window.onkeydown = null;
  }

  removeKeyUpEvent() {
    window.onkeyup = null;
  }

  onMouseDown(handler: Function) {
    window.onmousedown = (event: MouseEvent) => handler(event);
  }

  onMouseUp(handler: Function) {
    window.onmouseup = (event: MouseEvent) => handler(event);
  }

  removeMouseDownEvent() {
    window.onmousedown = null;
  }

  removeMouseUpEvent() {
    window.onmouseup = null;
  }

  async setSize(width: number, height: number): Promise<void> {
    await electron_api.window.setSize(width, height);
  }

  async setMinimumSize(minWidth: number, minHeight: number): Promise<void> {
    await electron_api.window.setMinimumSize(minWidth, minHeight);
  }

  async center(): Promise<void> {
    await electron_api.window.center();
  }

  async maximize(): Promise<void> {
    await electron_api.window.maximize();
  }

  async unmaximize(): Promise<void> {
    await electron_api.window.unmaximize();
  }

  async setResizable(isResizable: boolean): Promise<void> {
    await electron_api.window.setResizable(isResizable);
  }

  clearSelection(): void {
    window.getSelection()?.removeAllRanges();
  }
}
