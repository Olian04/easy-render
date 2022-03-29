import { AssertionError, expect } from 'chai';
import { describe, it } from 'mocha';

// tslint:disable-next-line:no-var-requires
const jsdom: () => void = require('mocha-jsdom');

import { render } from '../../src/api';

describe('Integrations test', () => {
  jsdom();

  beforeEach(() => {
    document.body.innerHTML = '<div id="root"></div>';
  });

  describe('render', () => {
    it('should be a tag function', () => {
      expect(typeof render).to.equal('function');

      try {
        const name = 'World';
        render`
          <h>Hello ${name}!</h>
        `;
      } catch {
        expect.fail();
      }
    });

    it('should add placeholder values for function when provided', () => {
      
    });
  });
});
