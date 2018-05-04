import { TYPE_TEST_ONLY, OPTIONAL_CONFIG, TYPE } from '../util'

/******************************************************************************/
// Main
/******************************************************************************/

function any () {

  const any = (value, context) => {

    if (context === TYPE_TEST_ONLY)
      return true

    return value
  }

  any[TYPE] = 'Any'

  return any

}

any[OPTIONAL_CONFIG] = true

/******************************************************************************/
// Exports
/******************************************************************************/

export default any
