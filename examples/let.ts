import '../src/let.js'

'hello'.let(console.log) // prints "hello" to console

// log values mid-chain
const someValue = 'my chain'.replace(' ', '_').let(console.log).replace('chain', 'asd')
