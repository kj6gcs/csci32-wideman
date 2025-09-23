'use client';

import * as React from 'react';
import { getSizeStyles, Size } from './size';
import {
  getVariantBorderStyles,
  getVariantInputTextStyles,
  getVariantOutlineStyles,
  Variant,
} from './variant';
import { getInputCommonStyles } from './tokens';

export type InputProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> & {
  variant?: Variant;
  size?: Size;
  /** Optional legacy convenience callback—also called on change */
  setValue?: (newValue: string) => void;
};

const Input = React.forwardRef<HTMLInputElement, InputProps>(function Input(
  { variant = Variant.PRIMARY, size = Size.MEDIUM, className, setValue, onChange, ...props },
  ref
) {
  const sizeCss = getSizeStyles(size);
  const outlineCss = getVariantOutlineStyles(variant);
  const borderCss = getVariantBorderStyles(variant);
  const textCss = getVariantInputTextStyles(variant);
  const commonCss = getInputCommonStyles();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (setValue) setValue(e.target.value);
    if (onChange) onChange(e);
  };

  const composedClassName = [
    sizeCss,
    outlineCss,
    borderCss,
    textCss,
    commonCss,
    'text-black',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return <input ref={ref} className={composedClassName} onChange={handleChange} {...props} />;
});

export default Input;
export { Input };
