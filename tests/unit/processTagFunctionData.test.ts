import { AssertionError, expect } from 'chai';
import { describe, it } from 'mocha';

import { DynamicSegments } from '../../src/types/DynamicSegments';
import { processTagFunctionData } from '../../src/processTagFunctionData';

const tagFunction = (staticSegments: TemplateStringsArray, ...dynamicSegments: DynamicSegments[]) => processTagFunctionData({
  statics: staticSegments,
  dynamics: dynamicSegments,
});

describe('Unit test', () => {
  describe('processTagFunctionData', () => {
    it('should add placeholder values for function when provided', () => {
      const ctx =  tagFunction`
        <div click=${e => console.log(e.target)}></div>
      `;

      expect(ctx.xml).to.contain('placeholder-function-0');
      expect(ctx.dynamics.functions).to.not.be.empty;
      expect(ctx.dynamics.objects).to.be.empty;
    });

    it('should add placeholder values for object when provided', () => {
      const ctx =  tagFunction`
      <div style="${{ background: 'blue' }}"></div>
      `;

      expect(ctx.xml).to.contain('placeholder-object-0');
      expect(ctx.dynamics.objects).to.not.be.empty;
      expect(ctx.dynamics.functions).to.be.empty;
    });

    it('should inline string when provided', () => {
      const name = 'World';
      const ctx =  tagFunction`
        <div>Hello ${name}!</div>
      `;

      expect(ctx.xml).to.contain('Hello World!');
      expect(ctx.dynamics.objects).to.be.empty;
      expect(ctx.dynamics.functions).to.be.empty;
    });

    it('should add placeholder for dynamic children when provided', () => {
      const name = 'World';
      const ctx =  tagFunction`
        <div>
          ${[
            _=>_
              .child('div', _=>_
                .text('Hello World')
              )
          ]}
        </div>
      `;

      expect(ctx.xml).to.contain('placeholder-component-0');
      expect(ctx.dynamics.objects).to.be.empty;
      expect(ctx.dynamics.functions).to.be.empty;
      expect(ctx.dynamics.components).to.not.be.empty;
    });
  });
});
