export enum FontSizeEnum {
  base = 16, // px
  body = '1rem',
  heading1 = '2.75rem',
  heading2 = '2.125rem',
  heading3 = '1.625rem',
  heading4 = '1.25rem',
  footer = '0.875rem',
  special = '3rem',
  emphasis = '1.125rem',
  XL = '4rem',
}

export enum FontFamilyEnum {
  main = 'Roboto',
  special = 'Nunito',
}

export enum FontWeightEnum {
  light = 300,
  regular = 400,
  heavy = 700,
}

export const Fonts = {
  size: FontSizeEnum,
  family: FontFamilyEnum,
  weight: FontWeightEnum,
};
