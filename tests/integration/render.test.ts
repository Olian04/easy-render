import { AssertionError, expect } from 'chai';
import { describe, it } from 'mocha';

// tslint:disable-next-line:no-var-requires
const jsdom: () => void = require('mocha-jsdom');

import { r, render as defaultRender, Renderer } from '../../src/api';

describe('Integrations test', () => {
  jsdom();

  beforeEach(() => {
    document.body.innerHTML = '<div id="root"></div>';
  });

  describe('render', () => {
    it('should be a tag function', () => {
      expect(typeof defaultRender).to.equal('function');

      try {
        defaultRender``;
      } catch {
        expect.fail();
      }
    });

    it('should render a single div with an innerText', () => {
      const conf = {
        rootElement: document.createElement('div'),
      };
      const { render } = Renderer(conf);

      render`
        <div>Hello World</div>
      `;

      expect(conf.rootElement?.children[0].textContent).to.equal('Hello World');
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

    it('should render dynamic children when provided', () => {
      const conf = {
        rootElement: document.createElement('div'),
      };
      const { render } = Renderer(conf);

      render`
      <div>
        ${[1, 2, 3].map(v => r`
          <div>${v}</div>
        `)}
      </div>
    `;

    console.log(conf.rootElement.outerHTML);

      expect(conf.rootElement.children[0].children.length).to.equal(3);

      expect(conf.rootElement.children[0].children[0].tagName).to.equal('DIV');
      expect(conf.rootElement.children[0].children[1].tagName).to.equal('DIV');
      expect(conf.rootElement.children[0].children[2].tagName).to.equal('DIV');

      expect(conf.rootElement.children[0].children[0].textContent).to.equal('1');
      expect(conf.rootElement.children[0].children[1].textContent).to.equal('2');
      expect(conf.rootElement.children[0].children[2].textContent).to.equal('3');
    });


  });
});
