# easy-render

[![NPM Version](https://img.shields.io/npm/v/easy-render)](https://www.npmjs.com/package/easy-render)
[![Bundle Size](https://img.shields.io/bundlephobia/minzip/easy-render)](https://bundlephobia.com/package/easy-render)
![Available Types](https://img.shields.io/npm/types/easy-render)
[![License](https://img.shields.io/github/license/olian04/easy-render)](LICENSE)
[![CircleCI](https://img.shields.io/circleci/build/github/Olian04/easy-render?label=tests&logo=circleci)](https://app.circleci.com/pipelines/github/Olian04/easy-render)
[![Test Coverage](https://img.shields.io/codecov/c/gh/olian04/easy-render?logo=codecov)](https://app.codecov.io/gh/Olian04/easy-render)

> Easy-Render is a vDOM renderer designed to be as easy to use as possible.

```ts
import { render } from 'easy-render';

const name = 'Easy-Render';

render`
  <p>Hello ${name}!</p>
`;
```

```ts
import { render, r } from 'easy-render';

const listElements = (elements = []) => {
  render`
    <ul>
      ${elements.map(v => r`
        <li>${v}</li>
      `)}
    </ul>
  `;
}

listElements();
let numbers = [];
setInterval(() => {
  numbers.push(numbers.length);
  listElements(numbers);
}, 1000);

```

---

## r (render component)


`r` should return a brynja component? This way `r` would be implicitly responsible for rendering its own subtree, independant from the entire tree.

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
const _0 = ({}) => _=>_
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
import { createComponent } form 'brynja';

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
import { render } form 'brynja';

const HelloWorld = () => r`
  <h1>Hello World</h1>
`;

render(_=>_
  .child('div', _=>_
    .do(HelloWorld())
  )
);
```


### WIP

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
