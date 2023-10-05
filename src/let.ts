declare global {
  interface Object {
    let<T, TReturn>(this: T, cb: (v: T) => TReturn): TReturn
  }
}

export const useLet = () => {
  Object.prototype.let = function<T, TReturn>(cb: (v: T) => TReturn): TReturn {
    return cb(this)
  }
}