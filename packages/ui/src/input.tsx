import { getSizeStyles, Size } from './size'
import { HTMLInputTypeAttribute } from 'react'
import { getVariantBorderStyles, getVariantInputTextStyles, getVariantOutlineStyles, Variant } from './variant'
import { getCommonStyles } from './tokens'
import { getInputCommonStyles } from './tokens'

interface InputProps {
  variant?: Variant
  size?: Size
  placeholder?: string
  type?: HTMLInputTypeAttribute
  value?: any
  setValue?: (newValue: any) => void
  defaultValue?: any
  name: string
  id: string
}

export function Input({
  variant = Variant.PRIMARY,
  size = Size.MEDIUM,
  value,
  name,
  id,
  defaultValue,
  setValue,
  type = 'text',
  placeholder,
}: InputProps) {
  const sizeCssClasses = getSizeStyles(size)
  const variantOutlineCSSClasses = getVariantOutlineStyles(variant)
  const variantBorderCSSClasses = getVariantBorderStyles(variant)
  const variantInputTextCSSClasses = getVariantInputTextStyles(variant)
  const commonCssClasses = getInputCommonStyles()

  return (
    <input
      className={`${sizeCssClasses} ${variantOutlineCSSClasses} ${variantBorderCSSClasses} ${variantInputTextCSSClasses} ${commonCssClasses} text-black`}
      name={name}
      id={id}
      defaultValue={defaultValue}
      placeholder={placeholder}
      type={type}
      value={value}
      onChange={setValue ? (newValue) => setValue(newValue.currentTarget.value) : () => {}}
    />
  )
}
