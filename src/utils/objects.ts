import type { RecursivePartial } from '../types.js'

export function deepCompare<T>(obj: T, pattern: RecursivePartial<T>): boolean {
  for (const key in pattern) {
    if (typeof obj[key] === 'object' && typeof pattern[key] === 'object') {
      if (!deepCompare(obj[key] as RecursivePartial<T[keyof T]>, pattern[key] as RecursivePartial<T[keyof T]>)) {
        return false
      }
    } else if (obj[key] !== pattern[key]) {
      return false
    }
  }
  return true
}
