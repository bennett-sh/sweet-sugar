
import { match } from '../src/lib'

interface User {
  name: string
  age: number
  role: 'user' | 'moderator' | 'admin'
}

const user: User = {
  name: 'John Doe',
  age: 35,
  role: 'admin'
}

const permissionLevel = match(user)
  .when({ role: 'admin' }, () => '*')
  .when({ role: 'moderator' }, () => 'moderation.*,user.*')
  .when({ role: 'user' }, () => 'user.*')
  .finish

console.log(permissionLevel) //= "*"

const parseYesNo = raw => match(raw)
  .when('yes', () => true)
  .when('no', () => false)
  .otherwise(() => { throw new Error('unknown value') })
  .finish

parseYesNo('yes') //=> true
parseYesNo('no')  //=> false
parseYesNo('asd') //=> Error: unknown value

match(true)
  .wait
  .when(true, () => console.log('second'))
  .noWait
  .when(true, () => console.log('first'))
  .finish //=> undefined
/*
  Flow:
  [wait]
  [save match true -> print second for later]
  [stop waiting]
  [match true -> print first now]
  [match saved true -> print second now]
*/
