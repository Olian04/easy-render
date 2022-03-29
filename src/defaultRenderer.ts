import { IRenderer } from './types/Renderer';
import { Renderer } from './renderer';
import { EasyRenderError } from './util/EasyRenderError';

export const defaultRendererFactory = () => {
  let default_renderer: IRenderer | null = null;
  return () => {
    if (default_renderer === null) {
      // This makes sure the dom is ready when the Renderer is constructed.
      const rootElement = document.getElementById('root');
      if (rootElement === null) {
        throw new EasyRenderError('Unable to locate element with id "root"');
      }
      default_renderer = Renderer({
        rootElement,
      });
    }
    return default_renderer;
  };
};
