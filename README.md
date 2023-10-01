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

Some advanced examples of the match statement can be found at [examples/match.ts](https://github.com/bennett-sh/sweet-sugar/tree/main/examples/match.ts).
