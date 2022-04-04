# easy-render

[![NPM Version](https://img.shields.io/npm/v/easy-render)](https://www.npmjs.com/package/easy-render)
[![Bundle Size](https://img.shields.io/bundlephobia/minzip/easy-render)](https://bundlephobia.com/package/easy-render)
![Available Types](https://img.shields.io/npm/types/easy-render)
[![License](https://img.shields.io/github/license/olian04/easy-render)](LICENSE)
[![CircleCI](https://img.shields.io/circleci/build/github/Olian04/easy-render?label=tests&logo=circleci)](https://app.circleci.com/pipelines/github/Olian04/easy-render)
[![Test Coverage](https://img.shields.io/codecov/c/gh/olian04/easy-render?logo=codecov)](https://app.codecov.io/gh/Olian04/easy-render)

> Easy-Render is a vDOM renderer designed to be as easy to use as possible.

# Why Easy-Render

* It's small.
* It requires NO transpilation, everything runs as is in the browser.
* Everything is 100% typed and ready for Typescript!

# Installation

__NPM:__

[`npm install easy-render`](https://www.npmjs.com/package/easy-render)

__CDN:__

```html
<script src="https://cdn.jsdelivr.net/npm/easy-render/cdn/easy-render.js"></script>
<script>
  const { render } = easyRender;
</script>
```

# Help me help you

Please ⭐️ this repository!

<a href="https://www.buymeacoffee.com/olian04" target="_blank"><img src="https://www.buymeacoffee.com/assets/img/custom_images/orange_img.png" alt="Buy Me A Coffee" style="height: auto !important;width: auto !important;" ></a>

# Demos

* Hello World: <https://jsfiddle.net/um3Lac8x/1/>
* Table generation: <https://jsfiddle.net/35vLp9rh/2/>
* Updates: <https://jsfiddle.net/etp1xz02/9/>
* User input: <https://jsfiddle.net/wLh9t1rx/3/>

__TBD:__ translate the following demos from raw brynja to easy-render.

* Probabilistic Propagation: <https://jsfiddle.net/ebh7z13y/4/>
* Interpolation animation:
  1. <https://jsfiddle.net/2qg7dkwx/2/>
  2. <https://jsfiddle.net/t2zrf61o/2/>
  3. <https://jsfiddle.net/4u0f1mcz/3/>
* With [html-router](https://github.com/Olian04/html-router): <https://jsfiddle.net/ao941b5r/1/>

# Setup - Hello World

You can setup easy-render in one of two ways.

## Using the default "render" method

The default render method expects a dom element with id 'root' to exsist.

```ts
import { render } from 'easy-render';

render`
  <h2>Hello World!</h1>
`;
```

## Setting up your own Renderer instance

```ts
import { Renderer } from 'easy-render';

const { render } = Renderer({
  rootElement: document.getElementById('root')
});

render`
  <h2>Hello World!</h1>
`;
```

---

## Very much a work in progress

This library is still very much a work in progress and anything in this readme, ESPECIALLY beyond this point, is to be considered volatile and is likely to not work correctly or at all.

### r (render component)

`r` should return a brynja builder. This way `r` would be implicitly responsible for rendering its own subtree, independant from the entire tree.

```ts
type r = (staticSegments: TemplateStringsArray, ...dynamicSegments: DynamicSegments[]) => BrynjaBuilder
```

This would mean that the following code:

```ts
render`
  <div>
    ${[
      r`<h1>Hello World</h1>`
     ]}
  </div>
`;
```

...would result in the following brynja builder:

```ts
const _0 = _=>_
  .child('h1', _=>_
    .text('Hello World')
  )

render(_=>_
  .child('div', _=>_
    .do(_0)
  )
);
```

This whould also mean that `easy-render` would support full interop with `brynja`:

```ts
import { render } from 'easy-render';
import { createComponent } from 'brynja';

const HelloWorld = createComponent(() => _=>_
  .child('h1', _=>_
    .text('Hello World')
  )
);

render`
  <div>
    ${[
      HelloWorld()
     ]}
  </div>
`;
```

...and vice versa... interestingly:

```ts
import { r } from 'easy-render';
import { render } from 'brynja';

const HelloWorld = () => r`
  <h1>Hello World</h1>
`;

render(_=>_
  .child('div', _=>_
    .do(HelloWorld())
  )
);
```

Internallay `r` would make up the majority of the logic in the `render` function (mock implementation):

```ts
export function Renderer(config: { rootElement: HTMLElement, rootElementBuilder?: BuilderCB }): IRenderer {
  const brynja = BrynjaRenderer({
    rootElement: config.rootElement,
  });
  return {
    render: (staticSegments, ...dynamicSegments) => {
      const brynjaBuilder = r(staticSegments, ...dynamicSegments);

      // Render using brynja
      brynja.render(_=>_
        .do(config.rootElementBuilder ?? (_=> {
          // Echo props from root node if no custom rootElementBuilder was provided
          _.while(i => i < config.rootElement.attributes.length, (_, i)=> {
            const attribute = config.rootElement.attributes.item(i);
            if (attribute === null) { return; }
            _.prop(attribute.name, attribute.value);
          })
        }))
        .do(brynjaBuilder)
      );
    }
  }
}
```

Mock implementation of `r`:

```ts
const r = (staticSegments: TemplateStringsArray, ...dynamicSegments: DynamicSegments[]): BrynjaBuilder => {
  const { xml, dynamics } = processTagFunctionData({
    static: staticSegments,
    dynamic: dynamicSegments,
  });

  const DOM = parseXML(xml);

  const builder = constructBrynjaBuilder({ DOM, dynamics });

  return builder;
}
```

### MVP

```ts
import { render } from 'easy-render';

render`
<div class="box">
  <button
    click=${e => console.log(e)}
    style=${{
      background: 'orangered',
      ':hover': {
        background: 'skyblue',
      }
    }}
  >Click me</button>
</div>
`;
```

Data in `${}` may either be a CSS object, an event handler function, a string, a number, or a list of strings or numbers

1) Intermediate structure, to preserve clojures for functions, to reduce amount of parcing for style object, and to allow for caching the parsed XML result unless the string structure changes.

```html
<div class="box">
  <button
    click="placeholder-function-0"
    style="placeholder-object-0"
  >Click me</button>
</div>
```

2) Check if intermediate structure is the same as the cached structure.

3) If cache miss:
  I) Pass the intermediate structure into an xml parser.
  II) Create a Brynja builder for the resulting XML elements.

4) Call the stored Brynja builder, passing in any placeholder values as arguments.

Same as the following:

```ts
import { render } from 'brynja';

const builder = (args) =>
  render(_=>_
   .child('div', _=>_
     .class('box')
     .child('button', _=>_
       .on('click', args.function[0])
       .style(args.object[0])
       .text('Click me')
     )
   )
  );

builder({
  function: [
    e => console.log(e),
  ],
  object: [
    {background: 'orangered', ':hover':{background: 'skyblue'}},
  ],
});
```
