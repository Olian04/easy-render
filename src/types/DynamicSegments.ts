import { EventHandlerFunction } from './EventHandlerFunction';
import { StyleObject } from './StyleObject';

export type DynamicSegments =
  | string
  | number
  | string[]
  | EventHandlerFunction
  | StyleObject;
