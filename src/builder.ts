import type { ConstructorArgs } from './types'

export class Builder<T extends InstanceType<TConstructor>, TConstructor extends new (...args) => any> {
  private base: T

  constructor(
    clazz: TConstructor,
    constructorParameters: ConstructorArgs<TConstructor> = [] as any
  ) {
    this.base = new clazz(...constructorParameters)
  }

  public set<TKey extends keyof T>(property: TKey, value: T[TKey]): Builder<T, TConstructor> {
    this.base[property] = value
    return this
  }

  public update<TKey extends keyof T>(property: TKey, fn: (value: T[TKey], base: T) => T[TKey]): Builder<T, TConstructor> {
    this.base[property] = fn(this.base[property], this.base)
    return this
  }

  public build() {
    return this.base
  }
}

export function build<T extends new (...args: any) => any>(clazz: T, ...constructorParameters: ConstructorParameters<T>) {
  return new Builder<InstanceType<T>, T>(clazz, constructorParameters)
}
