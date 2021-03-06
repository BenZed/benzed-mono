import Type from './type'
import is from 'is-explicit'

import { isSchema, runValidators, define, $$schema } from '../util'

/******************************************************************************/
// Data
/******************************************************************************/

const MULTI_ROOT = Object.freeze({
  name: 'MultiType'
})

/******************************************************************************/
// Validators
/******************************************************************************/

function mustBeOneOf (value, context, index = 0, pass = !is.defined(value), error) {

  const schemas = this

  if (!pass) for (let i = index; i < schemas.length; i++) {

    const schema = schemas[i]
    const { validators } = schema[$$schema]

    try {

      const result = runValidators(validators, value, context)
      if (is(result, Promise))
        return result
          .catch(err => mustBeOneOf(value, context, i + 1, pass, err))

      pass = true
      value = result
    } catch (e) {
      error = e
      // catching an error means the type is invalid
    }

    if (pass)
      break
  }

  if (!pass)
    throw error || new Error(`value invalid.`)

  return value
}

/******************************************************************************/
// Main
/******************************************************************************/

class MultiType extends Type {

  constructor () {
    super(MULTI_ROOT)
  }

  children (children) {

    const hasChildren = children && children.length > 0
    if (hasChildren && !children.every(isSchema))
      throw new Error(`${this.constructor.name} must have schemas as children`)

    if (!hasChildren)
      throw new Error(`${this.constructor.name} must have children`)

    const typeValidator = children::mustBeOneOf::define({ name: 'isOneOfType' })
    return typeValidator
  }

}

/******************************************************************************/
// Exports
/******************************************************************************/

export default MultiType
