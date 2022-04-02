import { Renderer as BrynjaRenderer } from 'brynja';
import { BuilderCB } from 'brynja/dist/builder';
import { createComponentBuilder } from './createComponentBuilder';
import { IRenderer } from './types/Renderer';

export function Renderer(config: { rootElement: HTMLElement, rootElementBuilder?: BuilderCB }): IRenderer {
  const brynja = BrynjaRenderer(config);
  return {
    render: (staticSegments, ...dynamicSegments) => {
      const rootComponentBuilder = createComponentBuilder(staticSegments, ...dynamicSegments);

      brynja.render(_=>_
        .do(config.rootElementBuilder ?? (_=> {
          // Echo props from root node if no custom rootElementBuilder was provided
          _.while(i => i < config.rootElement.attributes.length, (_, i)=> {
            const attribute = config.rootElement.attributes.item(i);
            if (attribute === null) { return; }
            _.prop(attribute.name, attribute.value);
          })
        }))
        .do(rootComponentBuilder)
      );
    }
  }
}
