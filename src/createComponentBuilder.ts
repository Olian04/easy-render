import { XML } from './lib/txml';
import { DynamicSegments } from './types/DynamicSegments';
import { processTagFunctionData } from './processTagFunctionData';
import { constructBuilder } from './constructBuilder';
import { BrynjaBuilder } from './types/BrynjaBuilder';

export const createComponentBuilder = (staticSegments: TemplateStringsArray, ...dynamicSegments: DynamicSegments[]): BrynjaBuilder => {
  const { xml, dynamics } = processTagFunctionData({
    statics: staticSegments,
    dynamics: dynamicSegments,
  });
  const DOM = XML.parse(xml);
  const builder = constructBuilder(DOM, dynamics);
  return builder;
}
