import type { RecursivePartial } from './types.js'
import { deepCompare } from './utils/objects.js'
import { Option } from './option.js'
import { Result } from './result.js'

/** The builder pattern for the match statement. */
export class MatchStatementBuilder<T, TReturn> {
  private collectedWhens: Array<[T | RecursivePartial<T>, (key: T) => any]> = []
  private collectedOther: ((key: T) => any) | undefined = undefined
  private value: TReturn | undefined = undefined
  private collectWhens: boolean = false

  constructor(
    private key: T
  ) {}

  /** Internal method for actual pattern matching */
  private matches<P extends T | RecursivePartial<T>>(pattern: P) {
    if(this.key === pattern) return true

    return deepCompare(this.key, pattern)
  }

  /**
   * Tells the match statement to wait for {@link finish} to be called before checking the statements & running the callbacks.
   * @example
   * match(true)
   *   .wait
   *   .when(true, () => console.log('second'))
   *   .noWait
   *   .when(true, () => console.log('first'))
   *   .finish //=> undefined
   *
   *   // Flow:
   *   // [wait]
   *   // [save match true -> print second for later]
   *   // [stop waiting]
   *   // [match true -> print first now]
   *   // [match saved true -> print second now]
   * @see {@link noWait}
   */
  public get wait(): this {
    this.collectWhens = true
    return this
  }
  /**
   * Tells the match statement to not wait for {@link finish} to be called before checking the statements & running the callbacks anymore.
   * Note: if {@link wait} was used before, previous {@link when} calls will still be postponed.
   * @see {@link wait}
   */
  public get noWait(): this {
    this.collectWhens = false
    return this
  }

  /**
   * Allows for matching a simple pattern.
   * @param pattern The pattern to match for. Can be a value or a partial object.
   * @param callback A method ran if the match is successfull. The return value will be later returned by the {@link finish} method if not overwritten.
   */
  public when$<P extends T | RecursivePartial<T>, TLocalReturn>(pattern: P, callback: (key: T) => TReturn | TLocalReturn): MatchStatementBuilder<T, TReturn | TLocalReturn> {
    if(this.collectWhens) {
      this.collectedWhens.push([
        pattern, callback
      ])
    } else {
      if(this.matches(pattern)) {
        this.value = callback(this.key as T) as any
      }
    }
    return this as any as MatchStatementBuilder<T, TReturn | TLocalReturn>
  }

  /**
   * Allows for matching a simple pattern.
   * Unlike {@link when$}, this method won't narrow the resulting object, which can sometimes cause conflicts when testing for properties on class instances.
   * @param pattern The pattern to match for. Can be a value or a partial object.
   * @param callback A method ran if the match is successfull. The return value will be later returned by the {@link finish} method if not overwritten.
   */
  public when<P extends T | RecursivePartial<T>, TLocalReturn>(pattern: P, callback: (key: Extract<T, P> & T) => TReturn | TLocalReturn): MatchStatementBuilder<T, TReturn | TLocalReturn> {
    if(this.collectWhens) {
      this.collectedWhens.push([
        pattern, callback
      ])
    } else {
      if(this.matches(pattern)) {
        this.value = callback(this.key as Extract<T, P> & T) as any
      }
    }
    return this as any as MatchStatementBuilder<T, TReturn | TLocalReturn>
  }

  /**
   * Allows for a conditional match statement.
   * @example
   * const hasPermission = match(user)
   *  .assuming({ role: 'admin' })
   *  .finish
   */
  public assuming<P extends T | RecursivePartial<T>>(pattern: P): MatchStatementBuilder<T, TReturn | boolean> {
    return this.when(pattern, () => true)
  }

  /**
   * Allows for a conditional match statement.
   * @example
   * const isHigherUp = match(user)
   *  .assumingNot({ role: 'admin' })
   *  .assumingNot({ role: 'moderator' })
   *  .finish
   */
  public assumingNot<P extends T | RecursivePartial<T>>(pattern: P): MatchStatementBuilder<T, TReturn | boolean> {
    return this.when(pattern, () => false)
  }

  /**
   * Allows you to easily match & extract a some value from an option
   * @example
   * match(Option.some("hello"))
   *  .some(value => console.log(value)) //= hello
   *  .none(() => console.log("no value :("))
   * @see {@link none}
   */
  public get some(): T extends Option<any> ? <TLocalReturn>(callback: (key: T extends Option<infer U> ? U : never) => TReturn | TLocalReturn) => MatchStatementBuilder<T, TReturn | TLocalReturn> : never {
    if(!(this.key instanceof Option)) throw new TypeError('this method is only available on the Option<T> type')
    return function<TLocalReturn>(callback: (key: T) => TReturn | TLocalReturn) {
      return this.when({ isSome: true }, () => callback(this.key.unwrap$()))
    } as any
  }

