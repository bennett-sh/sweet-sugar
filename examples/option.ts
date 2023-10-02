import { match } from '../src/match'
import { Option } from '../src/option'

type User = {
  name: string
  age: number
}

function getUser(isSignedIn = true): Option<User> {
  if(!isSignedIn) {
    return Option.none
  }
  return Option.some({ name: 'John Doe', age: 35 })
}

const user = getUser()

console.log(
  match(user)
    .when({ isSome: true }, safeUser => safeUser.unwrap$())
    .when({ isNone: true }, () => ({ error: 'not signed in' }))
    .finish
)

match(user) //=> Option<User>
  .some(user => console.log({ user })) //=> User
  .none(() => console.log('not signed in'))
