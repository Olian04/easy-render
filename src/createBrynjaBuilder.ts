import { AstRoot, AttributeType, ChildType } from 'xml-template-literal';
import { createComponent } from 'brynja';
import { DynamicSegments } from './types/DynamicSegments';

export const createBrynjaBuilder = createComponent((ast: Pick<AstRoot<DynamicSegments>, 'children'> ) => _=> {
  for (const node of ast.children) {
    if (node.type === ChildType.Text && node.value.trim().length > 0) {
      _.text(node.value);
    } else if (node.type === ChildType.Data && Array.isArray(node.value)) {
      _.do(...node.value);
    } else if (node.type === ChildType.Data && `${node.value}`.trim().length > 0) {
      _.text(node.value);
    } else if (node.type === ChildType.Node) {
      _.child(node.tag, _=> {
        for (const attr of node.attributes) {
          if (
            attr.key === 'style'
            && attr.type === AttributeType.Data
            && typeof attr.value !== 'number'
            && typeof attr.value !== 'string'
            && typeof attr.value !== 'function'
            && !Array.isArray(attr.value)
          ) {
            _.style(attr.value);
          } else if (
            attr.key === 'style'
            && attr.type === AttributeType.Composite
            && attr.value.length === 1
            && attr.value[0].type === AttributeType.Data
            && typeof attr.value[0].value !== 'number'
            && typeof attr.value[0].value !== 'string'
            && typeof attr.value[0].value !== 'function'
            && !Array.isArray(attr.value[0].value)
          ) {
            _.style(attr.value[0].value);
          } else if (
            attr.type === AttributeType.Data
            && typeof attr.value === 'function'
          ) {
            _.on(attr.key, attr.value);
          } else if (
            attr.type === AttributeType.Composite
            && attr.value.length === 1
            && attr.value[0].type === AttributeType.Data
            && typeof attr.value[0].value === 'function'
          ) {
            _.on(attr.key, attr.value[0].value);
          } else {
            const val = attr.type === AttributeType.Composite
              ? attr.value.map(v => `${v.value}`).join('')
              : `${attr.value}`;
            switch (attr.key) {
              case 'id':
                _.id(val);
                break;
              case 'name':
                _.name(val);
                break;
              case 'value':
                _.value(val);
                break;
              case 'class':
                _.class(val);
              default:
                _.prop(attr.key, val);
            }
          }
        }
      });

      _.do(createBrynjaBuilder(node));
    }
  }
});
