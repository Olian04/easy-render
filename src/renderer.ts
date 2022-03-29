import { parseXML } from './lib/txml';
import { tagFunction } from './tagFunction';
import { Builder } from './types/Builder';
import { IRenderer } from './types/Renderer';


export function Renderer(config: { rootElement: HTMLElement }): IRenderer {
  let currentXML: string = '';
  let currentBuilder: Builder = () => _=>_;
  return {
    render: (staticSegments, ...dynamicSegments) => {
      const { xml, dynamics } = tagFunction(staticSegments, ...dynamicSegments);

      // Recalculate brynja builder if static XML changed
      if (xml !== currentXML) {
        currentXML = xml;
        const dom = parseXML(xml, {
          keepComments: false,
        });
        currentBuilder = ({ functions, objects }) => _=> {
          for (let node in dom) {
            console.log(node);
          }
        }
      }

      // Inject dynamics into the stored brynja builder
      const brynjaBuilder = currentBuilder(dynamics);

      console.log(brynjaBuilder);
    }
  }
}
