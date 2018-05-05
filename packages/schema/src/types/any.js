import { OPTIONAL_CONFIG, TYPE } from '../util'
import { anyTypeConfig } from './type-of'

/******************************************************************************/
// Main
/******************************************************************************/

function any (...args) {

  const config = anyTypeConfig(args)

  const any = (value, context) => {

  }

  any[TYPE] = 'Any'

  return any

}

any[OPTIONAL_CONFIG] = true

/******************************************************************************/
// Exports
/******************************************************************************/

export default any
