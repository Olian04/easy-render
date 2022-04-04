import { defaultRendererFactory } from './defaultRenderer';
import { RenderFunction } from './types/RenderFunction';

export { createStyles, createComponent } from 'brynja';

export { Renderer } from './renderer';
export { r as r } from './r';

const defaultRenderer = defaultRendererFactory();

export const render: RenderFunction = (statics, ...dynamics) =>
    defaultRenderer().render(statics, ...dynamics);
