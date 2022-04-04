import { DynamicsCache } from './types/DynamicCache';
import { DynamicSegments } from './types/DynamicSegments';
import { EasyRenderError } from './util/EasyRenderError';

const isStaticSegment = (v: number) => v % 2 === 0;

export const processTagFunctionData = (segment: { statics: TemplateStringsArray, dynamics: DynamicSegments[] }): { xml: string, dynamics: DynamicsCache } => {
  const dynamicsCache: DynamicsCache = {
    functions: [],
    objects: [],
    components: [],
  }
  let resultXML = '';
  let staticIndex = 0;
  let dynamicIndex = 0;
  for (let i = 0; i < segment.statics.length + segment.dynamics.length; i++) {
    if (isStaticSegment(i)) {
      resultXML += segment.statics[staticIndex];
      staticIndex += 1;
    } else {
      const dynVal = segment.dynamics[dynamicIndex];
      switch (typeof dynVal) {
        case 'function':
          resultXML += `"placeholder-function-${dynamicsCache.functions.length}"`
          dynamicsCache.functions.push(dynVal);
          break;
        case 'object':
          if (Array.isArray(dynVal)) {
            for (const builder of dynVal) {
              resultXML += `<placeholder-component-${dynamicsCache.components.length} />`
              dynamicsCache.components.push(builder);
            }
          } else {
            resultXML += `"placeholder-object-${dynamicsCache.objects.length}"`
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
    xml: resultXML.replaceAll('\n', ''),
    dynamics: dynamicsCache,
  }
}
