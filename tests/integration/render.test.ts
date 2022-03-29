import { AssertionError, expect } from 'chai';
import { describe, it } from 'mocha';

// tslint:disable-next-line:no-var-requires
const jsdom: () => void = require('mocha-jsdom');

import { render as defaultRender, Renderer } from '../../src/api';

describe('Integrations test', () => {
  jsdom();

  beforeEach(() => {
    document.body.innerHTML = '<div id="root"></div>';
  });

  describe('render', () => {
    it('should be a tag function', () => {
      expect(typeof defaultRender).to.equal('function');

      try {
        const name = 'World';
        defaultRender`
          <h>Hello ${name}!</h>
        `;
      } catch {
        expect.fail();
      }
    });

    it('should render a single div tag with no properties or children', () => {
      const conf = {
        rootElement: document.createElement('div'),
      };
      const { render } = Renderer(conf);

      render`
        <div></div>
      `;

      expect(conf.rootElement?.children[0].tagName).to.equal('DIV');
    });

    it('should render static props', () => {
      const conf = {
        rootElement: document.createElement('div'),
      };
      const { render } = Renderer(conf);

      render`
        <div id="foo"></div>
      `;

      expect(conf.rootElement?.children[0].id).to.equal('foo');
    });

    it('should render style object', () => {
      const conf = {
        rootElement: document.createElement('div'),
      };
      const { render } = Renderer(conf);

      render`
        <div style=${{ background: 'skyblue' }}></div>
      `;

      expect(conf.rootElement?.children[0].classList).to.not.be.empty;
    });

    it('should preserve attributes on root element', () => {
      const conf = {
        rootElement: document.createElement('div'),
      };
      conf.rootElement.id = 'root';
      conf.rootElement.className = 'some classes'
      const { render } = Renderer(conf);

      render`
        <div></div>
      `;
      render`
        <span></span>
      `;
      render`
        <h1></h1>
      `;

      expect(conf.rootElement?.id).to.equal('root');
      expect(conf.rootElement.className).to.equal('some classes');
    });
  });
});
