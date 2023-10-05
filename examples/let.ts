import { useLet } from '../src/lib'

console.log('will error'.let === undefined)

// enable let syntax globally
useLet()

'hello'.let(console.log) // prints "hello" to console

// log values mid-chain
const someValue = 'my chain'.replace(' ', '_').let(console.log).replace('chain', 'asd')
