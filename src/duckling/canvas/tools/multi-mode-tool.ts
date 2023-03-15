import { Injectable } from '@angular/core';
import { DisplayObject, Graphics } from 'pixi.js';

import { KeyboardService } from '../../util';
import { DrawnConstruct } from '../drawing/drawn-construct';

import { BaseTool, CanvasMouseEvent, CanvasKeyEvent } from './base-tool';

/**
 * A multi-mode-tool is a base class used for tools that are a composite of other
 * tools. see bimodal tool as an example.
 */
@Injectable()
export abstract class MultiModeTool extends BaseTool {
  constructor() {
    super();
  }

  protected abstract get selectedTool(): BaseTool;
  protected abstract get primaryTool(): BaseTool;

  override drawTool(canvasZoom: number): DrawnConstruct | undefined {
    if (this.primaryTool) {
      return this.primaryTool.drawTool(canvasZoom);
    }
    return undefined;
  }

  override onStageDown(event: CanvasMouseEvent) {
    if (this.selectedTool) {
      return this.selectedTool.onStageDown(event);
    }
  }

  override onStageMove(event: CanvasMouseEvent) {
    if (this.selectedTool) {
      this.selectedTool.onStageMove(event);
    }
  }

  override onStageUp(event: CanvasMouseEvent) {
    if (this.selectedTool) {
      this.selectedTool.onStageUp(event);
    }
  }

  override onKeyDown(event: CanvasKeyEvent) {
    if (this.selectedTool) {
      this.selectedTool.onKeyDown(event);
    }
  }

  override onKeyUp(event: CanvasKeyEvent) {
    if (this.selectedTool) {
      this.selectedTool.onKeyUp(event);
    }
  }

  override onLeaveStage() {
    if (this.selectedTool) {
      this.selectedTool.onLeaveStage();
    }
  }
}
