'use client'

import { ReactNode } from 'react'
import { Size } from './size'
import { Variant } from './variant'

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
  let sizeCssClasses = ''
  switch (size) {
    case Size.SMALL:
      sizeCssClasses = 'px-4 py-1 rounded shadow'
      break
    case Size.MEDIUM:
      sizeCssClasses = 'px-6 py-1.5 rounded-md shadow-md'
      break
    case Size.LARGE:
      sizeCssClasses = 'px-8 py-2 rounded-lg shadow-lg'
      break
  }
  let variantCssClasses = ''
  switch (variant) {
    case Variant.PRIMARY:
      variantCssClasses =
        'bg-blue-950 outline-stone-900 hover:bg-slate-900 shadow-xl shadow-black/50 active:bg-amber-400'
      break
    case Variant.SECONDARY:
      variantCssClasses = 'bg-lime-900 outline-lime-500 hover:bg-orange-700 shadow-xl shadow-black/50 active:bg-red-800'
      break
    case Variant.TERTIARY:
      variantCssClasses =
        'bg-cyan-800 outline-cyan-500 hover:bg-blue-950 shadow-xl shadow-black/50 active:bg-indigo-500'
      break
  }
  const commonCssClasses =
    'flex items-center justify-center text-white focus:outline outline-offset-2 transition-colors cursor-pointer'

  const completedCssClasses = `${sizeCssClasses} ${variantCssClasses} ${commonCssClasses} ${className}`
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
