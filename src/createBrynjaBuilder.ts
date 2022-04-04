import { createComponent } from 'brynja';
import { XMLNode } from './types/XMLNode';
import { DynamicsCache } from './types/DynamicCache';
import { EasyRenderError } from './util/EasyRenderError';

export const createBrynjaBuilder = createComponent((dom: XMLNode[], dynamics: DynamicsCache) => _=> {
  for (const node of dom) {
    if (typeof node === 'string') {
      _.text(node); // TEXT
      continue;
    }

    // Dynamic component
    const segments = node.tagName.split('-');
    if (segments.length === 3 && segments[0] === 'placeholder' && segments[1] === 'component') {
      const index = parseInt(segments[2], 10);
      const builder = dynamics.components[index];
      _.do(builder);
      continue;
    }

    _.child(node.tagName, _=> {
      for (const prop of Object.keys(node.attributes)) {

        // Inject dynamic data
        const segments = node.attributes[prop].split('-');
        if (segments.length === 3 && segments[0] === 'placeholder') {
          if (prop === 'style' && segments[1] === 'object') {
            // CSS in JS styles
            const index = parseInt(segments[2], 10);
            _.style(dynamics.objects[index]); // STYLE
            continue;
          }
          if (segments[1] === 'function') {
            // TODO: Check if prop is a known event? Currently anything that looks like an event handler is treated like an event.
            // Event handlers
            const index = parseInt(segments[2], 10);
            _.on(prop, dynamics.functions[index]); // ON
            continue;
          }
        }

        switch (prop) {
          case 'id':
            _.id(node.attributes.id); // ID
            break;
          case 'name':
            _.name(node.attributes.name); // NAME
            break;
          case 'value':
            _.value(node.attributes.value); // VALUE
            break;
          case 'class':
            _.class(node.attributes.class); // CLASS
          default:
            _.prop(prop, node.attributes[prop]); // <anything else>
        }
      }
      _.do(createBrynjaBuilder(node.children, dynamics)); // CHILDREN
    })
  }
});
