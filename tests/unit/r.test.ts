import { AssertionError, expect } from 'chai';
import { describe, it } from 'mocha';

import { buildNode } from 'brynja/dist/builder';

import { r } from '../../src/r';
import { VNode } from 'brynja/dist/interfaces/VNode';

const defaultRootTag = 'div';
const [defaultVDom, defaultStyles] = buildNode(defaultRootTag, _=>_);

const expectEqualToDefault = <K extends keyof VNode>(target: VNode, ...keysToMatch: K[]) => {
  for (const key of keysToMatch) {
    expect(target[key]).to.deep.equal(defaultVDom[key]);
  }
}

describe('Unit test', () => {
  describe('r', () => {
    it('should be a tag function that returns a brynja builder', () => {
      expect(typeof r).to.equal('function');

      const builder = r`
        <div></div>
      `;

      expect(typeof builder).to.equal('function');

      const [vDom, styles] = buildNode(defaultRootTag, builder);

      expect(typeof vDom).to.equal('object');
      expect(Array.isArray(vDom)).to.be.false;
      expect(typeof styles).to.equal('object');
      expect(Array.isArray(styles)).to.be.false;
    });

    it('should add text when provided', () => {
      const builder = r`
        <div>Hello World</div>
      `;

      const [vDom, styles] = buildNode(defaultRootTag, builder);

      expect(styles).to.deep.equal({});
      expectEqualToDefault(vDom, 'events', 'props', 'value', 'text', 'tag');
      expectEqualToDefault(vDom.children[0], 'events', 'props', 'value', 'tag', 'children');
      expect(vDom.children[0].text).to.equal('Hello World');
    });
    it('should add id when provided', () => {
      const builder = r`
        <div id="foo"></div>
      `;

      const [vDom, styles] = buildNode(defaultRootTag, builder);

      expect(styles).to.deep.equal({});
      expectEqualToDefault(vDom, 'events', 'props', 'value', 'text', 'tag');
      expectEqualToDefault(vDom.children[0], 'events', 'value', 'text', 'tag', 'children');
      expect(vDom.children[0].props['id']).to.equal('foo');
    });

    it('should add class when provided', () => {
      const builder = r`
        <div class="foo"></div>
      `;

      const [vDom, styles] = buildNode(defaultRootTag, builder);

      expect(styles).to.deep.equal({});
      expectEqualToDefault(vDom, 'events', 'props', 'value', 'text', 'tag');
      expectEqualToDefault(vDom.children[0], 'events', 'value', 'text', 'tag', 'children');
      expect(vDom.children[0].props['class']).to.equal('foo');
    });

    it('should add generated class when style object is provided', () => {
      const builder = r`
        <div style=${{ color: 'blue' }}></div>
      `;

      const [vDom, styles] = buildNode(defaultRootTag, builder);

      const generatedClassName = Object.keys(styles)[0];
      expect(Object.keys(styles).length).to.equal(1);
      expectEqualToDefault(vDom, 'events', 'props', 'value', 'text', 'tag');
      expectEqualToDefault(vDom.children[0], 'events', 'value', 'text', 'tag', 'children');
      expect(vDom.children[0].props['class']).to.equal(generatedClassName);
      expect(vDom.children[0].props['style']).to.equal(undefined);
    });

    it('should add style when style string is provided', () => {
      const builder = r`
        <div style="width: 100px"></div>
      `;

      const [vDom, styles] = buildNode(defaultRootTag, builder);

      expect(styles).to.deep.equal({});
      expectEqualToDefault(vDom, 'events', 'props', 'value', 'text', 'tag');
      expectEqualToDefault(vDom.children[0], 'events', 'value', 'text', 'tag', 'children');
      expect(vDom.children[0].props['style']).to.equal('width: 100px');
    });

    it('should merge class property when both class and style is provided', () => {
      const builder = r`
        <div class="foo" style=${{ color: 'blue' }}></div>
      `;

      const [vDom, styles] = buildNode(defaultRootTag, builder);

      const generatedClassName = Object.keys(styles)[0];
      expect(Object.keys(styles).length).to.equal(1);
      expectEqualToDefault(vDom, 'events', 'props', 'value', 'text', 'tag');
      expectEqualToDefault(vDom.children[0], 'events', 'value', 'text', 'tag', 'children');
      expect(vDom.children[0].props['class'].split(' ')).to.deep.equal(['foo', generatedClassName]);
      expect(vDom.children[0].props['style']).to.equal(undefined);
    });

    it('should set value when provided', () => {
      const builder = r`
        <input value="${'foo'}" />
      `;

      const [vDom, styles] = buildNode(defaultRootTag, builder);

      expect(styles).to.deep.equal({});
      expectEqualToDefault(vDom, 'events', 'props', 'value', 'text', 'tag');
      expectEqualToDefault(vDom.children[0], 'events', 'text', 'children');
      expect(vDom.children[0].value).to.equal('foo');
    });

    it('should render static children when provided', () => {
      const builder = r`
        <div>
          <div></div>
          <div>
            <div></div>
          </div>
        </div>
      `;

      const [vDom, styles] = buildNode(defaultRootTag, builder);

      expect(styles).to.deep.equal({});
      expectEqualToDefault(vDom, 'events', 'props', 'value', 'text', 'tag');

      expect(vDom.children.length).to.equal(1);
      expectEqualToDefault(vDom.children[0], 'events', 'props', 'value', 'text', 'tag');

      expect(vDom.children[0].children.length).to.equal(2);
      expectEqualToDefault(vDom.children[0].children[0], 'events', 'props', 'value', 'text', 'tag', 'children');
      expectEqualToDefault(vDom.children[0].children[1], 'events', 'props', 'value', 'text', 'tag');

      expect(vDom.children[0].children[1].children.length).to.equal(1);
      expectEqualToDefault(vDom.children[0].children[1].children[0], 'events', 'props', 'value', 'text', 'tag', 'children');
    });

    it('should render dynamic children when provided', () => {
      const builder = r`
        <div>
          ${[1, 2, 3].map(v => r`
            <div>${v}</div>
          `)}
        </div>
      `;

      const [vDom, styles] = buildNode(defaultRootTag, builder);

      expect(styles).to.deep.equal({});
      expectEqualToDefault(vDom, 'events', 'props', 'value', 'text', 'tag');

      expect(vDom.children.length).to.equal(1);
      expectEqualToDefault(vDom.children[0], 'events', 'props', 'value', 'text', 'tag');

      expect(vDom.children[0].children.length).to.equal(3);
      expectEqualToDefault(vDom.children[0].children[0], 'events', 'props', 'value', 'tag', 'children');
      expect(vDom.children[0].children[0].text).to.equal('1');
      expectEqualToDefault(vDom.children[0].children[1], 'events', 'props', 'value', 'tag', 'children');
      expect(vDom.children[0].children[1].text).to.equal('2');
      expectEqualToDefault(vDom.children[0].children[2], 'events', 'props', 'value', 'tag', 'children');
      expect(vDom.children[0].children[2].text).to.equal('3');
    });
  });
});
