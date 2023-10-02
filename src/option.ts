import { UnwrapError } from './utils/errors.js'

export class Option<T> {
  public static some<T>(data: T)  {
    return new Option(true, data)
  }
  public static get none(): Option<any> {
    return new Option(false, undefined)
  }
  public static from<T>(data: T | undefined | null): Option<T> {
    if(data === undefined || data === null) return Option.none
    return Option.some(data)
  }

  constructor(
    private _isSome: boolean,
    private data: T | undefined
  ) {}

  public get isSome(): boolean {
    return this._isSome
  }
  public get isNone(): boolean {
    return !this._isSome
  }


  public unwrap(): T | undefined {
    return this.data
  }

  public unwrap$(): T | never {
    if(!this._isSome) throw new UnwrapError('attempted to unwrap on a no-value option')
    return this.data
  }

  public unwrapOrElse(f: () => T | never): T {
    if(!this._isSome) return f()
    return this.unwrap()
  }

  public unwrapOr(or: T): T {
    if(!this._isSome) return or
    return this.unwrap()
  }
}
