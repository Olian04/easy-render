import { DynamicSegments } from "./DynamicSegments";

export type RenderFunction = (staticSegments: TemplateStringsArray, ...dynamicSegments: DynamicSegments[]) => void;
