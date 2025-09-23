'use client'

import * as React from 'react'
import { getSizeStyles, Size } from './size'
import { getVariantBorderStyles, getVariantInputTextStyles, getVariantOutlineStyles, Variant } from './variant'
import { getInputCommonStyles } from './tokens'

/**
 * Extend native input props, but avoid clashing with the HTML 'size' attribute.
 */
export type InputProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> & {
  variant?: Variant
  size?: Size
  /**
   * Optional legacy convenience callback—if provided, we'll call it with e.target.value
   * in addition to any native onChange handler.
   */
  setValue?: (newValue: string) => void
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(function Input(
  { variant = Variant.PRIMARY, size = Size.MEDIUM, className, setValue, onChange, ...props },
  ref,
) {
  const sizeCss = getSizeStyles(size)
  const outlineCss = getVariantOutlineStyles(variant)
  const borderCss = getVariantBorderStyles(variant)
  const textCss = getVariantInputTextStyles(variant)
  const commonCss = getInputCommonStyles()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Call legacy setter if present
    if (setValue) setValue(e.target.value)
    // Preserve native onChange
    if (onChange) onChange(e)
  }

  const composedClassName = [sizeCss, outlineCss, borderCss, textCss, commonCss, 'text-black', className]
    .filter(Boolean)
    .join(' ')

  return <input ref={ref} className={composedClassName} onChange={handleChange} {...props} />
})

export default Input
export { Input }
