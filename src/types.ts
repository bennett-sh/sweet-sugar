
export type ConstructorArgs<T> = T extends new (...args: infer A) => any ? A : never

export type RecursivePartial<T> = {
  [P in keyof T]?: RecursivePartial<T[P]>
}
