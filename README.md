<div align="center">
  <h1>🍫Sweet Sugar</h1>
  <h4>A collection of tasty syntax utilities mostly inspired by Rust</h4>
</div>

## List of features
- [Match Statement](#match-statement)
- [Builder](#builder)
- [Option](#option)
- [Result](#result)
- [Let](#let)

### Match Statement
The match statement works by starting off with a key to match followed by multiple chaining methods.
```ts
match(`hello`)
  .when('hello', () => 'en')
  .when('hallo', () => 'de')
  .when('salut', () => 'fr')
  .when('ciao', () => 'it')
  .when('你好', () => 'zh')
  .otherwise(language => { throw new Error(`unsupported language: ${language}`) })
  .finish //= en
```

The match statement also supports deep pattern matching & narrowing like so:
```ts
type User = {
  name: string,
  age: number,
  role: 'admin' | 'moderator' | 'user',
  permissions?: {
    moderation?: boolean
  }
}

const user: User = {
  name: 'John Doe',
  age: 35,
  role: 'user',
  permissions: {
    moderation: true
  }
}

const canModerate = match(user)
  .when({ role: 'admin' }, () => true)
  .when({ role: 'moderator' }, () => true)
  .when({ // Only match when it's a normal user & they have been granted a special permission
    role: 'user',
    permissions: {
      moderation: true
    }
  }, () => true)
  .otherwise(() => false)
  .finish //= true
```

[Advanced Examples](examples/match.ts)

### Option
An option is a type to represent some kind of data that may not exist in a safer way than undefined/null.

```ts
const user: Option<User> = await getUser()

console.log(
  user.unwrap$() //=> throws an error when user is none
)
```

[Advanced Examples](examples/option.ts)

### Result
A class to improve JS error handling by forcing you to either handle or explicitly supress errors.

```ts
const user: Result<User, ApiError> = await getUser()

match(user)
  .ok(user => {
    alert(`your name is ${user.name}`)
  })
  .error(error => {
    console.error(`something went wrong: ${error}`)
  })
```

[Advanced Examples](examples/result.ts)

### Let
Some sugar that allows you to chain methods in a more concise way.

```ts
import 'sweet-sugar/let'

'my string'.let(console.log)

// so instead of
myFunctionProcessingTheReplacedValue('Hello World'.replace('o', '0')).charAt(0)
// you can write
'Hello World'.replace('o', '0').let(myFunctionProcessingTheReplacedValue).charAt(0)

'mid-chain logging'.replace('-', '_').let(console.log).replace('_', '-')
```

[Advanced Examples](examples/let.ts)

### Builder
A function that allows you to use the building pattern on classes which don't support it themselves.

```ts
class MyClass { ... }

const instance = build(MyClass, 'my constructor argument')
  .set('test', true)
  .update('doSomething', old => (...args: Array<any>) => {
    console.log('before')
    const result = old(...args) //=> 42
    console.log('after')
    return result
  })

instance.test //=> true
instance.doSomething()
// before
// after
//=> 42
```

[Advanced Examples](examples/builder.ts)

