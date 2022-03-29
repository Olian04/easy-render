import { AssertionError, expect } from 'chai';
import { describe } from 'mocha';

// tslint:disable-next-line:no-var-requires
const jsdom: () => void = require('mocha-jsdom');

// import { render } from '../../src/api;

describe('Integrations test', () => {
  jsdom();

  beforeEach(() => {
    document.body.innerHTML = '<div id="root"></div>';
  });

  describe('stub', () => {
    it('stub', () => {
      expect(true).to.be.true;
    });
  });

});
