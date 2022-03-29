import { defaultRendererFactory } from './defaultRenderer';
import { RenderFunction } from './types/RenderFunction';

export { Renderer } from './renderer';

const defaultRenderer = defaultRendererFactory();

export const render: RenderFunction = (statics, ...dynamics) =>
    defaultRenderer().render(statics, ...dynamics);
