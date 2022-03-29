import { EventHandlerFunction } from "./EventHandlerFunction";
import { StyleObject } from "./StyleObject";

export interface DynamicsCache {
  functions: EventHandlerFunction[];
  objects: StyleObject[];
}
