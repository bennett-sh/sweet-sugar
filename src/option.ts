import { UnwrapError } from './utils/errors.js'

/**
 * A type for representing a value that may not exist.
 * @example
 * async function getUser(): Promise<Option<User>> {
 *  const result = await fetch('/user')
 *  const user: User | null = await result.json()
 *
 *  return Option.from(user)
 * }
 *
 * const user = await getUser()
 *
 * user.map(u => u.name).unwrap() //=> string | undefined
*/
export class Option<T> {
  public static some<T>(data: T)  {
    return new Option(true, data)
  }
  public static get none(): Option<any> {
    return new Option(false, undefined)
  }
  /** Creates an option from a value T, which maybe null or undefined. */
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


  /** Returns the actual value or undefined if it's an Option.none */
  public unwrap(): T | undefined {
    return this.data
  }

  /** Returns the actual value or throws an unwrap error. */
  public unwrap$(): T | never {
    if(!this._isSome) throw new UnwrapError('attempted to unwrap on a no-value option')
    return this.data
  }

  /** Returns the actual value or the result of a callback, which may also throw an error */
  public unwrapOrElse(f: () => T | never): T {
    if(!this._isSome) return f()
    return this.unwrap()
  }

  /** Returns the actual value or the first parameter */
  public unwrapOr(or: T): T {
    if(!this._isSome) return or
    return this.unwrap()
  }

  /**
   * Allows you to safely use the value without checking whether it exists
   * @example
   * const user: Option<User> = getUser();
   * const userName = user.map(({ name }) => name).unwrap$(); // note how we delay the unwrapping to end of the chain
  */
  public map<TNew>(f: (value: T) => TNew): Option<TNew> {
    if(this.isNone) return Option.none
    return Option.some(f(this.unwrap$()))
  }

  /**
   * Allows you to safely use the value asynchronically without checking whether it exists
  */
  public async mapAsync<TReturn>(f: (value: T) => Promise<TReturn>): Promise<Option<T | TReturn>> {
    if(this.isSome) {
      return Option.some(await f(this.unwrap$()))
    }
    return this
  }
}
