import { DynamicsCache } from "./types/DynamicCache";
import { TagFunction } from "./types/TagFunction";
import { EasyRenderError } from "./util/EasyRenderError";

const isStaticSegment = (v: number) => v % 2 === 0;

export const tagFunction: TagFunction = (staticSegments, ...dynamicSegments) => {
  const dynamicsCache: DynamicsCache = {
    functions: [],
    objects: [],
  }
  let resultXML = '';
  let staticIndex = 0;
  let dynamicIndex = 0;
  for (let i = 0; i < staticSegments.length + dynamicSegments.length; i++) {
    if (isStaticSegment(i)) {
      resultXML += staticSegments[staticIndex];
      staticIndex += 1;
    } else {
      const dynVal = dynamicSegments[dynamicIndex];
      switch (typeof dynVal) {
        case 'function':
          resultXML += `"placeholder-function-${dynamicsCache.functions.length}"`
          dynamicsCache.functions.push(dynVal);
          break;
        case 'object':
          if (Array.isArray(dynVal)) {
            // TODO: Implement array support
            throw new EasyRenderError('Not yet implemented');
          } else {
            resultXML += `"placeholder-object-${dynamicsCache.functions.length}"`
            dynamicsCache.objects.push(dynVal);
          }
          break;
        default:
          resultXML += String(dynVal);
        }
        dynamicIndex += 1;
    }
  }
  return {
    xml: resultXML,
    dynamics: dynamicsCache,
  }
}
