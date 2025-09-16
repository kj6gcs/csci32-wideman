'use client'

import { ReactNode } from 'react'
import { getSizeStyles, Size } from './size'
import { getvariantBackgroundStyles, getVariantOutlineStyles, Variant } from './variant'
import { getCommonStyles } from './tokens'

interface ButtonProps {
  children: ReactNode
  className?: string
  href?: string
  onClick?: () => void
  size?: Size
  variant?: Variant
}

export const Button = ({
  children,
  className,
  href,
  onClick,
  size = Size.MEDIUM,
  variant = Variant.PRIMARY,
}: ButtonProps) => {
  const sizeCssClasses = getSizeStyles(size)
  const variantBackgroundCssClasses = getvariantBackgroundStyles(variant)
  const variantOutlineCSSClasses = getVariantOutlineStyles(variant)
  const commonCssClasses = getCommonStyles()

  const completedCssClasses = `${commonCssClasses} ${sizeCssClasses} ${variantBackgroundCssClasses} ${variantOutlineCSSClasses} ${className}`
  return href ? (
    <a href={href} className={completedCssClasses}>
      {children}
    </a>
  ) : (
    <button className={completedCssClasses} onClick={onClick}>
      {children}
    </button>
  )
}
