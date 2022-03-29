/* istanbul ignore next */
export class EasyRenderError extends Error {
  constructor(msg: string) {
    super(`Easy-Render: ${msg}`);
  }
}
