export enum Variant {
  PRIMARY,
  SECONDARY,
  TERTIARY,
}

export enum Size {
  SMALL,
  MEDIUM,
  LARGE,
}

export function getvariantBackgroundStyles(variant: Variant) {
  switch (variant) {
    case Variant.PRIMARY:
      return 'bg-blue-950 hover:bg-slate-900 shadow-xl shadow-black/50 active:bg-amber-400'
    case Variant.SECONDARY:
      return 'bg-lime-900 hover:bg-orange-700 shadow-xl shadow-black/50 active:bg-red-800'
    case Variant.TERTIARY:
      return 'bg-cyan-800 hover:bg-blue-950 shadow-xl shadow-black/50 active:bg-indigo-500'
  }
}

export function getVariantOutlineStyles(variant: Variant) {
  switch (variant) {
    case Variant.PRIMARY:
      return 'outline-amber-400'
    case Variant.SECONDARY:
      return 'outline-amber-500'
    case Variant.TERTIARY:
      return 'outline-amber-600'
  }
}

export function getVariantBorderStyles(variant: Variant) {
  switch (variant) {
    case Variant.PRIMARY:
      return 'border-amber-400'
    case Variant.SECONDARY:
      return 'border-lime-500'
    case Variant.TERTIARY:
      return 'border-cyan-500'
  }
}

export function getVariantInputTextStyles(variant: Variant) {
  switch (variant) {
    case Variant.PRIMARY:
      return 'text-black'
    case Variant.SECONDARY:
      return 'text-black'
    case Variant.TERTIARY:
      return 'text-black'
  }
}

export function getInputSizeStyles(size: Size) {
  switch (size) {
    case Size.SMALL:
      return 'px-3 py-1 rounded-md shadow-xl'
    case Size.MEDIUM:
      return 'px-4 py-1.5 rounded-md shadow-xl'
    case Size.LARGE:
      return 'px-5 py-2 rounded-md shadow-xl'
  }
}
