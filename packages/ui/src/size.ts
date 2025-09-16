export enum Size {
  SMALL,
  MEDIUM,
  LARGE,
}

export function getSizeStyles(size: Size) {
  switch (size) {
    case Size.SMALL:
      return 'px-4 py-1 rounded shadow'
    case Size.MEDIUM:
      return 'px-6 py-1.5 rounded-md shadow-md'
    case Size.LARGE:
      return 'px-8 py-2 rounded-lg shadow-lg'
  }
}
