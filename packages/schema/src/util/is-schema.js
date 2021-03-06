import is from 'is-explicit'

/******************************************************************************/
// Data
/******************************************************************************/

const $$schema = Symbol.for('schema-data')

/******************************************************************************/
// Main
/******************************************************************************/

function isSchema (input) {
  if (this !== undefined)
    input = this

  return is.func(input) && is.plainObject(input[$$schema])
}

/******************************************************************************/
// Exports
/******************************************************************************/

export default isSchema

export {
  $$schema
}
