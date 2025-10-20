import React, { forwardRef } from 'react'
import { getSizeStyles, Size } from './size'
import { HTMLInputTypeAttribute } from 'react'
import { getVariantBorderStyles, getVariantInputTextStyles, getVariantOutlineStyles, Variant } from './variant'
import { getCommonStyles } from './tokens'

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  variant?: Variant
  size?: Size
  setValue?: (newValue: any) => void
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ variant = Variant.PRIMARY, size = Size.MEDIUM, setValue, onChange, className, ...props }, ref) => {
    const sizeCssClasses = getSizeStyles(size)
    const variantOutlineCssClasses = getVariantOutlineStyles(variant)
    const variantBorderCssClasses = getVariantBorderStyles(variant)
    const variantInputTextCssClasses = getVariantInputTextStyles(variant)
    const commonCssClasses = getCommonStyles()

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (setValue) setValue(e.target.value)
      if (onChange) onChange(e)
    }

    return (
      <input
        ref={ref}
        className={`${sizeCssClasses} ${variantBorderCssClasses} ${variantInputTextCssClasses} ${variantOutlineCssClasses} ${commonCssClasses} ${className ?? ''}`}
        onChange={handleChange}
        {...props}
      />
    )
  },
)

Input.displayName = 'Input'
