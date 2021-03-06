/*
 * String utilities
 */
import { intersperse } from 'ramda';
import { truncate as truncateArray } from './arrays';

export const capitalise =
  (s: string) => s.slice(0, 1).toUpperCase() + s.slice(1);


export const onlynl = (ss: TemplateStringsArray, ...placeholders: any[]) =>
  ss
    .reduce((acc, s, i) => `${acc}${placeholders[i - 1]}${s}`)
    .replace(/[ \t][ \t]+/g, '');


export const listify = (xs: string[], opts: { and?: boolean } = { and: true }) => {
  if (!opts.and) {
    return intersperse(', ', xs);
  }

  switch (xs.length) {
  case 0:
  case 1:
    return xs;
  case 2:
    return intersperse(' and ', xs);
  case 3:
  default:
    return intersperse(', ', xs.slice(0, -1))
      .concat(' and ')
      .concat(xs.slice(-1));
  }
};


export const readableListify = (xs: string[], opts?: { and: boolean }) =>
  listify(xs, opts).join('');

export const truncate = (s: string, limit: number, placeholder = '...') =>
  truncateArray(s.split(''), limit, placeholder).join('');
