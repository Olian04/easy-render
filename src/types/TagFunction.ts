import { DynamicsCache } from "./DynamicCache";
import { DynamicSegments } from "./DynamicSegments";

export type TagFunction = (staticSegments: TemplateStringsArray, ...dynamicSegments: DynamicSegments[]) => {
  xml: string;
  dynamics: DynamicsCache;
};
