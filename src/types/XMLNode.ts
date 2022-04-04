
export type XMLNode  = string | {
  tagName: string;
  attributes: {
    [k: string]: string;
  };
  children: XMLNode[];
}