  /**
   * Allows you to easily match & extract a some value from an option
   * @example
   * match(Option.some("hello"))
   *  .some(value => console.log(value)) //= hello
   *  .none(() => console.log("no value :("))
   * @see {@link some}
   */
  public get none(): T extends Option<any> ? <TLocalReturn>(callback: () => TReturn | TLocalReturn) => MatchStatementBuilder<T, TReturn | TLocalReturn> : never {
    if(!(this.key instanceof Option)) throw new TypeError('this method is only available on the Option<T> type')
    return function<TLocalReturn>(callback: () => TReturn | TLocalReturn) {
      return this.when({ isNone: true }, callback)
    } as any
  }

  /**
   * Allows you to easily match & extract an okay value from a result
   * @example
   * match(Result.some("it worked!"))
   *  .ok(value => console.log(value)) //= hello
   *  .error(error => console.error(error))
   * @see {@link ok}
   */
  public get ok(): T extends Result<any, any> ? <TLocalReturn>(callback: (key: T extends Result<infer O, any> ? O : never) => TReturn | TLocalReturn) => MatchStatementBuilder<T, TReturn | TLocalReturn> : never {
    if(!(this.key instanceof Result)) throw new TypeError('this method is only available on the Result<T, E> type')
    return function<TLocalReturn>(callback: (key: T) => TReturn | TLocalReturn) {
      return this.when({ isOk: true }, () => callback(this.key.unwrap$()))
    } as any
  }

  /**
   * Allows you to easily match & extract an error value from a result
   * @example
   * match(Result.error('something went wrong :('))
   *  .ok(value => console.log(value)) //= hello
   *  .error(error => console.error(error))
   * @see {@link ok}
   */
  public get error(): T extends Result<any, any> ? <TLocalReturn>(callback: (error: T extends Result<any, infer E> ? E : never) => TReturn | TLocalReturn) => MatchStatementBuilder<T, TReturn | TLocalReturn> : never {
    if(!(this.key instanceof Result)) throw new TypeError('this method is only available on the Result<T, E> type')
    return function<TLocalReturn>(callback: (error: T) => TReturn | TLocalReturn) {
      return this.when({ isError: true }, () => callback(this.key.unwrapErr$()))
    } as any
  }

  /**
   * Allows you to create a default value for when no pattern matches.
   * Only applies if there's currently no valid return value from previous calls.
   * @param callback A method ran if the current value is undefined. The return value will be later returned by the {@link finish} method if not overwritten.
   */
  public otherwise<TLocalReturn>(callback: (key: T) => TLocalReturn | TReturn): MatchStatementBuilder<T, TReturn | TLocalReturn> {
    if(this.collectWhens) {
      this.collectedOther = callback
    } else {
      if(this.value === undefined) {
        this.value = callback(this.key) as any
      }
    }
    return this as any as MatchStatementBuilder<T, TReturn | TLocalReturn>
  }

  /**
   * Finishes the pattern by matching all awaited arms in order & by returning the final return value.
   */
  public get finish(): TReturn | undefined {
    for(const [pattern, callback] of this.collectedWhens) {
      if(this.matches(pattern)) {
        this.value = callback(this.key) as any
      }
    }
    if(this.value === undefined && this.collectedOther !== undefined) {
      this.value = this.collectedOther(this.key) as any
    }

    return this.value
  }
}

/**
 * A pattern matching function.
 * @param key The value which will be used for matching
 * @example
 * const canModerate = match({ name: "John Doe", age: 32, role: "admin" })
 *   .when({ role: "admin" }, () => true)
 *   .when({ role: "moderator" }, () => true)
 *   .otherwise(() => false)
 *   .finish //= true
 * @example
 * const parseYesNo = raw => match(raw)
 *   .when('yes', () => true)
 *   .when('no', () => false)
 *   .otherwise(() => { throw new Error('unknown value') })
 *   .finish
 *
 * parseYesNo('yes') //=> true
 * parseYesNo('no')  //=> false
 * parseYesNo('asd') //=> Error: unknown value
 * @returns {@link MatchStatementBuilder}
 */
export function match<TKey, TReturn = undefined>(key: TKey): MatchStatementBuilder<TKey, unknown> {
  return new MatchStatementBuilder<TKey, TReturn>(key)
}
