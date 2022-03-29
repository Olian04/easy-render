/*
 * TXML does have typescript types, but they have forgot about the "types" field in their package.json
 * so i need to import the types separately and map them to the implementation.
 */

import { parse as parseXML_ } from 'txml';
import type { parse as parseXMLType } from 'txml/dist/txml';

export const parseXML: typeof parseXMLType = parseXML_;
