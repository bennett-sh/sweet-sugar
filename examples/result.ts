import { Err, Ok, Result } from '../src/result'
import { match } from '../src/match'

type User = {
  name: string
  age: number
}

type ApiError = {
  code: number
  message: string
}

function getUser(error = true): Result<User, ApiError> {
  return error ? Err({ code: 15, message: 'hello' }) : Ok({ name: 'John Doe', age: 35 })
}

const user = getUser(false)

console.log(
  match(user)
    .when({ isOk: true }, safeUser => safeUser.unwrap$())
    .when({ isError: true }, () => ({ error: 'not signed in' }))
    .finish
)

match(user) //=> Result<User, ApiError>
  .ok(user => console.log({ user })) //=> User
  .error(() => console.log('not signed in'))

console.log({
  username: user.map(({ name }) => name)
})
