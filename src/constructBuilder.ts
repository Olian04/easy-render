import { createComponent } from 'brynja';
import { XMLNode } from './lib/txml';
import { DynamicsCache } from './types/DynamicCache';
import { EasyRenderError } from './util/EasyRenderError';

export const createBrynjaBuilder = createComponent((dom: XMLNode[], dynamics: DynamicsCache) => _=> {
  for (const node of dom) {
    _.child(node.tagName, _=> {
      for (const prop of Object.keys(node.attributes)) {
        const segments = node.attributes.style.split('-');
        if (segments.length === 3) {
          /* istanbul ignore else */
          if (segments[0] === 'placeholder' &&  segments[1] === 'object') {
            // CSS in JS styles
            const index = parseInt(segments[2], 10);
            _.style(dynamics.objects[index]);
          } else if (segments[0] === 'placeholder' &&  segments[1] === 'function') {
            // Event handlers
            const index = parseInt(segments[2], 10);
            _.on(prop, dynamics.functions[index]);
          } else {
            throw new EasyRenderError(`Unexpected type for style property. Expected object or string but got "${typeof segments[1]}"`);
          }
        }
        switch (prop) {
          case 'id':
            _.id(node.attributes.id);
            break;
          case 'text':
            _.text(node.attributes.text);
            break;
          case 'name':
            _.name(node.attributes.name);
            break;
          case 'value':
            _.value(node.attributes.value);
            break;
          case 'style':
            _.prop('style', node.attributes.style);
            break;
          default:
            _.prop(prop, node.attributes[prop]);
        }
      }
    })
  }
});
