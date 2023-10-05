declare global {
  interface Object {
    let<T, TReturn>(this: T, cb: (v: T) => TReturn): TReturn extends void | undefined ? T : TReturn
  }
}

export const useLet = () => {
  Object.prototype.let = function<T, TReturn>(cb: (v: T) => TReturn): TReturn extends void | undefined ? T : TReturn {
    let result = cb(this)
    if(result === undefined) return this
    return result as any
  }
}