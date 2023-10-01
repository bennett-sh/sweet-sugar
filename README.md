# Sweet Sugar
#### A collection of tasty syntax utilities mostly inspired by Rust

## List of features
- [Match Statement](#match-statement)

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

Some advanced examples of the match statement can be found at [examples/match.ts](https://github.com/bennett-sh/sweet-sugar/tree/main/examples/match.ts).
