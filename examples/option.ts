import { type Option, None, Some } from '../src/option'
import { match } from '../src/match'

type User = {
  name: string
  age: number
}

function getUser(isSignedIn = true): Option<User> {
  if(!isSignedIn) {
    return None
  }
  return Some({ name: 'John Doe', age: 35 })
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

console.log({
  username: user.map(({ name }) => name)
})
