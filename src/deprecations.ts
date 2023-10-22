/**
 * @deprecated Instead of using {@link useLet}, you should now put an import statement to `sweet-sugar/let` at the top of your file.
 * @example
 * // Old:
 * import { useLet } from 'sweet-sugar'
 * useLet()
 * // New:
 * import 'sweet-sugar/let'
 */
export function useLet() {
  console.warn('useLet has been deprecated in favor of sweet-sugar/let. see jsdoc deprecation for more information')
}
