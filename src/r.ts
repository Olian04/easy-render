import { xml } from 'xml-template-literal';
import { DynamicSegments } from './types/DynamicSegments';
import { createBrynjaBuilder } from './createBrynjaBuilder';
import { BrynjaBuilder } from './types/BrynjaBuilder';

export const r = (staticSegments: TemplateStringsArray, ...dynamicSegments: DynamicSegments[]): BrynjaBuilder => {
  const ast = xml(staticSegments, ...dynamicSegments);
  const builder = createBrynjaBuilder(ast);
  return builder;
}
