# easy-render

[![NPM Version](https://img.shields.io/npm/v/easy-render)](https://www.npmjs.com/package/easy-render)
[![Bundle Size](https://img.shields.io/bundlephobia/minzip/easy-render)](https://bundlephobia.com/package/easy-render)
![Available Types](https://img.shields.io/npm/types/easy-render)
[![License](https://img.shields.io/github/license/olian04/easy-render)](LICENSE)
[![CircleCI](https://img.shields.io/circleci/build/github/Olian04/easy-render?label=tests&logo=circleci)](https://app.circleci.com/pipelines/github/Olian04/easy-render)
[![Test Coverage](https://img.shields.io/codecov/c/gh/olian04/easy-render?logo=codecov)](https://app.codecov.io/gh/Olian04/easy-render)

> Easy-Render is a vdom renderer with an easy to understand and easy use functional interface.

## WIP

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

Resources:

* XML parser: <https://github.com/TobiasNickel/tXml>
