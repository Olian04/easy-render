import { AssertionError, expect } from 'chai';
import { describe, it } from 'mocha';

import { tagFunction } from '../../src/tagFunction';

describe('Unit test', () => {
  describe('tagFunction', () => {
    it('should add placeholder values for function when provided', () => {
      const ctx =  tagFunction`
        <div click=${e => console.log(e.target)}></div>
      `;

      expect(ctx.xml).to.contain('placeholder-function-0');
      expect(ctx.dynamics.functions).to.not.be.empty;
    });
  });
});
