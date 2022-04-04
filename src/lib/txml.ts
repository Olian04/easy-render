/*
 * Importing txml from its npm library includes Node.js code, which wont work in the browser
 */

import { parse } from './txml.src/txml';
import { XMLNode } from '../types/XMLNode';

export const XML = {
  parse:  (str: string) => parse(str) as XMLNode[],
}
