import { build } from '../src/lib'

class MyClass {
  constructor(_n: number) {}

  public myVal = 0

  public test() {
    return 42
  }
}

const instance = build(MyClass, 42)
  .set('myVal', 23)
  .update('test', (oldFn, base) => () => {
    console.log(`test: ${base.myVal}`)
    return oldFn()
  })
  // @ts-ignore This doesn't work because `newProp` doesn't exist.
  .update('newProp', notAProp => {
    console.log(notAProp)
    return 50
  })
  .build()

console.log({
  ...instance
})
instance.test()
