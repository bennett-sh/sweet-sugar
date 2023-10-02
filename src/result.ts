
export const ResultStatus = {
  Ok: 'ok',
  Err: 'error'
} as const
export type ResultStatus = typeof ResultStatus[keyof typeof ResultStatus]

export class UnwrapError extends Error {}

/**
 * A class to improve JS error handling by forcing you to either handle or explicitly supress errors.
 * @example
 * const user: Result<User, ApiError> = await getUser()
 *
 * if(user.isOk) {
 *  console.log(`signed in as ${user.unwrap$()}`)
 * } else {
 *  console.error(`failed to sign in: `, user.unwrapErr$())
 * }
 */
export class Result<T, E> {
  private data: T | undefined
  private error: E | undefined

  public static ok<T>(data: T) {
    return new Result<T, any>(ResultStatus.Ok, data)
  }
  public static empty<E>() {
    return new Result<void, E>(ResultStatus.Ok, (() => {})())
  }
  public static error<E>(error: E) {
    return new Result<any, E>(ResultStatus.Err, error)
  }

  constructor(private status: ResultStatus, data: T | E) {
    if(this.isOk) {
      this.data = data as T
    } else {
      this.error = data as E
    }
  }

  public get isOk(): boolean {
    return this.status === ResultStatus.Ok
  }

  public get isError(): boolean {
    return this.status === ResultStatus.Err
  }

  /** Returns the actual value or undefined if there's an error */
  public unwrap(): T | undefined {
    return this.data
  }

  /** Returns the actual value or throws an unwrap error. */
  public unwrap$(): T | never {
    if(this.status === ResultStatus.Err) throw new UnwrapError('attempted to unwrap on an errored result')
    return this.data!
  }

  /** Returns the error or undefined if there's no error */
  public unwrapErr(): E | undefined {
    return this.error
  }

  /** Returns the error or throws an unwrap error if there's no error. */
  public unwrapErr$(): E | never {
    if(this.status === ResultStatus.Ok) throw new UnwrapError('attempted to unwrap error on an okay result')
    return this.error!
  }

  /** Returns the actual value or the result of a callback, which may also throw an error */
  public unwrapOrElse(f: (err: E) => T | never): T {
    if(this.status === ResultStatus.Err) return f(this.unwrapErr$())
    return this.unwrap$()
  }

  /** Returns the actual value or the first parameter */
  public unwrapOr(or: T): T {
    if(this.status === ResultStatus.Err) return or
    return this.unwrap$()
  }

  /**
   * Returns the tuple ({@link T} | undefined, {@link E} | undefined) allowing you to write code in a go-like syntax.
   * @example
   * const [user, error] = await getUser()
   * if(error) {
   *  return Result.error(error)
   * }
   * return Result.ok(user)
   */
  public unwrapSplit(): [T | undefined, E | null] {
    if(this.isOk) return [this.unwrap$(), null]
    return [undefined, this.unwrapErr$()]
  }

  /**
   * Allows you to safely use the value without checking whether it errored.
   * @example
   * const user: Result<User, ApiError> = await getUser();
   * const userName = user.map(({ name }) => name).unwrap$(); // note how we delay the unwrapping to end of the chain
  */
  public map<TReturn>(f: (value: T) => TReturn): Result<T | TReturn, E> {
    if(this.isOk) {
      return Result.ok(f(this.unwrap$()))
    }
    return this
  }

  /**
   * Allows you to safely use the value asynchronically without checking whether it errored.
  */
  public async mapAsync<TReturn>(f: (value: T) => Promise<TReturn>): Promise<Result<T | TReturn, E>> {
    if(this.isOk) {
      return Result.ok(await f(this.unwrap$()))
    }
    return this
  }


  /**
   * Allows you to safely use the value without checking whether it errored.
   * @example
   * const user: Result<User, ApiError> = await getUser();
   * const userName = user.mapError(error => {
   *  console.error(error)
   *  return error
   * }).unwrap$(); // note how we delay the unwrapping to end of the chain
  */
  public mapError(f: (error: E) => E): this {
    if(this.isOk) {
      this.error = f(this.unwrapErr$())
    }
    return this
  }
}

/** Wraps a successful result value into a result */
export function Ok<T>(data: T) {
  return Result.ok(data)
}
/** Wraps an error into a result */
export function Err<E>(error: E) {
  return Result.error(error)
}
/** An okay result with no value */
export const Blank = new Result<void, unknown>(ResultStatus.Ok, (() => {})())

/** Converts a normal function into a function returning a result. */
export function toResult<T, E>(f: (...args: any[]) => T, ...args: any[]): Result<T, E> {
  try {
    return Ok(f(...args))
  } catch(err) {
    return Err(err)
  }
}
