import { hasNumericLength } from './is-array-like'

/******************************************************************************/
// Main
/******************************************************************************/

function first (arr) {

  if (this !== undefined)
    arr = this

  return hasNumericLength(arr)
    ? arr[0]
    : undefined

}

/******************************************************************************/
// Exports
/******************************************************************************/

export default first
