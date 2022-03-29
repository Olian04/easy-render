import { Renderer as BrynjaRenderer } from 'brynja';
import { BuilderCB } from 'brynja/dist/builder';
import { parseXML } from './lib/txml';
import { tagFunction } from './tagFunction';
import { Builder } from './types/Builder';
import { IRenderer } from './types/Renderer';
import { EasyRenderError } from './util/EasyRenderError';


export function Renderer(config: { rootElement: HTMLElement, rootElementBuilder?: BuilderCB }): IRenderer {
  const brynja = BrynjaRenderer(config);
  let currentXML: string = '';
  let currentBuilder: Builder = () => _=>_;
  return {
    render: (staticSegments, ...dynamicSegments) => {
      const { xml, dynamics } = tagFunction(staticSegments, ...dynamicSegments);

      // Recalculate brynja builder if static XML changed
      if (xml !== currentXML) {
        currentXML = xml;
        const _dom = parseXML(xml);
        currentBuilder = ({ functions, objects }, dom: typeof _dom = _dom) => _=> {
          for (let node of dom) {
            _.child(node.tagName, _=> {
              if ('id' in node.attributes) {
                _.id(node.attributes['id']);
              }
              if ('style' in node.attributes) {
                const segments = node.attributes['style'].split('-');
                if (segments.length === 3) {
                  /* istanbul ignore if */
                  if (segments[0] !== 'placeholder' || segments[1] !== 'object') {
                    throw new EasyRenderError(`Unexpected type for style property. Expected object or string but got "${typeof segments[1]}"`);
                  }
                  const objectIndex = parseInt(segments[2], 10);
                  const styleObject = objects[objectIndex];
                  _.style(styleObject);
                } else {
                  _.prop('style', node.attributes['style']);
                }
              }
            })
          }
        }
      }

      // Inject dynamics into the stored brynja builder
      const brynjaBuilder = currentBuilder(dynamics);

      // Render using brynja
      brynja.render(_=>_
        .do(config.rootElementBuilder ?? (_=> {
          // Echo props from root node if no custom rootElementBuilder was provided
          _.while(i => i < config.rootElement.attributes.length, (_, i)=> {
            const attribute = config.rootElement.attributes.item(i);
            if (attribute === null) { return; }
            _.prop(attribute.name, attribute.value);
          })
        }))
        .do(brynjaBuilder)
      );
    }
  }
}
