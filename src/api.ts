import { defaultRendererFactory } from './defaultRenderer';
import { RenderFunction } from './types/RenderFunction';

export { Renderer } from './renderer';
export { createComponentBuilder as r } from './createComponentBuilder';

const defaultRenderer = defaultRendererFactory();

export const render: RenderFunction = (statics, ...dynamics) =>
    defaultRenderer().render(statics, ...dynamics);
