/*
 * Importing txml from its npm library includes Node.js code, which wont work in the browser
 */

import { parse } from './txml.src/txml';

interface XMLNode {
  tagName: string;
  attributes: {
    [k: string]: string;
  };
  children: XMLNode[];
}

export const parseXML = (str: string) => parse(str) as XMLNode[];
