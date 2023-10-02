# Sweet Sugar
#### A collection of tasty syntax utilities mostly inspired by Rust

## List of features
- [Match Statement](#match-statement)
- [Option](#option)
- [Result](#result)

### Match Statement
The match statement works by starting off with a key to match and then multiple chaining methods.
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

The match statement also supports deep pattern matching like so:
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
