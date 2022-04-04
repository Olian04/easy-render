import { XML } from './lib/txml';
import { DynamicSegments } from './types/DynamicSegments';
import { processTagFunctionData } from './processTagFunctionData';
import { createBrynjaBuilder } from './createBrynjaBuilder';
import { BrynjaBuilder } from './types/BrynjaBuilder';

export const r = (staticSegments: TemplateStringsArray, ...dynamicSegments: DynamicSegments[]): BrynjaBuilder => {
  const { xml, dynamics } = processTagFunctionData({
    statics: staticSegments,
    dynamics: dynamicSegments,
  });
  const DOM = XML.parse(xml);
  const builder = createBrynjaBuilder(DOM, dynamics);
  return builder;
}
