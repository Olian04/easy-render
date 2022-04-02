import { BrynjaBuilder } from './BrynjaBuilder';
import { EventHandlerFunction } from './EventHandlerFunction';
import { StyleObject } from './StyleObject';

export type DynamicSegments =
  | string
  | number
  | BrynjaBuilder[]
  | EventHandlerFunction
  | StyleObject;
